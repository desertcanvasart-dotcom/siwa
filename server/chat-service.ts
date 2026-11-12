/**
 * server/chat-service.ts
 *
 * Builds the system prompt + handles the OpenAI call for the Soléi
 * concierge chat. Pulls live site data (hotels, tours, journeys,
 * blog posts) from storage on every request so the AI always has the
 * current catalogue. Stitches in admin-uploaded knowledge files as
 * additional context.
 */

import OpenAI from "openai";
import { db } from "./db";
import { aiKnowledge, hotels, experiences, blogPosts } from "@shared/schema";
import { eq } from "drizzle-orm";
// Canonical facts shared with the public pages (relative import: the
// file has no dependencies, so esbuild bundles it into the server).
import { SIWA, NORTH_COAST, POLICIES } from "../client/src/lib/site-facts";

/** Journal posts the concierge must not recommend. */
const HIDDEN_POSTS = new Set(["the-curse-of-king-tuts-tomb"]);

/** All Soléi prices are USD — normalise any stray € in free-text fields. */
const usd = (v: string | null | undefined) => (v ?? "").replace(/€\s?/g, "$");

/** The canonical facts block — the concierge must not contradict it. */
function factsSection(): string {
  const owned = SIWA.ownedProperties.map((p) => p.name).join(", ");
  const nc = NORTH_COAST.properties.map((p) => `${p.name} (${p.area})`).join(", ");
  return `# Facts you must stay consistent with
- Siwa accommodation: ${SIWA.ownedProperties.length} Soléi-owned properties with pages — ${owned}. Partner lodges (${SIWA.partnerLodgesOnRequest.join(", ")}) can be arranged through our team on request only; they have no pages and are not instantly bookable. Don't name other Siwa hotels as bookable.
- North Coast accommodation: ${NORTH_COAST.properties.length} properties — ${nc}. Casa Cook and The G Hotel Seashell are NOT offered.
- North Coast experiences: only the ones in the live catalogue below (private yacht, beach club, Marassi Water World, signature dinner, nightlife, luxury spa). There is no sunset-sailing, flamingo-watching, open-water swim, El Alamein heritage tour, coastline drive or seafood-lunch product.
- Siwa experiences: only the ones in the live catalogue below. There are no horseback rides and no standalone Oracle Temple tour.
- North Coast geography (west to east): ${NORTH_COAST.geography.order}. Almaza Bay is ${NORTH_COAST.geography.almazaFromMarassi}; El Alamein is ${NORTH_COAST.geography.elAlameinFromMarassi}. The coast lies ${NORTH_COAST.geography.position}. Al Alamein Hotel is in the Marassi area; Rixos Premium Alamein is in El Alamein.
- Travel to the North Coast: from Cairo ${NORTH_COAST.travelTimes.fromCairo}; from Alexandria ${NORTH_COAST.travelTimes.fromAlexandria}; from Borg El Arab airport ${NORTH_COAST.travelTimes.fromBorgElArab}. Airports: ${NORTH_COAST.airports.join("; ")}.
- North Coast best months: ${NORTH_COAST.bestMonths}; peak: ${NORTH_COAST.peakSeason}.
- Siwa: the drive from Cairo is ${SIWA.driveFromCairo}; advise guests to ${SIWA.cairoDepartureAdvice}. Best season ${SIWA.season}; summer is ${SIWA.summerHeat}.
- Salt-lake float: ${SIWA.saltLakeFloatTiming}
- Sand bath: ${SIWA.sandBath.duration}. ${SIWA.sandBath.warning} ${SIWA.sandBath.season}.
- Soléi does not sell flights.
- Prices are in ${POLICIES.currency}.
- Cancellation: ${POLICIES.cancellationPrecedence} Point guests to the product page or /terms-of-service rather than quoting a rule.
- Insurance: ${POLICIES.travelInsurance}
- Guest reviews: don't quote or invent guest reviews or ratings.`;
}

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

let client: OpenAI | null = null;
function getClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY is not set. Add it to the Railway environment variables.",
    );
  }
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// The prompt pulls the whole catalogue (4 queries) plus every uploaded
// knowledge document. Rebuilding that on every chat message is wasted
// DB load — cache it briefly; a 60 s stale window is invisible to
// visitors but collapses per-message queries to ~zero.
let promptCache: { value: string; builtAt: number } | null = null;
const PROMPT_CACHE_TTL = 60_000;

/** Builds the system prompt the AI sees on every conversation. */
async function buildSystemPrompt(): Promise<string> {
  if (promptCache && Date.now() - promptCache.builtAt < PROMPT_CACHE_TTL) {
    return promptCache.value;
  }
  const value = await buildSystemPromptUncached();
  promptCache = { value, builtAt: Date.now() };
  return value;
}

