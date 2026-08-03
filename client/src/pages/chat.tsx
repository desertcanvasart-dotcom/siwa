import { useEffect, useRef, useState } from "react";
import { SEO } from "@/components/seo";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Arch } from "@/components/ui/Arch";
import { useSiteContent, pickContent } from "@/lib/useSiteContent";

/**
 * /chat — Soléi AI concierge. Editorial full-page chat. Posts the
 * conversation history to /api/chat which calls OpenAI with the live
 * site catalogue + admin-uploaded knowledge.
 *
 * When the chat backend is unavailable (no API key, OpenAI down, rate
 * limited, …) we never leak the technical reason to the visitor — we
 * show a graceful fallback with the WhatsApp / email contact the admin
 * configured in the Pages editor → Contact details panel.
 */

type Role = "user" | "assistant";
interface Message {
  role: Role;
  content: string;
  /** Marks an assistant message as the fallback so we can render the
   *  WhatsApp CTA + style it distinctly. */
  fallback?: boolean;
}

const STARTERS = [
  "What's the difference between Siwa and the North Coast?",
  "Suggest a 5-night honeymoon journey.",
  "What hotels do you have in Siwa?",
  "How does booking work?",
];

export default function ChatPage() {
  const content = useSiteContent();
  const waNumber = pickContent<string>(content, "contact.whatsapp", "");
  const waLabel = pickContent(content, "contact.whatsapp_label", "");
  const contactEmail = pickContent(content, "contact.email", "");
  const fallbackMessage = pickContent(
    content,
    "contact.fallback_message",
    "Sorry — I'm not available right now. Please try again in a moment, or reach our team directly and they'll come back to you within the hour.",
  );

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, sending]);

  // Auto-grow the textarea up to a comfortable max.
  useEffect(() => {
    const ta = composerRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }, [input]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    const next: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const json = await res.json();
      if (!res.ok || json?.unavailable) {
        setMessages([
          ...next,
          { role: "assistant", content: fallbackMessage, fallback: true },
        ]);
      } else {
        setMessages([...next, { role: "assistant", content: json.reply }]);
      }
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: fallbackMessage, fallback: true },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const waHref = waNumber
    ? `https://wa.me/${waNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
        "Hi Soléi — I was on your site and wanted to reach out.",
      )}`
    : null;

  return (
    <>
      <SEO
        title="Ask Soléi — Travel concierge"
        description="Chat with the Soléi AI concierge about hotels, experiences, and curated journeys across Siwa Oasis and Egypt's North Coast."
        path="/chat"
      />
      <Nav darkHero={true} />

      <main>
        {/* ── HERO ──────────────────────────────────────────── */}
        <section className="relative bg-navy text-cream overflow-hidden min-h-[44vh] flex items-end">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(155deg,#0F2436 0%,#1a3a52 60%,#2a1a14 100%)",
            }}
          />
          <div className="absolute inset-0 textile-bg pointer-events-none" />
          <div className="absolute top-12 right-8 md:right-20 opacity-30 pointer-events-none">
            <Arch className="w-24 md:w-36 h-auto text-gold" />
          </div>
          <div className="relative max-w-3xl mx-auto w-full px-6 md:px-12 lg:px-20 pt-32 pb-12 md:pt-40 md:pb-16">
            <p className="flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-6">
              <span className="block w-[22px] h-px bg-gold opacity-60" />
              Concierge
            </p>
            <h1
              className="font-display font-normal text-white leading-[1.08] mb-6"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4.2rem)" }}
            >
              Ask <em className="italic text-gold">Soléi.</em>
            </h1>
            <p className="text-[0.95rem] text-white/55 max-w-[56ch] leading-[1.9]">
              The Soléi concierge knows every property, experience, and
              journey we offer. Ask anything — about a destination, the
              right fit for a specific trip, or how booking works.
            </p>
          </div>
        </section>

        {/* ── CHAT SHELL ────────────────────────────────────── */}
        <section className="bg-cream px-4 sm:px-6 md:px-12 lg:px-20 -mt-10 md:-mt-14 pb-16 md:pb-24 relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white border border-sand shadow-[0_18px_50px_-20px_rgba(9,24,32,0.18)] flex flex-col h-[68vh] min-h-[520px]">
              {/* Conversation strip header */}
              <div className="flex items-center justify-between px-5 md:px-7 py-3.5 border-b border-sand-light bg-cream/40">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#5a8a6a] opacity-60 animate-ping" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5a8a6a]" />
                  </span>
                  <p className="text-[0.6rem] tracking-[0.28em] uppercase text-ink-soft/70">
                    Soléi concierge · live
                  </p>
                </div>
                {waHref && (
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex items-center gap-1.5 text-[0.55rem] tracking-[0.22em] uppercase text-ink-soft/65 hover:text-[#25D366] transition-colors"
                  >
                    <WhatsAppIcon className="w-3 h-3" />
                    {waLabel || "WhatsApp"}
                  </a>
                )}
              </div>

              {/* Messages */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-9 py-7"
              >
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <Arch className="w-10 h-auto text-gold mb-5 opacity-70" />
                    <p className="text-[0.5rem] tracking-[0.36em] uppercase text-gold mb-3">
                      Start the conversation
                    </p>
                    <p className="font-display text-[1.2rem] md:text-[1.35rem] text-navy leading-[1.4] mb-7 max-w-md">
                      Tell me how you travel and I'll help you shape the
                      right Soléi journey.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                      {STARTERS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => sendMessage(s)}
                          className="group text-left text-[0.82rem] text-ink-soft border border-sand-light hover:border-gold hover:text-navy hover:bg-cream/40 transition-colors px-3.5 py-3 font-body leading-[1.5]"
                        >
                          <span className="block text-[0.5rem] tracking-[0.28em] uppercase text-gold/65 mb-1 group-hover:text-gold transition-colors">
                            Try
                          </span>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((m, i) => (
                  <MessageBubble
                    key={i}
                    message={m}
                    waHref={waHref}
                    waLabel={waLabel}
                    contactEmail={contactEmail}
                  />
                ))}

                {sending && <TypingIndicator />}
              </div>

              {/* Composer */}
              <form
                onSubmit={handleSubmit}
                className="border-t border-sand bg-cream/30 px-3 sm:px-4 py-3 flex items-end gap-2"
              >
                <textarea
                  ref={composerRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(input);
                    }
                  }}
                  placeholder="Ask about a property, an experience, an itinerary…"
                  rows={1}
                  className="flex-1 resize-none bg-transparent text-[0.95rem] sm:text-[0.9rem] text-ink font-body focus:outline-none px-3 py-2.5 leading-[1.5]"
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  className="group bg-gold text-navy text-[0.6rem] tracking-[0.22em] uppercase font-medium px-5 py-3 hover:bg-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap inline-flex items-center gap-2"
                >
                  Send
                  <ArrowRightIcon className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </button>
              </form>
            </div>

            <p className="text-[0.62rem] text-ink-soft/55 text-center mt-5 leading-[1.7]">
              Replies come from Soléi AI · Suggestions reflect our current
              catalogue · Confirm dates and availability via{" "}
              <a href="/enquire" className="underline underline-offset-2 hover:text-navy">
                enquire
              </a>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

