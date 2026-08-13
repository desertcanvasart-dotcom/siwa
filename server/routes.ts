import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import multer from "multer";
import sharp from "sharp";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import {
  insertExperienceSchema,
  updateExperienceSchema,
  insertImageSchema,
  insertPageSchema,
  insertPageBlockSchema,
  insertBlockTemplateSchema,
  insertHotelSchema,
  updateHotelSchema,
  hotelRequestSchema
} from "@shared/schema";
import { sendEmail, generateHotelRequestEmail, generateEnquiryEmail, generateVisitorConfirmationEmail, escapeHtml } from "./email";
import { objectStorageEnabled, putObject, deleteObjectByUrl, mediaKey } from "./object-storage";
import { chat } from "./chat-service";
import { db } from "./db";
import { aiKnowledge } from "@shared/schema";
import { eq } from "drizzle-orm";

// Simple rate limiting store
interface RateLimit {
  count: number;
  lastReset: number;
}

const rateLimitStore = new Map<string, RateLimit>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 3; // Max 3 requests per IP per window

// Evict expired entries so the store doesn't grow forever — one IP per
// visitor, kept only for the duration of its window.
setInterval(() => {
  const now = Date.now();
  rateLimitStore.forEach((entry, ip) => {
    if (now - entry.lastReset > RATE_LIMIT_WINDOW) rateLimitStore.delete(ip);
  });
}, RATE_LIMIT_WINDOW).unref();

// Rate limiting middleware
function rateLimitMiddleware(req: any, res: any, next: any) {
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();

  let rateLimit = rateLimitStore.get(clientIP);

  // Reset counter if window has passed
  if (!rateLimit || (now - rateLimit.lastReset) > RATE_LIMIT_WINDOW) {
    rateLimit = {
      count: 0,
      lastReset: now
    };
  }

  rateLimit.count++;
  rateLimitStore.set(clientIP, rateLimit);

  if (rateLimit.count > RATE_LIMIT_MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please wait 15 minutes before trying again.',
      retryAfter: Math.ceil((rateLimit.lastReset + RATE_LIMIT_WINDOW - now) / 1000)
    });
  }

  next();
}

// Additional validation for hotel requests
function validateHotelRequest(req: any, res: any, next: any) {
  const { name, email, message } = req.body;

  // Check for suspicious patterns (basic spam detection)
  const spamKeywords = ['viagra', 'casino', 'lottery', 'winner', 'congratulations', 'click here', 'free money'];
  // No `g` flag here — a global regex keeps lastIndex state across
  // .test() calls, which made results depend on the previous input.
  const suspiciousPatterns = [
    /https?:\/\/\S+/i, // URLs in name or message
    /[A-Z]{10,}/, // Too many consecutive capitals
    /(.)\1{5,}/, // Repeated characters (aaaaaa)
  ];

  const textToCheck = `${name || ''} ${message || ''}`.toLowerCase();

  // Check for spam keywords
  const hasSpamKeywords = spamKeywords.some(keyword => textToCheck.includes(keyword));

  // Check for suspicious patterns
  const hasSuspiciousPatterns = suspiciousPatterns.some(pattern =>
    pattern.test(name || '') || pattern.test(message || '')
  );

  if (hasSpamKeywords || hasSuspiciousPatterns) {
    return res.status(400).json({
      success: false,
      message: 'Your request contains invalid content. Please review and try again.'
    });
  }

  // Additional validation
  if (name && name.length > 100) {
    return res.status(400).json({
      success: false,
      message: 'Name is too long. Please use less than 100 characters.'
    });
  }

  if (message && message.length > 2000) {
    return res.status(400).json({
      success: false,
      message: 'Message is too long. Please use less than 2000 characters.'
    });
  }

  next();
}

// JWT secret — must come from the environment. Without it, fall back
// to a random per-boot secret: logins still work, but every issued
// token dies on restart. Never a hardcoded string an attacker can use
// to forge admin tokens.
const JWT_SECRET =
  process.env.JWT_SECRET ||
  (() => {
    console.warn(
      "[auth] JWT_SECRET is not set — using a random per-boot secret. " +
        "Admin sessions will not survive a restart. Set JWT_SECRET in the environment.",
    );
    return crypto.randomBytes(32).toString("hex");
  })();

// Multer configuration for file uploads
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: multerStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|webm|mov/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'));
    }
  }
});

