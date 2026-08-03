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
      return `- ${h.name} (${dest}) — ${h.pricePerNight ?? "price on request"} — ${h.blurb ?? ""} (URL: /${h.destination === "siwa" ? "siwa-oasis" : "north-coast"}/accommodation/${h.slug})`;
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
      return `- ${e.title} (${dest}) — ${e.duration} — €${e.pricePerPerson} pp — ${e.summary} (URL: ${url})`;
    });

    journeyLines = journeys.map((j) => {
      return `- ${j.title} — ${j.duration} — from €${j.pricePerPerson} pp — ${j.summary} (URL: /journeys/${j.slug})`;
    });

    blogLines = livePosts.slice(0, 20).map((p) => {
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
- Walking visitors through how booking works: Siwa books direct, North Coast goes through enquiry with payment link within 24 hours.
- Suggesting an itinerary if asked, drawing from real properties and experiences listed below.
- Pointing them to the right page to enquire or read more. When you reference a specific item, include its URL in markdown link form: [name](url).

# What you should NOT do
- Don't invent properties, tours, or prices that aren't listed below.
- Don't promise specific availability — say "subject to confirmation" and direct them to /enquire or /review.
- Don't quote currencies other than what's in the catalogue (EUR / USD via Tab.travel).
- If the visitor asks something outside travel scope (politics, unrelated topics), gently redirect: "I'm here to help plan your Soléi journey — happy to help with that side of things."

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
- All North Coast bookings are confirmed within 24 hours with a Tab.travel payment link.
- Siwa bookings can be confirmed instantly at the property.
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
