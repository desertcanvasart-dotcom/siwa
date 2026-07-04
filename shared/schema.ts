import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Admin users table
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Uploaded images table
export const uploadedImages = pgTable("uploaded_images", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  path: text("path").notNull(),
  size: integer("size").notNull(),
  mimeType: text("mime_type").notNull(),
  category: text("category").notNull(), // 'hotel', 'experience', 'destination', 'general'
  pageId: text("page_id"), // specific page/item this image belongs to
  sectionId: text("section_id"), // specific section within the page (hero, gallery, amenities, etc.)
  description: text("description"),
  /** Base64-encoded file bytes. When set, the file is served from the
   *  DB at /media/:id and survives redeploys (Railway disk is wiped on
   *  every deploy). Null for legacy rows that point at a disk path. */
  data: text("data"),
  uploadedBy: integer("uploaded_by").references(() => admins.id),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// Experiences / tours table
export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().unique(),
  /** URL slug for the public tour card. Nullable for legacy
   *  pricing records that pre-date the tour catalogue. */
  slug: text("slug").unique(),
  /** 'siwa' | 'north-coast' — null for legacy records. */
  destination: text("destination"),
  category: text("category").notNull(),
  pricePerPerson: decimal("price_per_person", { precision: 10, scale: 2 }).notNull(),
  priceFor2: decimal("price_for_2", { precision: 10, scale: 2 }),
  priceFor3: decimal("price_for_3", { precision: 10, scale: 2 }),
  priceFor4: decimal("price_for_4", { precision: 10, scale: 2 }),
  priceFor5: decimal("price_for_5", { precision: 10, scale: 2 }),
  priceFor6: decimal("price_for_6", { precision: 10, scale: 2 }),
  priceFor7: decimal("price_for_7", { precision: 10, scale: 2 }),
  priceFor8: decimal("price_for_8", { precision: 10, scale: 2 }),
  duration: text("duration").notNull(),
  maxGuests: integer("max_guests").notNull().default(8),
  minAge: integer("min_age").notNull().default(12),
  difficulty: text("difficulty").notNull().default('Easy'),
  summary: text("summary").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  mediaType: text("media_type").notNull().default('image'), // 'image' or 'video'
  eco: boolean("eco").notNull().default(false),
  luxury: boolean("luxury").notNull().default(false),
  wellness: boolean("wellness").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  /**
   * Rich detail for the experience detail page — same pattern as
   * hotels.details. Mirrors ExperienceDetail in
   * client/src/lib/experience-data.ts. Optional; falls back to the
   * TS file when null.
   */
  details: jsonb("details"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Page Builder Schema
export const pages = pgTable("pages", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  metaDescription: text("meta_description"),
  isPublished: boolean("is_published").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const pageBlocks = pgTable("page_blocks", {
  id: serial("id").primaryKey(),
  pageId: integer("page_id").notNull().references(() => pages.id, { onDelete: "cascade" }),
  blockType: text("block_type").notNull(), // hero, text, image, gallery, video, etc.
  content: jsonb("content").notNull(), // block-specific content/settings
  position: integer("position").notNull().default(0),
  isVisible: boolean("is_visible").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const blockTemplates = pgTable("block_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  blockType: text("block_type").notNull(),
  preview: text("preview"), // preview image URL
  defaultContent: jsonb("default_content").notNull(),
  category: text("category").notNull().default("general"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Hotels table
export const hotels = pgTable("hotels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  imageUrl: text("image_url"),
  blurb: text("blurb").notNull(),
  description: text("description"),
  latitude: decimal("latitude", { precision: 10, scale: 6 }),
  longitude: decimal("longitude", { precision: 10, scale: 6 }),
  category: text("category").notNull(),
  pricePerNight: text("price_per_night"), // Flexible pricing as string
  amenities: jsonb("amenities").notNull().default('[]'), // Array of amenities
  destination: text("destination").notNull(), // 'north-coast' or 'siwa'
  eco: boolean("eco").notNull().default(false),
  luxury: boolean("luxury").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  /**
   * Rich detail for the hotel detail page — kept in a single JSONB
   * column so adding new fields never requires a schema migration.
   * Mirrors the HotelDetail interface in client/src/lib/hotel-data.ts:
   * { nameMain, nameItalic, tagLine, heroTag, heroMeta, breadcrumbLabel,
   *   gradient, intro[], eyebrow, headline, headlineItalic, facts[],
   *   rooms[], location[], reviews[], gallerySize, related[], basePrice,
   *   priceLabel, tabTravelWidgetId }. Optional — when null, the public
   *   detail page falls back to the TS file under client/src/lib.
   */
  details: jsonb("details"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Site content table — generic key → JSONB store for editable copy
// on static pages (home hero, our story, FAQs, etc.). Each row holds
// one logical content unit; the key is a hierarchical dotted path
// like "home.hero.title" or "our_story.body".
export const siteContent = pgTable("site_content", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blog posts table
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  /** Array of paragraph strings — stored as JSONB for flexibility. */
  content: jsonb("content").notNull().default('[]'),
  category: text("category").notNull(),
  coverImage: text("cover_image"),
  author: text("author").notNull(),
  publishedAt: timestamp("published_at").defaultNow(),
  readTime: integer("read_time").notNull().default(5),
  featured: boolean("featured").notNull().default(false),
  tags: jsonb("tags").notNull().default('[]'),
  destination: text("destination"), // 'siwa' | 'north-coast' | null
  articleType: text("article_type"), // 'guide' | 'experience' | null
  linkedExperience: text("linked_experience"),
  isPublished: boolean("is_published").notNull().default(true),
  /** SEO meta title — falls back to title when null. */
  metaTitle: text("meta_title"),
  /** SEO meta description — falls back to excerpt when null. */
  metaDescription: text("meta_description"),
  /** Rich HTML body (TipTap output). Falls back to content[] paragraphs when null. */
  bodyHtml: text("body_html"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI knowledge documents — admin-uploaded files the chat AI uses
// as additional context on every conversation.
export const aiKnowledge = pgTable("ai_knowledge", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  filename: text("filename").notNull(),
  mimeType: text("mime_type").notNull(),
  /** Extracted plain-text content. PDFs go through pdf-parse, plain
   *  text files are stored as-is. Everything else gets the empty string. */
  content: text("content").notNull(),
  charCount: integer("char_count").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Videos table
export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  videoUrl: text("video_url").notNull(),
  posterUrl: text("poster_url"),
  webmUrl: text("webm_url"),
  mp4Url: text("mp4_url"),
  category: text("category").notNull(),
  description: text("description"),
  duration: integer("duration"), // Duration in seconds
  autoplay: boolean("autoplay").notNull().default(false),
  muted: boolean("muted").notNull().default(true),
  loop: boolean("loop").notNull().default(false),
  controls: boolean("controls").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Schema definitions
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertAdminSchema = createInsertSchema(admins).pick({
  username: true,
  password: true,
  email: true,
});

export const insertImageSchema = createInsertSchema(uploadedImages).omit({
  id: true,
  uploadedAt: true,
});

export const insertExperienceSchema = createInsertSchema(experiences).omit({
  id: true,
  updatedAt: true,
});

export const updateExperienceSchema = createInsertSchema(experiences).omit({
  id: true,
}).partial();

export const insertPageSchema = createInsertSchema(pages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPageBlockSchema = createInsertSchema(pageBlocks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBlockTemplateSchema = createInsertSchema(blockTemplates).omit({
  id: true,
  createdAt: true,
});

export const insertHotelSchema = createInsertSchema(hotels).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateHotelSchema = createInsertSchema(hotels).omit({
  id: true,
}).partial();

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateVideoSchema = createInsertSchema(videos).omit({
  id: true,
}).partial();

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
}).partial();

// Hotel Request Schema (for email sending - no database table needed)
export const hotelRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  guests: z.string().default("2"),
  message: z.string().optional(),
  hotelName: z.string().min(1, "Hotel name is required"),
  hotelEmail: z.string().email("Valid hotel email is required").default("hello@solei.com"),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof admins.$inferSelect;
export type InsertImage = z.infer<typeof insertImageSchema>;
export type UploadedImage = typeof uploadedImages.$inferSelect;
export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type UpdateExperience = z.infer<typeof updateExperienceSchema>;
export type Experience = typeof experiences.$inferSelect;

export type InsertPage = z.infer<typeof insertPageSchema>;
export type Page = typeof pages.$inferSelect;
export type InsertPageBlock = z.infer<typeof insertPageBlockSchema>;
export type PageBlock = typeof pageBlocks.$inferSelect;
export type InsertBlockTemplate = z.infer<typeof insertBlockTemplateSchema>;
export type BlockTemplate = typeof blockTemplates.$inferSelect;

export type InsertHotel = z.infer<typeof insertHotelSchema>;
export type UpdateHotel = z.infer<typeof updateHotelSchema>;
export type Hotel = typeof hotels.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type UpdateVideo = z.infer<typeof updateVideoSchema>;
export type Video = typeof videos.$inferSelect;

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type UpdateBlogPost = z.infer<typeof updateBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export const upsertSiteContentSchema = z.object({
  key: z.string().min(1),
  value: z.any(),
});
export type UpsertSiteContent = z.infer<typeof upsertSiteContentSchema>;
export type SiteContent = typeof siteContent.$inferSelect;

export type HotelRequest = z.infer<typeof hotelRequestSchema>;