// Admin authentication middleware
const authenticateAdmin = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const admin = await storage.getAdmin(decoded.adminId);

    if (!admin) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded files
  app.use('/uploads', (req, res, next) => {
    // Enable CORS for uploads
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  }, express.static(uploadDir));

  // Public API: Get all experiences
  app.get('/api/experiences', async (req, res) => {
    try {
      const experiences = await storage.getExperiences();
      res.json(experiences);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      res.status(500).json({ message: 'Failed to fetch experiences' });
    }
  });

  // Public API: Get all hotels (from storage — DB-backed when
  // DATABASE_URL is set, in-memory otherwise).
  app.get('/api/hotels', async (req, res) => {
    try {
      const destination = req.query.destination as string | undefined;
      const all = destination
        ? await storage.getHotelsByDestination(destination)
        : await storage.getHotels();
      res.json(all);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      res.status(500).json({ message: 'Failed to fetch hotels' });
    }
  });

  // Public API: Get hotel by slug — 404 on drafts so the detail
  // page redirects back to the hub.
  app.get('/api/hotels/:slug', async (req, res) => {
    try {
      const slug = req.params.slug;
      const hotel = await storage.getHotelBySlug(slug);

      if (!hotel || !hotel.isActive) {
        return res.status(404).json({ message: 'Hotel not found' });
      }

      res.json(hotel);
    } catch (error) {
      console.error('Error fetching hotel:', error);
      res.status(500).json({ message: 'Failed to fetch hotel' });
    }
  });

  // Public API: List blog posts
  app.get('/api/blog', async (_req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      res.status(500).json({ message: 'Failed to fetch blog posts' });
    }
  });

  // Public API: Get blog post by slug
  app.get('/api/blog/:slug', async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post || !post.isPublished) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      res.json(post);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      res.status(500).json({ message: 'Failed to fetch blog post' });
    }
  });

  // Admin login
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { username, password } = req.body;

      const admin = await storage.getAdminByUsername(username);
      if (!admin) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ adminId: admin.id }, JWT_SECRET, { expiresIn: '24h' });

      res.json({
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });

  // Public API: Get all videos
  app.get('/api/videos', async (req, res) => {
    try {
      const category = req.query.category as string;
      let videos;

      if (category) {
        videos = await storage.getVideosByCategory(category);
      } else {
        videos = await storage.getVideos();
      }

      res.json(videos);
    } catch (error) {
      console.error('Error fetching videos:', error);
      res.status(500).json({ message: 'Failed to fetch videos' });
    }
  });

  // Public API: Get video by slug
  app.get('/api/videos/:slug', async (req, res) => {
    try {
      const slug = req.params.slug;
      console.log('Looking for video with slug:', slug);

      const video = await storage.getVideoBySlug(slug);

      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }

      res.json(video);
    } catch (error) {
      console.error('Error fetching video:', error);
      res.status(500).json({ message: 'Failed to fetch video' });
    }
  });

  // Public API: Hotel Request (Send Email)
  app.post('/api/hotel-requests', rateLimitMiddleware, validateHotelRequest, async (req, res) => {
    try {
      console.log('Received hotel request:', req.body);

      // Validate request data with Zod schema
      const validatedData = hotelRequestSchema.parse(req.body);

      // Generate email content
      const emailParams = generateHotelRequestEmail(validatedData);

      // Send email
      const emailSent = await sendEmail(emailParams);

      if (emailSent) {
        console.log('Hotel request email sent successfully');
        res.json({
          success: true,
          message: 'Your hotel request has been sent successfully. We will contact you within 24 hours.'
        });
      } else {
        console.error('Failed to send hotel request email');
        res.status(500).json({
          success: false,
          message: 'Failed to send your request. Please try again or contact us directly.'
        });
      }
    } catch (error) {
      // Enhanced error handling
      if (error instanceof Error) {
        if (error.name === 'ZodError') {
          console.error('Hotel request validation error:', error.message);
          return res.status(400).json({
            success: false,
            message: 'Please check your information and ensure all required fields are filled correctly.'
          });
        }

        if (error.message.includes('email')) {
          console.error('Email service error:', error.message);
          return res.status(503).json({
            success: false,
            message: 'Email service is temporarily unavailable. Please try again in a few minutes or contact us directly.'
          });
        }
      }

      console.error('Hotel request error:', error);
      res.status(500).json({
        success: false,
        message: 'An unexpected error occurred. Please try again or contact us directly if the problem persists.'
      });
    }
  });

  // Get all experiences (admin)
  app.get('/api/admin/experiences', authenticateAdmin, async (req, res) => {
    try {
      const experiences = await storage.getAllExperiences();
      res.json(experiences);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      res.status(500).json({ message: 'Failed to fetch experiences' });
    }
  });

  // Create experience (admin)
  app.post('/api/admin/experiences', authenticateAdmin, async (req, res) => {
    try {
      const experience = await storage.createExperience(req.body);
      res.json(experience);
    } catch (error) {
      console.error('Error creating experience:', error);
      res.status(500).json({ message: 'Failed to create experience' });
    }
  });

  // Delete experience (admin)
  app.delete('/api/admin/experiences/:id', authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const ok = await storage.deleteExperience(id);
      if (!ok) return res.status(404).json({ message: 'Experience not found' });
      res.json({ message: 'Deleted' });
    } catch (error) {
      console.error('Error deleting experience:', error);
      res.status(500).json({ message: 'Failed to delete experience' });
    }
  });

  // Update experience (admin)
  app.put('/api/admin/experiences/:id', authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);

      // Remove updatedAt from the request body as it will be set automatically
      const { updatedAt, ...updateData } = req.body;
      const validatedData = updateExperienceSchema.parse(updateData);

      const updatedExperience = await storage.updateExperience(id, validatedData);
      if (!updatedExperience) {
        return res.status(404).json({ message: 'Experience not found' });
      }

      res.json(updatedExperience);
    } catch (error) {
      console.error('Error updating experience:', error);
      res.status(500).json({ message: 'Failed to update experience' });
    }
  });

  // === ADMIN HOTEL MANAGEMENT ROUTES ===

  // Get all hotels (admin)
  app.get('/api/admin/hotels', authenticateAdmin, async (req, res) => {
    try {
      const hotels = await storage.getAllHotels();
      res.json(hotels);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      res.status(500).json({ message: 'Failed to fetch hotels' });
    }
  });

  // Create hotel (admin)
  app.post('/api/admin/hotels', authenticateAdmin, async (req, res) => {
    try {
      const validatedData = insertHotelSchema.parse(req.body);
      const hotel = await storage.createHotel(validatedData);
      res.json(hotel);
    } catch (error) {
      console.error('Error creating hotel:', error);
      res.status(500).json({ message: 'Failed to create hotel' });
    }
  });

  // Update hotel (admin)
  app.put('/api/admin/hotels/:id', authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { updatedAt, ...updateData } = req.body;
      const validatedData = updateHotelSchema.parse(updateData);

      const updatedHotel = await storage.updateHotel(id, validatedData);
      if (!updatedHotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }

      res.json(updatedHotel);
    } catch (error) {
      console.error('Error updating hotel:', error);
      res.status(500).json({ message: 'Failed to update hotel' });
    }
  });

  // Resolve a Google Maps short link ("Share → Send a link", e.g.
  // maps.app.goo.gl/…) to its full URL so the hotel wizard can extract
  // coordinates — short links carry none themselves. Hosts are
  // whitelisted: this must never become an open URL fetcher.
  app.post('/api/admin/resolve-map-link', authenticateAdmin, async (req, res) => {
    try {
      const raw = String(req.body?.url || '').trim();
      const input = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
      let host: string;
      try {
        host = new URL(input).hostname.toLowerCase();
      } catch {
        return res.status(400).json({ message: 'Invalid URL' });
      }
      const allowed = ['maps.app.goo.gl', 'goo.gl', 'g.co'];
      if (!allowed.includes(host)) {
        return res.status(400).json({ message: 'Not a Google Maps short link' });
      }
      const response = await fetch(input, {
        redirect: 'follow',
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });
      let resolved = response.url;
      // EU consent interstitial wraps the real URL in ?continue=…
      if (/consent\.google\./i.test(resolved)) {
        const cont = new URL(resolved).searchParams.get('continue');
        if (cont) resolved = cont;
      }
      res.json({ url: resolved });
    } catch (error) {
      console.error('resolve-map-link failed:', error);
      res.status(500).json({ message: 'Could not resolve link' });
    }
  });

  // Delete hotel (admin)
  app.delete('/api/admin/hotels/:id', authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteHotel(id);

      if (!deleted) {
        return res.status(404).json({ message: 'Hotel not found' });
      }

      res.json({ message: 'Hotel deleted successfully' });
    } catch (error) {
      console.error('Error deleting hotel:', error);
      res.status(500).json({ message: 'Failed to delete hotel' });
    }
  });

  // === SITE CONTENT ROUTES ===
  // Public: read all key/value pairs for the static-page overlay
  app.get('/api/site-content', async (_req, res) => {
    try {
      res.json(await storage.getSiteContent());
    } catch (error) {
      console.error('Error fetching site content:', error);
      res.status(500).json({ message: 'Failed to fetch site content' });
    }
  });

  // Admin: upsert a single key — body { value: any }
  app.put('/api/admin/site-content/:key', authenticateAdmin, async (req, res) => {
    try {
      const result = await storage.upsertSiteContent(req.params.key, req.body?.value);
      res.json(result);
    } catch (error) {
      console.error('Error saving site content:', error);
      res.status(500).json({ message: 'Failed to save site content' });
    }
  });

  // === ADMIN BLOG POST ROUTES ===

  app.get('/api/admin/blog', authenticateAdmin, async (_req, res) => {
    try {
      const all = await storage.getAllBlogPosts();
      res.json(all);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      res.status(500).json({ message: 'Failed to fetch blog posts' });
    }
  });

  app.post('/api/admin/blog', authenticateAdmin, async (req, res) => {
    try {
      const post = await storage.createBlogPost(req.body);
      res.json(post);
    } catch (error) {
      console.error('Error creating blog post:', error);
      res.status(500).json({ message: 'Failed to create blog post' });
    }
  });

  app.put('/api/admin/blog/:id', authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { updatedAt, ...updateData } = req.body;
      const updated = await storage.updateBlogPost(id, updateData);
      if (!updated) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      res.json(updated);
    } catch (error) {
      console.error('Error updating blog post:', error);
      res.status(500).json({ message: 'Failed to update blog post' });
    }
  });

  app.delete('/api/admin/blog/:id', authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const ok = await storage.deleteBlogPost(id);
      if (!ok) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      res.json({ message: 'Blog post deleted' });
    } catch (error) {
      console.error('Error deleting blog post:', error);
      res.status(500).json({ message: 'Failed to delete blog post' });
    }
  });

  // Get all images (admin)
  app.get('/api/admin/images', authenticateAdmin, async (req, res) => {
    try {
      const { category, pageId } = req.query;
      const images = await storage.getImages(
        category as string,
        pageId as string
      );
      // Never ship the base64 blob in the list — it's huge. The file
      // itself is served separately from /media/:id (image.path).
      res.json(images.map(({ data, ...rest }: any) => rest));
    } catch (error) {
      console.error('Error fetching images:', error);
      res.status(500).json({ message: 'Failed to fetch images' });
    }
  });

  // Upload images/videos (admin). Stored in Postgres (base64) and
  // served from /media/:id so uploads survive Railway redeploys, which
  // wipe the disk. Uses an in-memory multer so we get the raw bytes.
  const mediaUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const allowed = /jpeg|jpg|png|gif|webp|svg|mp4|webm|mov/;
      const ext = allowed.test(path.extname(file.originalname).toLowerCase());
      const mime = allowed.test(file.mimetype);
      if (ext || mime) return cb(null, true);
      cb(new Error('Only image and video files are allowed'));
    },
  });

  app.post('/api/admin/upload', authenticateAdmin, mediaUpload.array('images', 10), async (req: any, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
      }

      const { category = 'general', pageId = '', sectionId = '', description = '' } = req.body;
      const results = [];

      for (const file of req.files) {
        // Compress images before storing. Uploaded photos are often
        // 10–30 MB straight off a phone/camera; serving those raw from
        // the DB is what made the hotel pages take 20 s to load. Resize
        // to a sane max width and re-encode to progressive JPEG so a
        // hero image lands around 200–500 KB. Videos pass through
        // untouched.
        let buffer: Buffer = file.buffer;
        let mimeType: string = file.mimetype;
        let outName: string = file.originalname;
        const isImage = (file.mimetype || '').startsWith('image/');
        if (isImage) {
          try {
            buffer = await sharp(file.buffer)
              .rotate() // respect EXIF orientation before stripping metadata
              .resize({ width: 2200, height: 2200, fit: 'inside', withoutEnlargement: true })
              .jpeg({ quality: 82, progressive: true, mozjpeg: true })
              .toBuffer();
            mimeType = 'image/jpeg';
            outName = file.originalname.replace(/\.[^.]+$/, '') + '.jpg';
          } catch (err) {
            // If sharp can't decode it (e.g. an unusual format), fall
            // back to storing the original bytes rather than failing.
            console.warn('Image compression failed, storing original:', err);
            buffer = file.buffer;
            mimeType = file.mimetype;
            outName = file.originalname;
          }
        }

        const ext = isImage ? '.jpg' : path.extname(file.originalname || '').toLowerCase();

        if (objectStorageEnabled()) {
          // Preferred path: bytes live in the bucket, Postgres only
          // keeps metadata + the public URL. The bucket handles Range
          // requests and CDN caching natively.
          const url = await putObject(mediaKey(file.originalname, ext), buffer, mimeType);
          const created = await storage.uploadImage({
            filename: outName,
            originalName: file.originalname,
            path: url,
            size: buffer.length,
            mimeType,
            category,
            pageId: pageId || null,
            sectionId: sectionId || null,
            description: description || null,
            data: null,
            uploadedBy: req.admin.id,
          } as any);
          results.push({ ...created, data: undefined });
          continue;
        }

        // Legacy fallback (no bucket configured): base64 in Postgres,
        // served from /media/:id.
        const created = await storage.uploadImage({
          filename: outName,
          originalName: file.originalname,
          path: 'pending',
          size: buffer.length,
          mimeType,
          category,
          pageId: pageId || null,
          sectionId: sectionId || null,
          description: description || null,
          data: buffer.toString('base64'),
          uploadedBy: req.admin.id,
        } as any);

        // Now that we have an id, point the public path at the DB-served
        // URL — include the file extension so the front-end can tell an
        // image from a video (the /media route ignores it via parseInt).
        const publicPath = `/media/${created.id}${ext}`;
        if ((storage as any).setImagePath) {
          await (storage as any).setImagePath(created.id, publicPath);
        }
        results.push({ ...created, path: publicPath, data: undefined });
      }

      res.json({ images: results });
    } catch (error) {
      console.error('Error uploading images:', error);
      res.status(500).json({ message: 'Failed to upload images' });
    }
  });

  // Public: serve a media file by id. Rows migrated to object storage
  // just redirect to the bucket (which handles Range/CDN itself);
  // legacy DB-stored rows are served from the base64 blob with Range
  // support so video seeking works in Safari/iOS.
  app.get('/media/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (Number.isNaN(id)) return res.status(400).end();
      const image = await storage.getImage(id);
      if (!image) return res.status(404).end();

      if (image.path && /^https?:\/\//.test(image.path)) {
        return res.redirect(301, image.path);
      }
      if (!(image as any).data) return res.status(404).end();

      const buffer = Buffer.from((image as any).data, 'base64');
      res.setHeader('Content-Type', image.mimeType || 'application/octet-stream');
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.setHeader('Accept-Ranges', 'bytes');

      const range = req.headers.range;
      if (range) {
        const match = /^bytes=(\d*)-(\d*)$/.exec(range);
        if (!match || (!match[1] && !match[2])) {
          res.setHeader('Content-Range', `bytes */${buffer.length}`);
          return res.status(416).end();
        }
        const start = match[1] ? parseInt(match[1], 10) : buffer.length - parseInt(match[2], 10);
        const end = match[1] && match[2]
          ? Math.min(parseInt(match[2], 10), buffer.length - 1)
          : buffer.length - 1;
        if (Number.isNaN(start) || start < 0 || start > end) {
          res.setHeader('Content-Range', `bytes */${buffer.length}`);
          return res.status(416).end();
        }
        res.status(206);
        res.setHeader('Content-Range', `bytes ${start}-${end}/${buffer.length}`);
        res.setHeader('Content-Length', end - start + 1);
        return res.end(buffer.subarray(start, end + 1));
      }

      res.setHeader('Content-Length', buffer.length);
      res.end(buffer);
    } catch (error) {
      console.error('Error serving media:', error);
      res.status(500).end();
    }
  });

  // Delete image (admin)
  app.delete('/api/admin/images/:id', authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const image = await storage.getImage(id);

      if (!image) {
        return res.status(404).json({ message: 'Image not found' });
      }

      // Legacy disk-stored files (path /uploads/...) — clean up if present.
      // DB-stored media (path /media/:id) has no disk file; the row delete
      // removes the bytes. Bucket-stored media is deleted from the bucket.
      if (image.path && image.path.startsWith('/uploads/')) {
        const filePath = path.join(uploadDir, path.basename(image.path));
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } else if (image.path && /^https?:\/\//.test(image.path)) {
        await deleteObjectByUrl(image.path);
      }

      const deleted = await storage.deleteImage(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Image not found' });
      }

      res.json({ message: 'Image deleted successfully' });
    } catch (error) {
      console.error('Error deleting image:', error);
      res.status(500).json({ message: 'Failed to delete image' });
    }
  });

  // Get specific experience by slug — for the public tour detail page
  app.get('/api/experiences/by-slug/:slug', async (req, res) => {
    try {
      const tour = await storage.getExperienceBySlug(req.params.slug);
      if (!tour || !tour.isActive) {
        return res.status(404).json({ message: 'Tour not found' });
      }
      res.json(tour);
    } catch (error) {
      console.error('Error fetching tour by slug:', error);
      res.status(500).json({ message: 'Failed to fetch tour' });
    }
  });

  // PAGE BUILDER API ROUTES

  // Pages
  app.get('/api/admin/pages', authenticateAdmin, async (req, res) => {
    try {
      const pages = await storage.getPages();
      res.json(pages);
    } catch (error) {
      console.error('Error fetching pages:', error);
      res.status(500).json({ message: 'Failed to fetch pages' });
    }
  });

  app.get('/api/admin/pages/:id', authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const page = await storage.getPage(id);

      if (!page) {
        return res.status(404).json({ message: 'Page not found' });
      }

      res.json(page);
    } catch (error) {
      console.error('Error fetching page:', error);
      res.status(500).json({ message: 'Failed to fetch page' });
    }
  });

  app.post('/api/admin/pages', authenticateAdmin, async (req, res) => {
    try {
      const validatedData = insertPageSchema.parse(req.body);
      const page = await storage.createPage(validatedData);
      res.json(page);
    } catch (error) {
      console.error('Error creating page:', error);
      res.status(500).json({ message: 'Failed to create page' });
    }
  });

  app.put('/api/admin/pages/:id', authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const page = await storage.updatePage(id, req.body);

      if (!page) {
        return res.status(404).json({ message: 'Page not found' });
      }

      res.json(page);
    } catch (error) {
      console.error('Error updating page:', error);
      res.status(500).json({ message: 'Failed to update page' });
    }
  });

  app.delete('/api/admin/pages/:id', authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deletePage(id);

      if (!deleted) {
        return res.status(404).json({ message: 'Page not found' });
      }

      res.json({ message: 'Page deleted successfully' });
    } catch (error) {
      console.error('Error deleting page:', error);
      res.status(500).json({ message: 'Failed to delete page' });
    }
  });

  // Page Blocks
  app.get('/api/admin/page-blocks/:pageId', authenticateAdmin, async (req, res) => {
    try {
      const pageId = parseInt(req.params.pageId);
      const blocks = await storage.getPageBlocks(pageId);
      res.json(blocks);
    } catch (error) {
      console.error('Error fetching page blocks:', error);
      res.status(500).json({ message: 'Failed to fetch page blocks' });
    }
  });

  app.post('/api/admin/page-blocks', authenticateAdmin, async (req, res) => {
    try {
      const validatedData = insertPageBlockSchema.parse(req.body);
      const block = await storage.createPageBlock(validatedData);
      res.json(block);
    } catch (error) {
      console.error('Error creating page block:', error);
      res.status(500).json({ message: 'Failed to create page block' });
    }
  });

  app.put('/api/admin/page-blocks/:id', authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const block = await storage.updatePageBlock(id, req.body);

      if (!block) {
        return res.status(404).json({ message: 'Page block not found' });
      }

      res.json(block);
    } catch (error) {
      console.error('Error updating page block:', error);
      res.status(500).json({ message: 'Failed to update page block' });
    }
  });

  app.delete('/api/admin/page-blocks/:id', authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deletePageBlock(id);

      if (!deleted) {
        return res.status(404).json({ message: 'Page block not found' });
      }

      res.json({ message: 'Page block deleted successfully' });
    } catch (error) {
      console.error('Error deleting page block:', error);
      res.status(500).json({ message: 'Failed to delete page block' });
    }
  });

  app.post('/api/admin/page-blocks/reorder', authenticateAdmin, async (req, res) => {
    try {
      const { pageId, blockIds } = req.body;
      await storage.reorderPageBlocks(pageId, blockIds);
      res.json({ message: 'Page blocks reordered successfully' });
    } catch (error) {
      console.error('Error reordering page blocks:', error);
      res.status(500).json({ message: 'Failed to reorder page blocks' });
    }
  });

  // Block Templates
  app.get('/api/admin/block-templates', authenticateAdmin, async (req, res) => {
    try {
      const templates = await storage.getBlockTemplates();
      res.json(templates);
    } catch (error) {
      console.error('Error fetching block templates:', error);
      res.status(500).json({ message: 'Failed to fetch block templates' });
    }
  });

  app.post('/api/admin/block-templates', authenticateAdmin, async (req, res) => {
    try {
      const validatedData = insertBlockTemplateSchema.parse(req.body);
      const template = await storage.createBlockTemplate(validatedData);
      res.json(template);
    } catch (error) {
      console.error('Error creating block template:', error);
      res.status(500).json({ message: 'Failed to create block template' });
    }
  });

  app.put('/api/admin/block-templates/:id', authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const template = await storage.updateBlockTemplate(id, req.body);

      if (!template) {
        return res.status(404).json({ message: 'Block template not found' });
      }

      res.json(template);
    } catch (error) {
      console.error('Error updating block template:', error);
      res.status(500).json({ message: 'Failed to update block template' });
    }
  });

  app.delete('/api/admin/block-templates/:id', authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteBlockTemplate(id);

      if (!deleted) {
        return res.status(404).json({ message: 'Block template not found' });
      }

      res.json({ message: 'Block template deleted successfully' });
    } catch (error) {
      console.error('Error deleting block template:', error);
      res.status(500).json({ message: 'Failed to delete block template' });
    }
  });

  // Public API to get published pages
  app.get('/api/pages', async (req, res) => {
    try {
      const pages = await storage.getPages();
      const publishedPages = pages.filter(page => page.isPublished);
      res.json(publishedPages);
    } catch (error) {
      console.error('Error fetching published pages:', error);
      res.status(500).json({ message: 'Failed to fetch published pages' });
    }
  });

  app.get('/api/pages/:slug', async (req, res) => {
    try {
      const slug = req.params.slug;
      const page = await storage.getPageBySlug(slug);

      if (!page || !page.isPublished) {
        return res.status(404).json({ message: 'Page not found' });
      }

      const blocks = await storage.getPageBlocks(page.id);
      const visibleBlocks = blocks.filter(block => block.isVisible);

      res.json({ page, blocks: visibleBlocks });
    } catch (error) {
      console.error('Error fetching published page:', error);
      res.status(500).json({ message: 'Failed to fetch published page' });
    }
  });

  // Quote request endpoint
  app.post('/api/send-quote-request', rateLimitMiddleware, async (req, res) => {
    try {
      const {
        fullName,
        email,
        phone,
        contactMethod,
        dateFrom,
        dateTo,
        destinations,
        experienceType,
        numberOfTravelers,
        accommodationPreference,
        specialRequests,
        budget
      } = req.body;

      if (!fullName || !email || !contactMethod || !dateFrom || !dateTo || !destinations || !experienceType?.length || !numberOfTravelers || !accommodationPreference?.length) {
        return res.status(400).json({
          success: false,
          message: 'Please fill in all required fields'
        });
      }

      // Create email content — every field is visitor-supplied, so
      // escape at each interpolation.
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2c5530; border-bottom: 2px solid #2c5530; padding-bottom: 10px;">
            New Quote Request from ${escapeHtml(fullName)}
          </h2>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2c5530; margin-top: 0;">Contact Information</h3>
            <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ''}
            <p><strong>Preferred Contact Method:</strong> ${escapeHtml(contactMethod)}</p>
          </div>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2c5530; margin-top: 0;">Travel Details</h3>
            <p><strong>Travel Dates:</strong> ${escapeHtml(dateFrom)} to ${escapeHtml(dateTo)}</p>
            <p><strong>Destination(s):</strong> ${escapeHtml(destinations)}</p>
            <p><strong>Number of Travelers:</strong> ${escapeHtml(numberOfTravelers)}</p>
            ${budget ? `<p><strong>Budget:</strong> ${escapeHtml(budget)}</p>` : ''}
          </div>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2c5530; margin-top: 0;">Experience Preferences</h3>
            <p><strong>Experience Type(s):</strong></p>
            <ul>
              ${experienceType.map((exp: string) => `<li>${escapeHtml(exp)}</li>`).join('')}
            </ul>
            <p><strong>Accommodation Preference(s):</strong></p>
            <ul>
              ${accommodationPreference.map((acc: string) => `<li>${escapeHtml(acc)}</li>`).join('')}
            </ul>
          </div>

          ${specialRequests ? `
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #2c5530; margin-top: 0;">Special Requests</h3>
              <p>${escapeHtml(specialRequests)}</p>
            </div>
          ` : ''}

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            <p>This quote request was submitted through the Soléi Travel website on ${new Date().toLocaleString()}.</p>
          </div>
        </div>
      `;

      // Send email
      await sendEmail({
        to: 'hello@solei.com',
        from: 'noreply@solei.com',
        subject: `New Quote Request from ${fullName}`,
        html: emailHtml
      });

      res.json({
        success: true,
        message: 'Quote request submitted successfully'
      });

    } catch (error) {
      console.error('Error processing quote request:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process quote request'
      });
    }
  });

  /* ──────────────────────────────────────────────────────────────
   *  POST /api/subscribe — Journal newsletter (OutBoxly proxy)
   *
   *  The OutBoxly API key is server-only (process.env.OUTBOXLY_API_KEY)
   *  and never exposed to the client. The client POSTs { email } and
   *  we forward to OutBoxly's subscriber intake with the list, source,
   *  and tags we configure here. Raw OutBoxly errors are never
   *  forwarded to the client — only a generic 500.
   * ────────────────────────────────────────────────────────────── */
  app.post('/api/subscribe', rateLimitMiddleware, async (req: any, res: any) => {
    try {
      const { email } = req.body ?? {};

      // Basic email validation
      const emailStr = typeof email === 'string' ? email.trim() : '';
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailStr || !emailRe.test(emailStr) || emailStr.length > 254) {
        return res.status(400).json({
          success: false,
          message: 'Please enter a valid email address.',
        });
      }

      const apiKey = process.env.OUTBOXLY_API_KEY;
      if (!apiKey) {
        console.error('[subscribe] OUTBOXLY_API_KEY is not configured');
        return res.status(500).json({
          success: false,
          message: 'Subscription is temporarily unavailable.',
        });
      }

      const endpoint =
        process.env.OUTBOXLY_ENDPOINT ?? 'https://api.outboxly.com/v1/subscribers';

      const upstream = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          email: emailStr,
          list: 'solei-journal',
          source: 'journal-newsletter',
          tags: ['solei', 'journal'],
        }),
      });

      if (!upstream.ok) {
        // Log the upstream error for ops but never return it to the client.
        let upstreamBody = '';
        try {
          upstreamBody = await upstream.text();
        } catch {
          /* ignore */
        }
        console.error(
          `[subscribe] OutBoxly returned ${upstream.status}:`,
          upstreamBody,
        );
        return res.status(500).json({
          success: false,
          message: 'Subscription failed.',
        });
      }

      return res.json({ success: true });
    } catch (error) {
      console.error('[subscribe] Unexpected error:', error);
      return res.status(500).json({
        success: false,
        message: 'Subscription failed.',
      });
    }
  });

  // Initialize Salt Sanctuary image — only once (was inserting a
  // duplicate on every startup).
  try {
    const existing = await storage.getImages();
    const already = existing.some(
      (img) => img.path === '/attached_assets/solei-salt-sanctuary.jpg',
    );
    if (!already) {
      await storage.uploadImage({
        filename: 'solei-salt-sanctuary.jpg',
        originalName: 'Soléi-old -own_1758458592075.jpg',
        path: '/attached_assets/solei-salt-sanctuary.jpg',
        size: 170844,
        mimeType: 'image/jpeg',
        category: 'experience',
        pageId: 'homepage',
        sectionId: 'salt-sanctuary',
        description: 'Salt Sanctuary hero image showing luxury interior with traditional design',
        uploadedBy: null,
      });
    }
  } catch (error: any) {
    console.log('Salt Sanctuary image seed skipped:', error?.message);
  }

  // ═════════════════════════════════════════════════════════
  // ENQUIRY (public) — generic form submission from /review + /enquire
  // ═════════════════════════════════════════════════════════

  app.post('/api/enquiry', rateLimitMiddleware, async (req, res) => {
    try {
      const { name, email, phone, notes, reference, summaryLines, source } = req.body ?? {};

      if (!name || typeof name !== "string" || !email || typeof email !== "string") {
        return res.status(400).json({ success: false, message: "Name and email are required." });
      }
      // Light email sanity check.
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ success: false, message: "Please provide a valid email." });
      }

      const payload = {
        name: String(name).slice(0, 200),
        email: String(email).slice(0, 200),
        phone: phone ? String(phone).slice(0, 60) : undefined,
        notes: notes ? String(notes).slice(0, 4000) : undefined,
        reference: reference ? String(reference).slice(0, 40) : undefined,
        summaryLines: Array.isArray(summaryLines)
          ? summaryLines
              .filter((s: any) => s && typeof s.label === "string" && typeof s.value === "string")
              .slice(0, 30)
          : undefined,
        source: source ? String(source).slice(0, 80) : undefined,
      };

      // 1) Notify the owner (critical — this is the enquiry itself).
      const ownerOk = await sendEmail(generateEnquiryEmail(payload));
      if (!ownerOk) {
        return res.status(502).json({ success: false, message: "Could not send your enquiry. Please try again or contact us directly." });
      }

      // 2) Send the customer a confirmation (best-effort — don't fail
      //    the request if this one doesn't go through).
      try {
        await sendEmail(generateVisitorConfirmationEmail(payload));
      } catch (confirmErr) {
        console.error("Visitor confirmation email failed:", confirmErr);
      }

      res.json({ success: true });
    } catch (err) {
      console.error("Enquiry error:", err);
      res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
    }
  });

  // ═════════════════════════════════════════════════════════
  // CHAT (public) + AI KNOWLEDGE (admin)
  // ═════════════════════════════════════════════════════════

  // Honest availability signal for the concierge UI. The page used to
  // claim "live" unconditionally and only revealed it was offline after
  // the visitor's first message failed.
  app.get('/api/chat/status', (_req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.json({ available: !!process.env.OPENAI_API_KEY });
  });

  app.post('/api/chat', async (req, res) => {
    try {
      const { messages } = req.body;
      if (!Array.isArray(messages)) {
        return res.status(400).json({ message: "messages must be an array" });
      }
      const trimmed = messages.slice(-20).filter(
        (m: any) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string",
      );
      const reply = await chat({ messages: trimmed });
      res.json({ reply });
    } catch (err: any) {
      // Log the real reason for ops, but never leak it to the visitor.
      console.error("Chat error:", err?.message || err);
      res.status(503).json({ unavailable: true });
    }
  });

  // Admin knowledge — list
  app.get('/api/admin/knowledge', authenticateAdmin, async (_req, res) => {
    try {
      if (!db) return res.json([]);
      const rows = await db.select().from(aiKnowledge);
      // Don't ship the full content blob in the list endpoint.
      res.json(
        rows.map((r) => ({
          id: r.id,
          title: r.title,
          filename: r.filename,
          mimeType: r.mimeType,
          charCount: r.charCount,
          isActive: r.isActive,
          createdAt: r.createdAt,
        })),
      );
    } catch (err) {
      console.error("Knowledge list error:", err);
      res.status(500).json({ message: "Failed to list knowledge" });
    }
  });

  // Admin knowledge — upload a single file. Accepts PDF and plain text.
  const knowledgeUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  });

  app.post(
    '/api/admin/knowledge',
    authenticateAdmin,
    knowledgeUpload.single('file'),
    async (req, res) => {
      try {
        if (!db) return res.status(503).json({ message: "Database not configured" });
        const file = req.file;
        const title = (req.body?.title as string)?.trim();
        if (!file) return res.status(400).json({ message: "No file uploaded" });

        let content = "";
        const mime = file.mimetype;
        if (mime === "application/pdf") {
          // Lazy import to avoid loading pdf-parse on cold start.
          // pdf-parse v2 exposes a PDFParse class, not a default function.
          const { PDFParse } = await import("pdf-parse");
          const parser = new PDFParse({ data: file.buffer });
          try {
            const parsed = await parser.getText();
            content = (parsed.text || "").trim();
          } finally {
            await parser.destroy();
          }
        } else if (mime.startsWith("text/") || mime === "application/json") {
          content = file.buffer.toString("utf8").trim();
        } else {
          return res.status(415).json({
            message: `Unsupported file type: ${mime}. Upload PDF or plain text.`,
          });
        }

        if (!content) {
          return res.status(422).json({
            message: "Could not extract any text from this file.",
          });
        }

        const [row] = await db
          .insert(aiKnowledge)
          .values({
            title: title || file.originalname,
            filename: file.originalname,
            mimeType: mime,
            content,
            charCount: content.length,
            isActive: true,
          })
          .returning();

        res.json({
          id: row.id,
          title: row.title,
          filename: row.filename,
          mimeType: row.mimeType,
          charCount: row.charCount,
          isActive: row.isActive,
        });
      } catch (err: any) {
        console.error("Knowledge upload error:", err);
        res.status(500).json({ message: err?.message || "Upload failed" });
      }
    },
  );

  app.put('/api/admin/knowledge/:id', authenticateAdmin, async (req, res) => {
    try {
      if (!db) return res.status(503).json({ message: "Database not configured" });
      const id = parseInt(req.params.id, 10);
      const { title, isActive } = req.body ?? {};
      const updates: Record<string, any> = { updatedAt: new Date() };
      if (typeof title === "string") updates.title = title;
      if (typeof isActive === "boolean") updates.isActive = isActive;
      const [row] = await db
        .update(aiKnowledge)
        .set(updates)
        .where(eq(aiKnowledge.id, id))
        .returning();
      if (!row) return res.status(404).json({ message: "Not found" });
      res.json(row);
    } catch (err) {
      console.error("Knowledge update error:", err);
      res.status(500).json({ message: "Update failed" });
    }
  });

  app.delete('/api/admin/knowledge/:id', authenticateAdmin, async (req, res) => {
    try {
      if (!db) return res.status(503).json({ message: "Database not configured" });
      const id = parseInt(req.params.id, 10);
      await db.delete(aiKnowledge).where(eq(aiKnowledge.id, id));
      res.json({ message: "Deleted" });
    } catch (err) {
      console.error("Knowledge delete error:", err);
      res.status(500).json({ message: "Delete failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}