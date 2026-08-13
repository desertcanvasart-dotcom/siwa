import { useSiteContent, pickContent } from "@/lib/useSiteContent";

/**
 * Single source of truth for the public contact channels.
 *
 * The numbers used to be hard-coded per page, which is how /enquire
 * ended up shipping a `wa.me/201000000000` placeholder while the rest
 * of the site advertised a real number. Everything now reads the
 * admin-editable site-content keys (Dashboard → Site content →
 * contact.*), so the owner can change the number in one place.
 *
 * FALLBACKS are only a safety net for a fresh database — they mirror
 * the number already published across the site.
 */
const FALLBACK_WHATSAPP = "201206887575";
const FALLBACK_WHATSAPP_LABEL = "+20 120 688 7575";
const FALLBACK_EMAIL = "hello@solei.travel";

export interface ContactChannels {
  /** Digits only, country code first — ready for a wa.me URL. */
  whatsappDigits: string;
  /** Human-readable form, e.g. "+20 120 688 7575". */
  whatsappLabel: string;
  /** Full wa.me link; pass text to prefill a message. */
  whatsappHref: (text?: string) => string;
  email: string;
}

export function useContact(): ContactChannels {
  const content = useSiteContent();
  const raw = pickContent<string>(content, "contact.whatsapp", "") || FALLBACK_WHATSAPP;
  const whatsappDigits = raw.replace(/\D/g, "");
  const whatsappLabel =
    pickContent<string>(content, "contact.whatsapp_label", "") || FALLBACK_WHATSAPP_LABEL;
  const email = pickContent<string>(content, "contact.email", "") || FALLBACK_EMAIL;

  return {
    whatsappDigits,
    whatsappLabel,
    email,
    whatsappHref: (text?: string) =>
      `https://wa.me/${whatsappDigits}${text ? `?text=${encodeURIComponent(text)}` : ""}`,
  };
}
