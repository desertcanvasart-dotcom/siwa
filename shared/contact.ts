/**
 * The ONE public email address for Soléi. Owner decision (Nov 2026):
 * hello@darsolei.com is the only domain and the only mailbox used anywhere —
 * site copy, Privacy/Terms, enquiry emails (to and from), admin defaults.
 *
 * Enforced in three places so it can't drift again:
 *  - client: useContact() always returns this, ignoring the CMS key
 *  - server: /api/site-content serves this for contact.email and the admin
 *    save endpoint stores nothing else; email.ts refuses other domains
 *  - build: scripts/check-emails.mjs fails `npm run build` if any other
 *    address appears in the source
 */
export const CONTACT_DOMAIN = "darsolei.com";
export const CONTACT_EMAIL = `hello@${CONTACT_DOMAIN}`;
export const CONTACT_FROM = `Soléi <${CONTACT_EMAIL}>`;

/** True when `addr` (bare or "Name <addr>") is on the Soléi domain. */
export function isSoleiAddress(addr: string | undefined | null): boolean {
  if (!addr) return false;
  const m = addr.match(/<([^>]+)>/);
  const email = (m ? m[1] : addr).trim().toLowerCase();
  return email.endsWith(`@${CONTACT_DOMAIN}`);
}