/* ─────────────────────────────────────────────────────────── */

function MessageBubble({
  message,
  waHref,
  waLabel,
  contactEmail,
}: {
  message: Message;
  waHref: string | null;
  waLabel: string;
  contactEmail: string;
}) {
  const isUser = message.role === "user";
  return (
    <div className={`mb-5 flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[88%] md:max-w-[78%] px-4 py-3.5 text-[0.92rem] leading-[1.78] font-body whitespace-pre-wrap ${
          isUser
            ? "bg-navy text-cream"
            : message.fallback
              ? "bg-cream border border-gold/30 text-ink"
              : "bg-cream/60 border border-sand text-ink"
        }`}
      >
        {!isUser && (
          <p className="text-[0.5rem] tracking-[0.3em] uppercase text-gold mb-1.5">
            Soléi
          </p>
        )}
        <FormattedContent content={message.content} />

        {message.fallback && (waHref || contactEmail) && (
          <div className="mt-4 pt-4 border-t border-gold/20 flex flex-col sm:flex-row gap-2">
            {waHref && (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-white text-[0.62rem] tracking-[0.2em] uppercase px-4 py-2.5 transition-colors"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                {waLabel ? `WhatsApp · ${waLabel}` : "WhatsApp us"}
              </a>
            )}
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center justify-center gap-2 border border-sand hover:border-gold text-navy text-[0.62rem] tracking-[0.2em] uppercase px-4 py-2.5 transition-colors"
              >
                Email {contactEmail}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-5">
      <div className="bg-cream/60 border border-sand px-4 py-3.5 inline-flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-gold/60 animate-bounce"
            style={{ animationDelay: `${i * 120}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

/** Renders [link](/url) markdown inline; everything else as plain text. */
function FormattedContent({ content }: { content: string }) {
  const parts = content.split(/(\[[^\]]+\]\([^\)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\[([^\]]+)\]\(([^\)]+)\)$/);
        if (m) {
          return (
            <a
              key={i}
              href={m[2]}
              className="underline decoration-gold/60 underline-offset-2 hover:text-gold transition-colors"
            >
              {m[1]}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.057 21.785h-.005a9.87 9.87 0 01-5.031-1.378l-.36-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.825 9.825 0 016.99 2.897 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.473-8.413z" />
    </svg>
  );
}

function ArrowRightIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}