async function buildSystemPromptUncached(): Promise<string> {
  let hotelLines: string[] = [];
  let experienceLines: string[] = [];
  let journeyLines: string[] = [];
  let blogLines: string[] = [];
  let knowledgeBlocks: string[] = [];

  if (db) {
    const [liveHotels, liveExp, livePosts, knowledge] = await Promise.all([
      db.select().from(hotels).where(eq(hotels.isActive, true)),
      db.select().from(experiences).where(eq(experiences.isActive, true)),
      db.select().from(blogPosts).where(eq(blogPosts.isPublished, true)),
      db.select().from(aiKnowledge).where(eq(aiKnowledge.isActive, true)),
    ]);

    hotelLines = liveHotels.map((h) => {
      const dest = h.destination === "siwa" ? "Siwa Oasis" : "North Coast";
      return `- ${h.name} (${dest}) — ${usd(h.pricePerNight) || "price on request"} — ${h.blurb ?? ""} (URL: /${h.destination === "siwa" ? "siwa-oasis" : "north-coast"}/accommodation/${h.slug})`;
    });

    const tours = liveExp.filter((e) => e.category !== "Curated Journey");
    const journeys = liveExp.filter((e) => e.category === "Curated Journey");

    experienceLines = tours.map((e) => {
      const dest = e.destination === "siwa" ? "Siwa" : e.destination === "north-coast" ? "North Coast" : "Egypt";
      const url = e.destination === "siwa"
        ? `/siwa-oasis/experiences/${e.slug}`
        : e.destination === "north-coast"
          ? `/north-coast/experiences/${e.slug}`
          : `/journeys/${e.slug}`;
      const price = Number(e.pricePerPerson) > 0 ? `$${Number(e.pricePerPerson).toFixed(0)} pp` : "price on request";
      return `- ${e.title} (${dest}) — ${e.duration} — ${price} — ${e.summary} (URL: ${url})`;
    });

    journeyLines = journeys.map((j) => {
      const price = Number(j.pricePerPerson) > 0 ? `from $${Number(j.pricePerPerson).toFixed(0)} pp` : "price on request";
      return `- ${j.title} — ${j.duration} — ${price} — ${j.summary} (URL: /journeys/${j.slug})`;
    });

    blogLines = livePosts.filter((p) => !HIDDEN_POSTS.has(p.slug)).slice(0, 20).map((p) => {
      return `- "${p.title}" (${p.category}) — ${p.excerpt} (URL: /journal/${p.slug})`;
    });

    knowledgeBlocks = knowledge.map(
      (k) => `--- ${k.title} (${k.filename}) ---\n${k.content}\n`,
    );
  }

  const knowledgeSection = knowledgeBlocks.length > 0
    ? `\n## Additional knowledge (from uploaded documents)\n${knowledgeBlocks.join("\n")}\n`
    : "";

  return `You are the Soléi travel concierge — a calm, considered, knowledgeable guide for visitors planning trips to Siwa Oasis and Egypt's North Coast.

# Tone
- Warm and editorial, never salesy. Match the brand voice: confident, understated, attentive to detail.
- Short paragraphs. Plain English. No emoji. No exclamation marks except where natural.
- When recommending, name the specific property, tour, or journey — never generic phrases like "various options".

# What you can help with
- Recommending hotels, experiences, and curated multi-night journeys based on the visitor's preferences (budget, dates, party size, vibe — wellness, romantic, family, adventure, cultural, etc.).
- Explaining what a property or experience is like, including practical details (board basis, what's included, durations).
- Walking visitors through how booking works: Soléi's Siwa properties book directly online (${SIWA.bookingEngine}, instant confirmation); Siwa experiences, journeys and all North Coast bookings go through a request — we confirm availability and send a secure payment link within 24 hours.
- Suggesting an itinerary if asked, drawing from real properties and experiences listed below.
- Pointing them to the right page to enquire or read more. When you reference a specific item, include its URL in markdown link form: [name](url).

# What you should NOT do
- Don't invent properties, tours, or prices that aren't listed below.
- Don't promise specific availability — say "subject to confirmation" and direct them to /enquire or /review.
- Quote prices in USD only, exactly as listed in the catalogue.
- If the visitor asks something outside travel scope (politics, unrelated topics), gently redirect: "I'm here to help plan your Soléi journey — happy to help with that side of things."

${factsSection()}

# Current live catalogue

## Hotels (${hotelLines.length})
${hotelLines.join("\n") || "(none currently active)"}

## Experiences / Tours (${experienceLines.length})
${experienceLines.join("\n") || "(none currently active)"}

## Curated Journeys — multi-night packages (${journeyLines.length})
${journeyLines.join("\n") || "(none currently active)"}

## Recent Journal articles
${blogLines.join("\n") || "(none)"}

# Booking flow
- Visitors can shape a trip on the home page booking bar (accommodation + experience + transport) → it sends them to /review for a summary → contact form sends the enquiry.
- For direct enquiries: /enquire.
- North Coast bookings, Siwa experiences and journeys: confirmed by our team within 24 hours, then a secure payment link is sent.
- Soléi's Siwa properties: book directly on the property page with instant confirmation (${SIWA.bookingEngine}).
${knowledgeSection}
Use only what's listed above. If a visitor asks for something not in the catalogue, say "I don't have that as a current offering — would you like me to suggest something close?" rather than inventing.`;
}

export interface ChatRequestBody {
  messages: ChatMessage[];
}

export async function chat(body: ChatRequestBody): Promise<string> {
  const system = await buildSystemPrompt();
  const messages = [
    { role: "system" as const, content: system },
    ...body.messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  const completion = await getClient().chat.completions.create({
    model: MODEL,
    messages,
    temperature: 0.4,
    max_tokens: 700,
  });

  return completion.choices[0]?.message?.content?.trim() || "I'm not sure how to answer that — could you rephrase?";
}
