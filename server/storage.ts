import {
  users,
  admins,
  uploadedImages,
  experiences,
  pages,
  pageBlocks,
  blockTemplates,
  hotels,
  videos,
  type User,
  type InsertUser,
  type Admin,
  type InsertAdmin,
  type UploadedImage,
  type InsertImage,
  type Experience,
  type InsertExperience,
  type UpdateExperience,
  type Page,
  type InsertPage,
  type PageBlock,
  type InsertPageBlock,
  type BlockTemplate,
  type InsertBlockTemplate,
  type Hotel,
  type InsertHotel,
  type UpdateHotel,
  type Video,
  type InsertVideo,
  type UpdateVideo,
  type BlogPost,
  type InsertBlogPost,
  type UpdateBlogPost,
  blogPosts,
  siteContent,
  type SiteContent,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, sql } from "drizzle-orm";
import sharp from "sharp";
import { seedHotels, seedBlogPosts, seedExperiences } from "./seed-data";
import { tourDetailsBySlug } from "./tour-details-seed";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Admin operations
  getAdmin(id: number): Promise<Admin | undefined>;
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  
  // Image operations
  uploadImage(image: InsertImage): Promise<UploadedImage>;
  getImages(category?: string, pageId?: string): Promise<UploadedImage[]>;
  getImage(id: number): Promise<UploadedImage | undefined>;
  deleteImage(id: number): Promise<boolean>;
  
  // Experience operations
  getExperiences(): Promise<Experience[]>;
  /** Admin variant — returns drafts too. */
  getAllExperiences(): Promise<Experience[]>;
  getExperience(id: number): Promise<Experience | undefined>;
  getExperienceByTitle(title: string): Promise<Experience | undefined>;
  getExperienceBySlug(slug: string): Promise<Experience | undefined>;
  createExperience(experience: InsertExperience): Promise<Experience>;
  updateExperience(id: number, updates: UpdateExperience): Promise<Experience | undefined>;
  deleteExperience(id: number): Promise<boolean>;
  
  // Page Builder operations
  getPages(): Promise<Page[]>;
  getPage(id: number): Promise<Page | undefined>;
  getPageBySlug(slug: string): Promise<Page | undefined>;
  createPage(page: InsertPage): Promise<Page>;
  updatePage(id: number, updates: Partial<InsertPage>): Promise<Page | undefined>;
  deletePage(id: number): Promise<boolean>;
  
  // Page Block operations
  getPageBlocks(pageId: number): Promise<PageBlock[]>;
  getPageBlock(id: number): Promise<PageBlock | undefined>;
  createPageBlock(block: InsertPageBlock): Promise<PageBlock>;
  updatePageBlock(id: number, updates: Partial<InsertPageBlock>): Promise<PageBlock | undefined>;
  deletePageBlock(id: number): Promise<boolean>;
  reorderPageBlocks(pageId: number, blockIds: number[]): Promise<void>;
  
  // Block Template operations
  getBlockTemplates(): Promise<BlockTemplate[]>;
  getBlockTemplate(id: number): Promise<BlockTemplate | undefined>;
  createBlockTemplate(template: InsertBlockTemplate): Promise<BlockTemplate>;
  updateBlockTemplate(id: number, updates: Partial<InsertBlockTemplate>): Promise<BlockTemplate | undefined>;
  deleteBlockTemplate(id: number): Promise<boolean>;
  
  // Hotel operations
  getHotels(): Promise<Hotel[]>;
  /** Admin variant — returns drafts too. */
  getAllHotels(): Promise<Hotel[]>;
  getHotel(id: number): Promise<Hotel | undefined>;
  getHotelBySlug(slug: string): Promise<Hotel | undefined>;
  getHotelsByDestination(destination: string): Promise<Hotel[]>;
  createHotel(hotel: InsertHotel): Promise<Hotel>;
  updateHotel(id: number, updates: UpdateHotel): Promise<Hotel | undefined>;
  deleteHotel(id: number): Promise<boolean>;
  
  // Video operations
  getVideos(): Promise<Video[]>;
  getVideo(id: number): Promise<Video | undefined>;
  getVideoBySlug(slug: string): Promise<Video | undefined>;
  getVideosByCategory(category: string): Promise<Video[]>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideo(id: number, updates: UpdateVideo): Promise<Video | undefined>;
  deleteVideo(id: number): Promise<boolean>;

  // Site content operations
  getSiteContent(): Promise<Record<string, any>>;
  upsertSiteContent(key: string, value: any): Promise<SiteContent>;

  // Blog post operations
  getBlogPosts(): Promise<BlogPost[]>;
  /** Admin-only — returns drafts and published posts alike. */
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, updates: UpdateBlogPost): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private admins: Map<number, Admin>;
  private images: Map<number, UploadedImage>;
  private experiencesMap: Map<number, Experience>;
  private pagesMap: Map<number, Page>;
  private pageBlocksMap: Map<number, PageBlock>;
  private blockTemplatesMap: Map<number, BlockTemplate>;
  private videosMap: Map<number, Video>;
  private hotelsMap: Map<number, Hotel>;
  private blogPostsMap: Map<number, BlogPost>;
  private siteContentMap: Map<string, any>;
  private currentUserId: number;
  private currentAdminId: number;
  private currentImageId: number;
  private currentExperienceId: number;
  private currentPageId: number;
  private currentPageBlockId: number;
  private currentBlockTemplateId: number;
  private currentVideoId: number;
  private currentHotelId: number;
  private currentBlogPostId: number;

  constructor() {
    this.users = new Map();
    this.admins = new Map();
    this.images = new Map();
    this.experiencesMap = new Map();
    this.pagesMap = new Map();
    this.pageBlocksMap = new Map();
    this.blockTemplatesMap = new Map();
    this.videosMap = new Map();
    this.hotelsMap = new Map();
    this.blogPostsMap = new Map();
    this.siteContentMap = new Map();
    this.currentUserId = 1;
    this.currentAdminId = 1;
    this.currentImageId = 1;
    this.currentExperienceId = 1;
    this.currentPageId = 1;
    this.currentPageBlockId = 1;
    this.currentBlockTemplateId = 1;
    this.currentVideoId = 1;
    this.currentHotelId = 1;
    this.currentBlogPostId = 1;
    
    // Create default admin user
    this.createDefaultAdmin();
    
    // Initialize with default experiences
    this.initializeDefaultExperiences();
    
    // Initialize page builder templates
    this.initializeBlockTemplates();
    
    // Hotels are now stored in the database
    
    // Initialize with default videos
    this.initializeDefaultVideos();
  }

  private async createDefaultAdmin() {
    // The admin account comes from the environment — never a hardcoded
    // password. Without ADMIN_PASSWORD no account exists and /admin
    // login is simply disabled.
    const password = process.env.ADMIN_PASSWORD;
    if (!password) {
      console.warn(
        '[auth] ADMIN_PASSWORD is not set — no admin account created; admin login is disabled.',
      );
      return;
    }

    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    const defaultAdmin: Admin = {
      id: this.currentAdminId++,
      username: process.env.ADMIN_USERNAME || 'admin',
      password: hashedPassword,
      email: process.env.ADMIN_EMAIL || 'admin@solei.com',
      createdAt: new Date(),
    };

    this.admins.set(defaultAdmin.id, defaultAdmin);
  }

  private async initializeDefaultExperiences() {
    // Seed objects pre-date the tour catalogue, so slug/destination/
    // details are optional here and defaulted to null on insert.
    type SeedExperience = Omit<Experience, 'id' | 'slug' | 'destination' | 'details'> &
      Partial<Pick<Experience, 'slug' | 'destination' | 'details'>>;
    const defaultExperiences: SeedExperience[] = [
      // North Coast Experiences
      {
        title: "Sunset Yacht Charter",
        category: "Water Sports",
        pricePerPerson: "200",
        priceFor2: null,
        priceFor3: null,
        priceFor4: null,
        priceFor5: null,
        priceFor6: null,
        priceFor7: null,
        priceFor8: null,
        duration: "4 hours",
        maxGuests: 8,
        minAge: 12,
        difficulty: "Easy",
        summary: "Private yacht experience along the pristine coastline",
        description: "Sail along Egypt's stunning North Coast aboard a luxury yacht as the sun sets over the Mediterranean. Enjoy premium refreshments, water activities, and breathtaking coastal views on this unforgettable maritime adventure.",
        imageUrl: "/attached_assets/sunset-yacht-ride_1754269442675.mp4",
        videoUrl: "/attached_assets/sunset-yacht-ride_1754269442675.mp4",
        mediaType: "video",
        eco: false,
        luxury: true,
        wellness: false,
        isActive: true,
        updatedAt: new Date(),
      },
      {
        title: "Beach Club Experience",
        category: "Relaxation",
        pricePerPerson: "150",
        priceFor2: null,
        priceFor3: null,
        priceFor4: null,
        priceFor5: null,
        priceFor6: null,
        priceFor7: null,
        priceFor8: null,
        duration: "Full day",
        maxGuests: 8,
        minAge: 12,
        difficulty: "Easy",
        summary: "Exclusive access to premium beach clubs",
        description: "Relax in style at the North Coast's most exclusive beach clubs. Enjoy VIP cabana service, gourmet cuisine, refreshing cocktails, and access to pristine private beaches with crystal-clear waters.",
        imageUrl: "/attached_assets/Beach Club Experience_1754270187133.mp4",
        videoUrl: "/attached_assets/Beach Club Experience_1754270187133.mp4",
        mediaType: "video",
        eco: false,
        luxury: true,
        wellness: false,
        isActive: true,
        updatedAt: new Date(),
      },
      {
        title: "Water Sports Adventure",
        category: "Water Sports",
        pricePerPerson: "120",
        priceFor2: null,
        priceFor3: null,
        priceFor4: null,
        priceFor5: null,
        priceFor6: null,
        priceFor7: null,
        priceFor8: null,
        duration: "Half day",
        maxGuests: 8,
        minAge: 12,
        difficulty: "Easy",
        summary: "Thrilling water activities for adventure seekers",
        description: "Experience the Mediterranean's crystal waters through exciting activities including jet skiing, parasailing, windsurfing, and diving. Professional instructors ensure safety while maximizing the thrill.",
        imageUrl: "/attached_assets/water-sport-adventure_1754269930685.mp4",
        videoUrl: "/attached_assets/water-sport-adventure_1754269930685.mp4",
        mediaType: "video",
        eco: false,
        luxury: false,
        wellness: false,
        isActive: true,
        updatedAt: new Date(),
      },
      {
        title: "Coastal Dining Experience",
        category: "Dining",
        pricePerPerson: "80",
        priceFor2: null,
        priceFor3: null,
        priceFor4: null,
        priceFor5: null,
        priceFor6: null,
        priceFor7: null,
        priceFor8: null,
        duration: "2-3 hours",
        maxGuests: 8,
        minAge: 12,
        difficulty: "Easy",
        summary: "Gourmet Mediterranean cuisine with ocean views",
        description: "Savor fresh seafood and Mediterranean specialties at beachfront restaurants. Experience culinary excellence while dining with your toes in the sand and the sound of waves as your soundtrack.",
        imageUrl: "/attached_assets/beach_1754271424219.mp4",
        videoUrl: "/attached_assets/beach_1754271424219.mp4",
        mediaType: "video",
        eco: false,
        luxury: true,
        wellness: false,
        isActive: true,
        updatedAt: new Date(),
      },
      {
        title: "Spa & Wellness Retreat",
        category: "Wellness",
        pricePerPerson: "180",
        priceFor2: null,
        priceFor3: null,
        priceFor4: null,
        priceFor5: null,
        priceFor6: null,
        priceFor7: null,
        priceFor8: null,
        duration: "2-4 hours",
        maxGuests: 8,
        minAge: 12,
        difficulty: "Easy",
        summary: "Rejuvenating treatments with sea-inspired therapies",
        description: "Indulge in world-class spa treatments featuring marine-based therapies, aromatherapy massages, and wellness rituals designed to refresh your body and mind in luxurious beachfront settings.",
        imageUrl: "/attached_assets/Spa & Wellness Retreat_1754271102938.mp4",
        videoUrl: "/attached_assets/Spa & Wellness Retreat_1754271102938.mp4",
        mediaType: "video",
        eco: false,
        luxury: true,
        wellness: true,
        isActive: true,
        updatedAt: new Date(),
      },
      {
        title: "Marina Nightlife",
        category: "Nightlife",
        pricePerPerson: "100",
        priceFor2: null,
        priceFor3: null,
        priceFor4: null,
        priceFor5: null,
        priceFor6: null,
        priceFor7: null,
        priceFor8: null,
        duration: "Evening",
        maxGuests: 8,
        minAge: 18,
        difficulty: "Easy",
        summary: "Vibrant evening entertainment at luxury marinas",
        description: "Experience the North Coast's sophisticated nightlife scene at world-class marinas. Enjoy craft cocktails, live music, and dancing under the stars with stunning yacht-filled harbor views.",
        imageUrl: "/attached_assets/el gouna nightlife_1754270925465.mp4",
        videoUrl: "/attached_assets/el gouna nightlife_1754270925465.mp4",
        mediaType: "video",
        eco: false,
        luxury: true,
        wellness: false,
        isActive: true,
        updatedAt: new Date(),
      },
      // Siwa Oasis Experiences
      {
        title: "Sunset Sand-Surfing",
        category: "Desert & Dunes",
        pricePerPerson: "39",
        priceFor2: null,
        priceFor3: null,
        priceFor4: null,
        priceFor5: null,
        priceFor6: null,
        priceFor7: null,
        priceFor8: null,
        duration: "2 hrs",
        maxGuests: 8,
        minAge: 12,
        difficulty: "Medium",
        summary: "Ride down golden dunes on custom boards as the sun dips behind the Great Sand Sea.",
        description: "Experience the thrill of sand surfing down the massive dunes of the Great Sand Sea. Our expert guides provide custom sand boards and safety equipment for an unforgettable desert adventure. Watch the sunset paint the dunes in golden hues while you glide down the soft sand slopes.",
        imageUrl: "/attached_assets/siwa_1751042722081.mp4",
        videoUrl: "/attached_assets/siwa_1751042722081.mp4",
        mediaType: "video",
        eco: false,
        luxury: true,
        wellness: false,
        isActive: true,
        updatedAt: new Date(),
      },
      {
        title: "Salt Lake Float Therapy",
        category: "Salt Lakes",
        pricePerPerson: "29",
        priceFor2: null,
        priceFor3: null,
        priceFor4: null,
        priceFor5: null,
        priceFor6: null,
        priceFor7: null,
        priceFor8: null,
        duration: "90 mins",
        maxGuests: 8,
        minAge: 12,
        difficulty: "Easy",
        summary: "Float effortlessly in mineral-rich salt lakes with therapeutic properties.",
        description: "Immerse yourself in the healing waters of Siwa's famous salt lakes. The high mineral content allows you to float effortlessly while absorbing beneficial salts and minerals through your skin. This natural therapy has been used for centuries to treat skin conditions and promote relaxation.",
        imageUrl: "/attached_assets/floating-in-spring_1753576589836.jpeg",
        videoUrl: "/attached_assets/Salt Lake Float Therapy_1751926016176.mp4",
        mediaType: "video",
        eco: true,
        luxury: false,
        wellness: true,
        isActive: true,
        updatedAt: new Date(),
      },
      {
        title: "Cleopatra Spring Soak",
        category: "Salt Lakes",
        pricePerPerson: "10",
        priceFor2: null,
        priceFor3: null,
        priceFor4: null,
        priceFor5: null,
        priceFor6: null,
        priceFor7: null,
        priceFor8: null,
        duration: "1 hr",
        maxGuests: 8,
        minAge: 8,
        difficulty: "Easy",
        summary: "A refreshing dip in Siwa's natural spring, known for its crystal-clear water and relaxing atmosphere.",
        description: "A refreshing dip in Siwa's natural spring, known for its crystal-clear water and relaxing atmosphere.",
        imageUrl: "/attached_assets/Cleopatra Spring Soak_1764123896008.JPG",
        videoUrl: null,
        mediaType: "image",
        eco: true,
        luxury: false,
        wellness: true,
        isActive: true,
        updatedAt: new Date(),
      },
      {
        title: "Desert Breathwork Meditation",
        category: "Wellbeing",
        pricePerPerson: "95",
        priceFor2: null,
        priceFor3: null,
        priceFor4: null,
        priceFor5: null,
        priceFor6: null,
        priceFor7: null,
        priceFor8: null,
        duration: "4 hrs",
        maxGuests: 8,
        minAge: 12,
        difficulty: "Easy",
        summary: "Where the infinite sky becomes your evening's entertainment.",
        description: "Far from city lights, the desert opens up into a celestial theatre. As you recline on soft cushions or settle into wicker chairs, the cool night air brushes against your skin. The first stars twinkle shyly before the heavens erupt into a dazzling display—the Milky Way stretching like a luminous river across the inky black.",
        imageUrl: "/attached_assets/IMG_7483_1754739536174.JPG",
        videoUrl: null,
        mediaType: "image",
        eco: false,
        luxury: true,
        wellness: false,
        isActive: true,
        updatedAt: new Date(),
      },
      {
        title: "Sunset Horseback Ride",
        category: "Romance & Adventure",
        pricePerPerson: "95",
        priceFor2: null,
        priceFor3: null,
        priceFor4: null,
        priceFor5: null,
        priceFor6: null,
        priceFor7: null,
        priceFor8: null,
        duration: "2.5 hrs",
        maxGuests: 8,
        minAge: 14,
        difficulty: "Medium",
        summary: "A private horseback ride at sunset in Siwa is pure desert poetry.",
        description: "Your journey begins beneath the swaying palms, where the scent of date trees mingles with the warm desert breeze. As you ride out of the oasis, the golden light softens, and the horizon begins to glow with the colours of an approaching sunset.",
        imageUrl: "/attached_assets/sunset-horse riding_1754739000614.jpg",
        videoUrl: null,
        mediaType: "image",
        eco: true,
        luxury: false,
        wellness: false,
        isActive: true,
        updatedAt: new Date(),
      },
      {
        title: "Flamingo Watching Experience",
        category: "Nature & Wildlife",
        pricePerPerson: "85",
        priceFor2: null,
        priceFor3: null,
        priceFor4: null,
        priceFor5: null,
        priceFor6: null,
        priceFor7: null,
        priceFor8: null,
        duration: "3 hrs",
        maxGuests: 8,
        minAge: 8,
        difficulty: "Easy",
        summary: "A serene encounter with nature's elegance.",
        description: "At dawn or dusk, when the desert sky blushes in shades of gold and rose, the salt lakes of Siwa transform into a living mirror. Here, flocks of graceful flamingos gather, their long necks arching in perfect harmony as they wade through shimmering waters.",
        imageUrl: "/attached_assets/Experience-flamengo_1754739953638.jpg",
        videoUrl: null,
        mediaType: "image",
        eco: true,
        luxury: false,
        wellness: false,
        isActive: true,
        updatedAt: new Date(),
      },
      // Additional Siwa Experiences from siwaExperiences.json
      {
        title: "Oracle Temple Pilgrimage",
        category: "Culture & History",
        pricePerPerson: "20",
        priceFor2: null,
        priceFor3: null,
        priceFor4: null,
        priceFor5: null,
        priceFor6: null,
        priceFor7: null,
        priceFor8: null,
        duration: "1–1.5 hrs",
        maxGuests: 12,
        minAge: 8,
        difficulty: "Easy",
        summary: "Visit the legendary Temple of Amun, one of the most revered oracles in the ancient Mediterranean world where Alexander the Great sought divine status.",
        description: "Embark on a spiritual journey to Siwa's ancient Temple of the Oracle, one of Egypt's most mystical and historically significant landmarks. This pilgrimage follows sacred pathways once traveled by pharaohs, pilgrims, and even Alexander the Great—offering a powerful blend of history, spirituality, and desert beauty. The Temple of the Oracle dates back to the 26th Dynasty and was famous for its prophetic ceremonies. Its reputation spread across the ancient world, attracting rulers and seekers of divine guidance. Walk through sacred chambers and historical ruins, and learn the story of Alexander the Great's legendary visit. Experience stunning desert landscapes surrounding the site in this culturally immersive experience with local guidance.",
        imageUrl: "/attached_assets/Oracale Temple Pilgrimage  cover_1764131441571.JPG",
        videoUrl: null,
        mediaType: "image",
        eco: true,
        luxury: false,
        wellness: false,
        isActive: true,
        updatedAt: new Date(),
      },
      {
        title: "Traditional Sand Bath Healing",
        category: "Wellbeing",
        pricePerPerson: "55",
        priceFor2: null,
        priceFor3: null,
        priceFor4: null,
        priceFor5: null,
        priceFor6: null,
        priceFor7: null,
        priceFor8: null,
        duration: "45 mins",
        maxGuests: 6,
        minAge: 16,
        difficulty: "Easy",
        summary: "Ancient therapeutic practice using naturally heated desert sand.",
        description: "Experience this traditional healing method where you're buried in naturally heated sand that has absorbed the sun's energy. The therapy improves circulation, relieves joint pain, and detoxifies the body. This ancient practice has been used by desert peoples for centuries.",
        imageUrl: "/attached_assets/Traditional Sand Bath Healing_1764121689995.JPG",
        videoUrl: null,
        mediaType: "image",
        eco: true,
        luxury: false,
        wellness: true,
        isActive: true,
        updatedAt: new Date(),
      },
    ];

    for (const experience of defaultExperiences) {
      const experienceWithId: Experience = {
        slug: null,
        destination: null,
        details: null,
        ...experience,
        id: this.currentExperienceId++,
      };
      this.experiencesMap.set(experienceWithId.id, experienceWithId);
    }

    // Skip the in-memory hotel/blog/tour seed when Postgres is
    // attached — PgStorage handles its own DB-backed seeding instead.
    if (!db) {
      for (const hotel of seedHotels) {
        const id = this.currentHotelId++;
        const now = new Date();
        this.hotelsMap.set(id, {
          ...hotel,
          id,
          createdAt: now,
          updatedAt: now,
        } as Hotel);
      }
      for (const post of seedBlogPosts) {
        const id = this.currentBlogPostId++;
        const now = new Date();
        this.blogPostsMap.set(id, {
          ...post,
          id,
          createdAt: now,
          updatedAt: now,
          publishedAt: post.publishedAt ?? now,
        } as BlogPost);
      }
      // Seed bundled tours alongside the legacy pricing experiences.
      for (const tour of seedExperiences) {
        const id = this.currentExperienceId++;
        this.experiencesMap.set(id, {
          ...tour,
          id,
          updatedAt: new Date(),
        } as Experience);
      }
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Admin operations
  async getAdmin(id: number): Promise<Admin | undefined> {
    return this.admins.get(id);
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    return Array.from(this.admins.values()).find(
      (admin) => admin.username === username,
    );
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(insertAdmin.password, 10);
    
    const id = this.currentAdminId++;
    const admin: Admin = {
      ...insertAdmin,
      password: hashedPassword,
      id,
      createdAt: new Date(),
    };
    this.admins.set(id, admin);
    return admin;
  }

  // Image operations
  async uploadImage(insertImage: InsertImage): Promise<UploadedImage> {
    const id = this.currentImageId++;
    const image: UploadedImage = {
      ...insertImage,
      pageId: insertImage.pageId || null,
      sectionId: insertImage.sectionId || null,
      description: insertImage.description || null,
      data: (insertImage as any).data ?? null,
      uploadedBy: insertImage.uploadedBy || null,
      id,
      uploadedAt: new Date(),
    };
    this.images.set(id, image);
    return image;
  }

  async getImages(category?: string, pageId?: string): Promise<UploadedImage[]> {
    const allImages = Array.from(this.images.values());
    
    if (category && pageId) {
      return allImages.filter(img => img.category === category && img.pageId === pageId);
    }
    if (category) {
      return allImages.filter(img => img.category === category);
    }
    if (pageId) {
      return allImages.filter(img => img.pageId === pageId);
    }
    
    return allImages;
  }

  async getImage(id: number): Promise<UploadedImage | undefined> {
    return this.images.get(id);
  }

  async deleteImage(id: number): Promise<boolean> {
    return this.images.delete(id);
  }

  // Experience operations
  async getExperiences(): Promise<Experience[]> {
    return Array.from(this.experiencesMap.values()).filter(exp => exp.isActive);
  }

  async getAllExperiences(): Promise<Experience[]> {
    return Array.from(this.experiencesMap.values());
  }

  async getExperience(id: number): Promise<Experience | undefined> {
    return this.experiencesMap.get(id);
  }

  async getExperienceByTitle(title: string): Promise<Experience | undefined> {
    return Array.from(this.experiencesMap.values()).find(
      (experience) => experience.title === title,
    );
  }

  async getExperienceBySlug(slug: string): Promise<Experience | undefined> {
    return Array.from(this.experiencesMap.values()).find(
      (experience) => (experience as any).slug === slug,
    );
  }

  async createExperience(insertExperience: InsertExperience): Promise<Experience> {
    const id = this.currentExperienceId++;
    const experience: Experience = {
      slug: null,
      destination: null,
      details: null,
      maxGuests: 8,
      minAge: 12,
      difficulty: 'Easy',
      eco: false,
      luxury: false,
      wellness: false,
      isActive: true,
      mediaType: 'image',
      priceFor2: null,
      priceFor3: null,
      priceFor4: null,
      priceFor5: null,
      priceFor6: null,
      priceFor7: null,
      priceFor8: null,
      ...insertExperience,
      imageUrl: insertExperience.imageUrl || null,
      videoUrl: insertExperience.videoUrl || null,
      id,
      updatedAt: new Date(),
    };
    this.experiencesMap.set(id, experience);
    return experience;
  }

  async updateExperience(id: number, updates: UpdateExperience): Promise<Experience | undefined> {
    const existing = this.experiencesMap.get(id);
    if (!existing) return undefined;

    const updated: Experience = {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date(),
    };
    
    this.experiencesMap.set(id, updated);
    return updated;
  }

  async deleteExperience(id: number): Promise<boolean> {
    const experience = this.experiencesMap.get(id);
    if (!experience) return false;
    
    // Soft delete
    const updated = {
      ...experience,
      isActive: false,
      updatedAt: new Date(),
    };
    
    this.experiencesMap.set(id, updated);
    return true;
  }

  // Initialize default block templates
  private async initializeBlockTemplates() {
    const templates = [
      {
        name: "Hero Section",
        blockType: "hero",
        preview: null,
        defaultContent: {
          title: "Welcome to Our Site",
          subtitle: "Discover amazing experiences",
          backgroundImage: "",
          backgroundVideo: "",
          buttonText: "Get Started",
          buttonLink: "#",
          textColor: "#ffffff",
          overlayOpacity: 0.5
        },
        category: "layout"
      },
      {
        name: "Text Block",
        blockType: "text",
        preview: null,
        defaultContent: {
          content: "<p>Your content here...</p>",
          textAlign: "left",
          fontSize: "16px",
          textColor: "#333333",
          backgroundColor: "transparent"
        },
        category: "content"
      },
      {
        name: "Image Block",
        blockType: "image",
        preview: null,
        defaultContent: {
          imageUrl: "",
          alt: "",
          caption: "",
          alignment: "center",
          width: "100%",
          height: "auto"
        },
        category: "media"
      },
      {
        name: "Gallery Block",
        blockType: "gallery",
        preview: null,
        defaultContent: {
          images: [],
          layout: "grid",
          columns: 3,
          spacing: "10px",
          showCaptions: true
        },
        category: "media"
      },
      {
        name: "Video Block",
        blockType: "video",
        preview: null,
        defaultContent: {
          videoUrl: "",
          poster: "",
          autoplay: false,
          controls: true,
          loop: false,
          muted: false
        },
        category: "media"
      }
    ];

    for (const template of templates) {
      const id = this.currentBlockTemplateId++;
      const blockTemplate: BlockTemplate = {
        ...template,
        id,
        createdAt: new Date(),
      };
      this.blockTemplatesMap.set(id, blockTemplate);
    }
  }

  // Page operations
  async getPages(): Promise<Page[]> {
    return Array.from(this.pagesMap.values());
  }

  async getPage(id: number): Promise<Page | undefined> {
    return this.pagesMap.get(id);
  }

  async getPageBySlug(slug: string): Promise<Page | undefined> {
    return Array.from(this.pagesMap.values()).find(page => page.slug === slug);
  }

  async createPage(insertPage: InsertPage): Promise<Page> {
    const id = this.currentPageId++;
    const page: Page = {
      metaDescription: null,
      isPublished: false,
      ...insertPage,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.pagesMap.set(id, page);
    return page;
  }

  async updatePage(id: number, updates: Partial<InsertPage>): Promise<Page | undefined> {
    const existing = this.pagesMap.get(id);
    if (!existing) return undefined;

    const updated: Page = {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date(),
    };
    
    this.pagesMap.set(id, updated);
    return updated;
  }

  async deletePage(id: number): Promise<boolean> {
    const deleted = this.pagesMap.delete(id);
    if (deleted) {
      // Also delete all blocks for this page
      Array.from(this.pageBlocksMap.entries()).forEach(([blockId, block]) => {
        if (block.pageId === id) {
          this.pageBlocksMap.delete(blockId);
        }
      });
    }
    return deleted;
  }

  // Page Block operations
  async getPageBlocks(pageId: number): Promise<PageBlock[]> {
    return Array.from(this.pageBlocksMap.values())
      .filter(block => block.pageId === pageId)
      .sort((a, b) => a.position - b.position);
  }

  async getPageBlock(id: number): Promise<PageBlock | undefined> {
    return this.pageBlocksMap.get(id);
  }

  async createPageBlock(insertBlock: InsertPageBlock): Promise<PageBlock> {
    const id = this.currentPageBlockId++;
    const block: PageBlock = {
      position: 0,
      isVisible: true,
      ...insertBlock,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.pageBlocksMap.set(id, block);
    return block;
  }

  async updatePageBlock(id: number, updates: Partial<InsertPageBlock>): Promise<PageBlock | undefined> {
    const existing = this.pageBlocksMap.get(id);
    if (!existing) return undefined;

    const updated: PageBlock = {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date(),
    };
    
    this.pageBlocksMap.set(id, updated);
    return updated;
  }

  async deletePageBlock(id: number): Promise<boolean> {
    return this.pageBlocksMap.delete(id);
  }

  async reorderPageBlocks(pageId: number, blockIds: number[]): Promise<void> {
    blockIds.forEach((blockId, index) => {
      const block = this.pageBlocksMap.get(blockId);
      if (block && block.pageId === pageId) {
        const updated = {
          ...block,
          position: index,
          updatedAt: new Date(),
        };
        this.pageBlocksMap.set(blockId, updated);
      }
    });
  }

  // Block Template operations
  async getBlockTemplates(): Promise<BlockTemplate[]> {
    return Array.from(this.blockTemplatesMap.values());
  }

  async getBlockTemplate(id: number): Promise<BlockTemplate | undefined> {
    return this.blockTemplatesMap.get(id);
  }

  async createBlockTemplate(insertTemplate: InsertBlockTemplate): Promise<BlockTemplate> {
    const id = this.currentBlockTemplateId++;
    const template: BlockTemplate = {
      category: "general",
      preview: null,
      ...insertTemplate,
      id,
      createdAt: new Date(),
    };
    this.blockTemplatesMap.set(id, template);
    return template;
  }

  async updateBlockTemplate(id: number, updates: Partial<InsertBlockTemplate>): Promise<BlockTemplate | undefined> {
    const existing = this.blockTemplatesMap.get(id);
    if (!existing) return undefined;

    const updated: BlockTemplate = {
      ...existing,
      ...updates,
      id,
    };
    
    this.blockTemplatesMap.set(id, updated);
    return updated;
  }

  async deleteBlockTemplate(id: number): Promise<boolean> {
    return this.blockTemplatesMap.delete(id);
  }

  // Hotel operations — in-memory; previously these called db.select()
  // which crashed when DATABASE_URL was unset. PgStorage will override
  // these once Postgres is wired up.
  async getHotels(): Promise<Hotel[]> {
    return Array.from(this.hotelsMap.values()).filter((h) => h.isActive);
  }

  async getAllHotels(): Promise<Hotel[]> {
    return Array.from(this.hotelsMap.values());
  }

  async getHotel(id: number): Promise<Hotel | undefined> {
    return this.hotelsMap.get(id);
  }

  async getHotelBySlug(slug: string): Promise<Hotel | undefined> {
    return Array.from(this.hotelsMap.values()).find((h) => h.slug === slug);
  }

  async getHotelsByDestination(destination: string): Promise<Hotel[]> {
    return Array.from(this.hotelsMap.values()).filter(
      (h) => h.isActive && h.destination === destination,
    );
  }

  async createHotel(insertHotel: InsertHotel): Promise<Hotel> {
    const id = this.currentHotelId++;
    const now = new Date();
    const hotel: Hotel = {
      description: null,
      latitude: null,
      longitude: null,
      pricePerNight: null,
      imageUrl: null,
      eco: false,
      luxury: false,
      isActive: true,
      details: null,
      ...insertHotel,
      id,
      createdAt: now,
      updatedAt: now,
    } as Hotel;
    this.hotelsMap.set(id, hotel);
    return hotel;
  }

  async updateHotel(id: number, updates: UpdateHotel): Promise<Hotel | undefined> {
    const existing = this.hotelsMap.get(id);
    if (!existing) return undefined;
    const updated: Hotel = {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date(),
    } as Hotel;
    this.hotelsMap.set(id, updated);
    return updated;
  }

  async deleteHotel(id: number): Promise<boolean> {
    return this.hotelsMap.delete(id);
  }

  // Site content operations
  async getSiteContent(): Promise<Record<string, any>> {
    const out: Record<string, any> = {};
    for (const [key, value] of this.siteContentMap) out[key] = value;
    return out;
  }

  async upsertSiteContent(key: string, value: any): Promise<SiteContent> {
    this.siteContentMap.set(key, value);
    return { id: 0, key, value, updatedAt: new Date() } as SiteContent;
  }

  // Blog post operations
  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPostsMap.values()).filter((p) => p.isPublished);
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPostsMap.values());
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPostsMap.get(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPostsMap.values()).find((p) => p.slug === slug);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentBlogPostId++;
    const now = new Date();
    const post: BlogPost = {
      coverImage: null,
      destination: null,
      articleType: null,
      linkedExperience: null,
      featured: false,
      isPublished: true,
      readTime: 5,
      tags: [],
      content: [],
      ...insertPost,
      id,
      createdAt: now,
      updatedAt: now,
      publishedAt: insertPost.publishedAt ?? now,
    } as BlogPost;
    this.blogPostsMap.set(id, post);
    return post;
  }

  async updateBlogPost(id: number, updates: UpdateBlogPost): Promise<BlogPost | undefined> {
    const existing = this.blogPostsMap.get(id);
    if (!existing) return undefined;
    const updated: BlogPost = {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date(),
    } as BlogPost;
    this.blogPostsMap.set(id, updated);
    return updated;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPostsMap.delete(id);
  }

  // Video operations
  async getVideos(): Promise<Video[]> {
    return Array.from(this.videosMap.values()).filter(video => video.isActive);
  }

  async getVideo(id: number): Promise<Video | undefined> {
    return this.videosMap.get(id);
  }

  async getVideoBySlug(slug: string): Promise<Video | undefined> {
    return Array.from(this.videosMap.values()).find(video => video.slug === slug);
  }

  async getVideosByCategory(category: string): Promise<Video[]> {
    return Array.from(this.videosMap.values()).filter(video => 
      video.isActive && video.category.toLowerCase() === category.toLowerCase()
    );
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const id = this.currentVideoId++;
    const video: Video = {
      autoplay: false,
      muted: true,
      loop: false,
      controls: false,
      isActive: true,
      ...insertVideo,
      description: insertVideo.description || null,
      duration: insertVideo.duration || null,
      posterUrl: insertVideo.posterUrl || null,
      webmUrl: insertVideo.webmUrl || null,
      mp4Url: insertVideo.mp4Url || null,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.videosMap.set(id, video);
    return video;
  }

  async updateVideo(id: number, updates: UpdateVideo): Promise<Video | undefined> {
    const existing = this.videosMap.get(id);
    if (!existing) return undefined;

    const updated: Video = {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date(),
    };
    
    this.videosMap.set(id, updated);
    return updated;
  }

  async deleteVideo(id: number): Promise<boolean> {
    return this.videosMap.delete(id);
  }


  // Initialize video data from attached assets
  private initializeDefaultVideos() {
    const videoData = [
      // North Coast Videos
      { title: "Sunset Yacht Charter", slug: "sunset-yacht-charter", videoUrl: "/attached_assets/sunset-yacht-ride_1754269442675.mp4", category: "Water Sports", description: "Experience luxury yacht charter at sunset along Egypt's stunning North Coast. Premium refreshments and breathtaking coastal views included.", autoplay: true, muted: true, loop: true, controls: false },
      { title: "Beach Club Experience", slug: "beach-club-experience", videoUrl: "/attached_assets/Beach Club Experience_1754270187133.mp4", category: "Relaxation", description: "Exclusive access to premium beach clubs with VIP cabana service, gourmet cuisine, and pristine private beaches.", autoplay: true, muted: true, loop: true, controls: false },
      { title: "Water Sports Adventure", slug: "water-sports-adventure", videoUrl: "/attached_assets/water-sport-adventure_1754269930685.mp4", category: "Water Sports", description: "Thrilling water sports activities including jet skiing, parasailing, and windsurfing along the Mediterranean coast.", autoplay: true, muted: true, loop: true, controls: false },
      { title: "North Coast Beach", slug: "north-coast-beach", videoUrl: "/attached_assets/beach_1754271424219.mp4", category: "Beach", description: "Stunning views of the pristine beaches and crystal-clear waters of Egypt's North Coast.", autoplay: true, muted: true, loop: true, controls: false },
      { title: "North Coast Overview", slug: "north-coast-overview", videoUrl: "/attached_assets/northcoast_1751038997736.mp4", category: "Destination", description: "Comprehensive overview of Egypt's North Coast destination showcasing luxury resorts and Mediterranean beauty.", autoplay: true, muted: true, loop: true, controls: false },
      { title: "Spa & Wellness Retreat", slug: "spa-wellness-retreat", videoUrl: "/attached_assets/Spa & Wellness Retreat_1754271102938.mp4", category: "Wellness", description: "Luxury spa and wellness experiences featuring holistic treatments and peaceful relaxation environments.", autoplay: true, muted: true, loop: true, controls: false },
      { title: "El Gouna Nightlife", slug: "el-gouna-nightlife", videoUrl: "/attached_assets/el gouna nightlife_1754270925465.mp4", category: "Entertainment", description: "Vibrant nightlife and entertainment scene in El Gouna with world-class dining and socializing.", autoplay: true, muted: true, loop: true, controls: false },

      // Siwa Videos  
      { title: "Siwa Oasis Desert", slug: "siwa-oasis-desert", videoUrl: "/attached_assets/siwa_1751042722081.mp4", category: "Desert", description: "Breathtaking desert landscapes and ancient oasis views in the mystical Siwa region.", autoplay: true, muted: true, loop: true, controls: false },
      { title: "Salt Lake Float Therapy", slug: "salt-lake-float-therapy", videoUrl: "/attached_assets/Salt Lake Float Therapy_1751926016176.mp4", category: "Wellness", description: "Therapeutic floating experience in Siwa's natural salt lakes with healing properties and tranquil environment.", autoplay: true, muted: true, loop: true, controls: false },
      { title: "Old Town Shali Fortress", slug: "old-town-shali-fortress", videoUrl: "/attached_assets/Old Town- Shali Fortress _1751636630449.mp4", category: "Heritage", description: "Explore the ancient Shali Fortress and historic Old Town of Siwa with its unique mud-brick architecture.", autoplay: true, muted: true, loop: true, controls: false }
    ];

    videoData.forEach(data => {
      const video: Video = {
        id: this.currentVideoId++,
        title: data.title,
        slug: data.slug,
        videoUrl: data.videoUrl,
        posterUrl: null,
        webmUrl: null,
        mp4Url: data.videoUrl,
        category: data.category,
        description: data.description,
        duration: null,
        autoplay: data.autoplay,
        muted: data.muted,
        loop: data.loop,
        controls: data.controls,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      this.videosMap.set(video.id, video);
    });
  }
}

/**
 * Postgres-backed storage for hotels and blog posts. Other entities
 * (users, admins, images, pages, page-blocks, videos, experiences)
 * still live in memory via the inherited MemStorage methods — those
 * will move to Postgres in later phases. Constructor seeds the hotels
 * and blog_posts tables on first boot if they're empty, so the admin
 * dashboard has data to edit immediately.
 */
export class PgStorage extends MemStorage {
  private hotelSeedPromise: Promise<void>;
  private blogSeedPromise: Promise<void>;
  private experienceSeedPromise: Promise<void>;

  constructor() {
    super();
    this.hotelSeedPromise = this.seedHotelsIfEmpty().catch((err) => {
      console.error("Hotel seed failed:", err);
    });
    this.blogSeedPromise = this.seedBlogPostsIfEmpty().catch((err) => {
      console.error("Blog post seed failed:", err);
    });
    this.experienceSeedPromise = this.seedExperiencesIfMissing().catch((err) => {
      console.error("Experience seed failed:", err);
    });
    // One-off (idempotent) background pass: shrink any oversized media
    // that was uploaded before compression-on-upload existed. This is
    // what fixes the "hotel pages take 20 s to load" issue on already
    // populated databases — new uploads are compressed at ingest.
    this.optimizeOversizedImages().catch((err) => {
      console.error("Media optimization pass failed:", err);
    });
  }

  /**
   * Recompress DB-stored images whose bytes exceed a threshold. Runs in
   * the background on boot. Cheap on subsequent boots: it only reads the
   * byte length (not the blob) to decide, and once everything is small
   * the pass finds nothing to do. Leaves videos and already-small images
   * untouched.
   */
  private async optimizeOversizedImages(): Promise<void> {
    if (!db) return;
    // Only touch genuinely oversized media. The images that caused the
    // 20 s page loads were 15–30 MB straight off a camera; anything
    // already ~2 MB or under serves fine and isn't worth recompressing
    // (and recompressing a near-threshold JPEG every boot would just
    // grind it down generationally). 3 MB of base64 ≈ 2.2 MB of image.
    const THRESHOLD = 3_000_000;
    let rows: Array<{ id: number; mimeType: string; len: number }> = [];
    try {
      rows = (await db
        .select({
          id: uploadedImages.id,
          mimeType: uploadedImages.mimeType,
          len: sql<number>`length(${uploadedImages.data})`,
        })
        .from(uploadedImages)
        .where(sql`${uploadedImages.data} is not null`)) as any;
    } catch (err) {
      console.error("Could not scan media for optimization:", err);
      return;
    }
    const targets = rows.filter(
      (r) => (r.mimeType || "").startsWith("image/") && Number(r.len) > THRESHOLD,
    );
    if (targets.length === 0) return;
    console.log(`Optimizing ${targets.length} oversized image(s)…`);
    for (const t of targets) {
      try {
        const full = await this.getImage(t.id);
        if (!full || !(full as any).data) continue;
        const input = Buffer.from((full as any).data, "base64");
        const output = await sharp(input)
          .rotate()
          .resize({ width: 2200, height: 2200, fit: "inside", withoutEnlargement: true })
          .jpeg({ quality: 82, progressive: true, mozjpeg: true })
          .toBuffer();
        // Only write back if we actually saved space.
        if (output.length < input.length) {
          await db
            .update(uploadedImages)
            .set({
              data: output.toString("base64"),
              mimeType: "image/jpeg",
              size: output.length,
            })
            .where(eq(uploadedImages.id, t.id));
          console.log(
            `  · image #${t.id}: ${(input.length / 1e6).toFixed(1)}MB → ${(output.length / 1e6).toFixed(2)}MB`,
          );
        }
      } catch (err) {
        console.warn(`  · image #${t.id} skipped:`, err);
      }
    }
    console.log("Media optimization pass complete.");
  }

  // ── Images ──────────────────────────────────────────────
  // Persist to Postgres so the media library survives restarts and
  // redeploys. (MemStorage kept these in an in-memory map, which is
  // why uploads vanished on every deploy.)
  async uploadImage(insertImage: InsertImage): Promise<UploadedImage> {
    if (!db) return super.uploadImage(insertImage);
    const [row] = await db
      .insert(uploadedImages)
      .values({
        filename: insertImage.filename,
        originalName: insertImage.originalName,
        path: insertImage.path,
        size: insertImage.size,
        mimeType: insertImage.mimeType,
        category: insertImage.category,
        pageId: insertImage.pageId || null,
        sectionId: insertImage.sectionId || null,
        description: insertImage.description || null,
        data: (insertImage as any).data ?? null,
        // The auth admin is an in-memory default that isn't in the
        // Postgres admins table, so referencing its id would violate
        // the uploaded_by → admins FK. Attribution isn't essential here.
        uploadedBy: null,
      })
      .returning();
    return row;
  }

  /** Set the public path once we know the inserted id (so it can point
   *  at /media/:id). */
  async setImagePath(id: number, path: string): Promise<void> {
    if (!db) return;
    await db.update(uploadedImages).set({ path }).where(eq(uploadedImages.id, id));
  }

  async getImages(category?: string, pageId?: string): Promise<UploadedImage[]> {
    if (!db) return super.getImages(category, pageId);
    const conds = [];
    if (category) conds.push(eq(uploadedImages.category, category));
    if (pageId) conds.push(eq(uploadedImages.pageId, pageId));
    // Select metadata only — never load the (potentially huge) base64
    // blob just to list the library.
    const cols = {
      id: uploadedImages.id,
      filename: uploadedImages.filename,
      originalName: uploadedImages.originalName,
      path: uploadedImages.path,
      size: uploadedImages.size,
      mimeType: uploadedImages.mimeType,
      category: uploadedImages.category,
      pageId: uploadedImages.pageId,
      sectionId: uploadedImages.sectionId,
      description: uploadedImages.description,
      uploadedBy: uploadedImages.uploadedBy,
      uploadedAt: uploadedImages.uploadedAt,
    };
    const rows = conds.length
      ? await db.select(cols).from(uploadedImages).where(conds.length === 1 ? conds[0] : and(...conds))
      : await db.select(cols).from(uploadedImages);
    return (rows as any[]).sort((a, b) => (b.id ?? 0) - (a.id ?? 0)) as UploadedImage[];
  }

  async getImage(id: number): Promise<UploadedImage | undefined> {
    if (!db) return super.getImage(id);
    const rows = await db.select().from(uploadedImages).where(eq(uploadedImages.id, id));
    return rows[0];
  }

  async deleteImage(id: number): Promise<boolean> {
    if (!db) return super.deleteImage(id);
    const result = await db.delete(uploadedImages).where(eq(uploadedImages.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  private async seedHotelsIfEmpty(): Promise<void> {
    if (!db) return;
    const existing = await db.select().from(hotels).limit(1);
    if (existing.length > 0) return;
    console.log(`Seeding ${seedHotels.length} hotels into Postgres…`);
    for (const h of seedHotels) {
      await db.insert(hotels).values(h as any);
    }
  }

  private async seedBlogPostsIfEmpty(): Promise<void> {
    if (!db) return;
    const existing = await db.select().from(blogPosts).limit(1);
    if (existing.length > 0) return;
    console.log(`Seeding ${seedBlogPosts.length} blog posts into Postgres…`);
    for (const p of seedBlogPosts) {
      await db.insert(blogPosts).values(p as any);
    }
  }

  /**
   * Insert any curated bundled tour that isn't already in the
   * experiences table by slug. Idempotent — runs every boot but
   * inserts at most one row per missing slug. Leaves legacy
   * pricing records (with null slug) untouched.
   */
  private async seedExperiencesIfMissing(): Promise<void> {
    if (!db) return;
    const existing = await db
      .select({ slug: experiences.slug, details: experiences.details })
      .from(experiences);
    const existingSlugs = new Set(
      existing.map((r) => r.slug).filter((s): s is string => !!s),
    );
    // 1. Insert any tour whose slug isn't already in the table.
    const missing = seedExperiences.filter((e) => e.slug && !existingSlugs.has(e.slug));
    if (missing.length > 0) {
      console.log(`Seeding ${missing.length} experiences into Postgres…`);
      for (const tour of missing) {
        try {
          const details = tour.slug ? tourDetailsBySlug[tour.slug] : undefined;
          await db.insert(experiences).values({ ...tour, details: details ?? null } as any);
        } catch (err: any) {
          if (!String(err?.message ?? "").includes("duplicate key")) {
            console.error("Failed to seed experience:", tour.slug, err);
          }
        }
      }
    }
    // 2. Backfill details for rows that exist but still have null
    //    detail content — so admin doesn't have to start from scratch.
    const needsDetails = existing.filter((r) => r.slug && !r.details && tourDetailsBySlug[r.slug]);
    if (needsDetails.length > 0) {
      console.log(`Backfilling details for ${needsDetails.length} experiences…`);
      for (const row of needsDetails) {
        if (!row.slug) continue;
        const details = tourDetailsBySlug[row.slug];
        await db
          .update(experiences)
          .set({ details: details as any, updatedAt: new Date() })
          .where(eq(experiences.slug, row.slug));
      }
    }
  }

  // ── Experiences (tours + legacy pricing) ────────────────
  async getExperiences(): Promise<Experience[]> {
    if (!db) return super.getExperiences();
    await this.experienceSeedPromise;
    return db.select().from(experiences).where(eq(experiences.isActive, true));
  }

  async getAllExperiences(): Promise<Experience[]> {
    if (!db) return super.getAllExperiences();
    await this.experienceSeedPromise;
    return db.select().from(experiences);
  }

  async getExperience(id: number): Promise<Experience | undefined> {
    if (!db) return super.getExperience(id);
    await this.experienceSeedPromise;
    const rows = await db.select().from(experiences).where(eq(experiences.id, id));
    return rows[0];
  }

  async getExperienceByTitle(title: string): Promise<Experience | undefined> {
    if (!db) return super.getExperienceByTitle(title);
    await this.experienceSeedPromise;
    const rows = await db.select().from(experiences).where(eq(experiences.title, title));
    return rows[0];
  }

  async getExperienceBySlug(slug: string): Promise<Experience | undefined> {
    if (!db) return super.getExperienceBySlug(slug);
    await this.experienceSeedPromise;
    const rows = await db.select().from(experiences).where(eq(experiences.slug, slug));
    return rows[0];
  }

  async createExperience(insert: InsertExperience): Promise<Experience> {
    if (!db) return super.createExperience(insert);
    const rows = await db.insert(experiences).values(insert as any).returning();
    return rows[0];
  }

  async updateExperience(id: number, updates: UpdateExperience): Promise<Experience | undefined> {
    if (!db) return super.updateExperience(id, updates);
    const rows = await db
      .update(experiences)
      .set({ ...(updates as any), updatedAt: new Date() })
      .where(eq(experiences.id, id))
      .returning();
    return rows[0];
  }

  async deleteExperience(id: number): Promise<boolean> {
    if (!db) return super.deleteExperience(id);
    const result = await db.delete(experiences).where(eq(experiences.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // ── Hotels ──────────────────────────────────────────────
  async getHotels(): Promise<Hotel[]> {
    if (!db) return super.getHotels();
    await this.hotelSeedPromise;
    return db.select().from(hotels).where(eq(hotels.isActive, true));
  }

  async getAllHotels(): Promise<Hotel[]> {
    if (!db) return super.getAllHotels();
    await this.hotelSeedPromise;
    return db.select().from(hotels);
  }

  async getHotel(id: number): Promise<Hotel | undefined> {
    if (!db) return super.getHotel(id);
    await this.hotelSeedPromise;
    const rows = await db.select().from(hotels).where(eq(hotels.id, id));
    return rows[0];
  }

  async getHotelBySlug(slug: string): Promise<Hotel | undefined> {
    if (!db) return super.getHotelBySlug(slug);
    await this.hotelSeedPromise;
    const rows = await db.select().from(hotels).where(eq(hotels.slug, slug));
    return rows[0];
  }

  async getHotelsByDestination(destination: string): Promise<Hotel[]> {
    if (!db) return super.getHotelsByDestination(destination);
    await this.hotelSeedPromise;
    return db
      .select()
      .from(hotels)
      .where(and(eq(hotels.destination, destination), eq(hotels.isActive, true)));
  }

  async createHotel(insertHotel: InsertHotel): Promise<Hotel> {
    if (!db) return super.createHotel(insertHotel);
    const rows = await db.insert(hotels).values(insertHotel as any).returning();
    return rows[0];
  }

  async updateHotel(id: number, updates: UpdateHotel): Promise<Hotel | undefined> {
    if (!db) return super.updateHotel(id, updates);
    const rows = await db
      .update(hotels)
      .set({ ...(updates as any), updatedAt: new Date() })
      .where(eq(hotels.id, id))
      .returning();
    return rows[0];
  }

  async deleteHotel(id: number): Promise<boolean> {
    if (!db) return super.deleteHotel(id);
    const result = await db.delete(hotels).where(eq(hotels.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // ── Site content ────────────────────────────────────────
  async getSiteContent(): Promise<Record<string, any>> {
    if (!db) return super.getSiteContent();
    const rows = await db.select().from(siteContent);
    const out: Record<string, any> = {};
    for (const r of rows) out[r.key] = r.value;
    return out;
  }

  async upsertSiteContent(key: string, value: any): Promise<SiteContent> {
    if (!db) return super.upsertSiteContent(key, value);
    const existing = await db.select().from(siteContent).where(eq(siteContent.key, key));
    if (existing.length > 0) {
      const rows = await db
        .update(siteContent)
        .set({ value, updatedAt: new Date() })
        .where(eq(siteContent.key, key))
        .returning();
      return rows[0];
    }
    const rows = await db.insert(siteContent).values({ key, value }).returning();
    return rows[0];
  }

  // ── Blog posts ──────────────────────────────────────────
  async getBlogPosts(): Promise<BlogPost[]> {
    if (!db) return super.getBlogPosts();
    await this.blogSeedPromise;
    return db.select().from(blogPosts).where(eq(blogPosts.isPublished, true));
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    if (!db) return super.getAllBlogPosts();
    await this.blogSeedPromise;
    return db.select().from(blogPosts);
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    if (!db) return super.getBlogPost(id);
    await this.blogSeedPromise;
    const rows = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return rows[0];
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    if (!db) return super.getBlogPostBySlug(slug);
    await this.blogSeedPromise;
    const rows = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return rows[0];
  }

  async createBlogPost(insert: InsertBlogPost): Promise<BlogPost> {
    if (!db) return super.createBlogPost(insert);
    const rows = await db.insert(blogPosts).values(insert as any).returning();
    return rows[0];
  }

  async updateBlogPost(id: number, updates: UpdateBlogPost): Promise<BlogPost | undefined> {
    if (!db) return super.updateBlogPost(id, updates);
    const rows = await db
      .update(blogPosts)
      .set({ ...(updates as any), updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return rows[0];
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    if (!db) return super.deleteBlogPost(id);
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage: IStorage = db ? new PgStorage() : new MemStorage();
if (db) {
  console.log("Storage: Postgres-backed (PgStorage)");
} else {
  console.log("Storage: in-memory only (MemStorage) — DATABASE_URL not set");
}
