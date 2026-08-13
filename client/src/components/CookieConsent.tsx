import { useEffect, useState } from "react";
import { Link } from "wouter";

/**
 * Cookie consent banner — Google Consent Mode v2.
 *
 * The gtag snippet in index.html defaults analytics_storage to
 * "denied" (restoring a stored "granted" synchronously for returning
 * visitors). This banner appears only while no choice is stored;
 * Accept flips consent to granted from that moment on, Decline keeps
 * everything off. The choice lives in localStorage under
 * "solei-consent". The site runs no ads, so ad_* signals stay denied
 * permanently either way.
 */
const STORAGE_KEY = "solei-consent";

function updateGtagConsent(granted: boolean) {
  const g = (window as any).gtag;
  if (typeof g === "function") {
    g("consent", "update", {
      analytics_storage: granted ? "granted" : "denied",
    });
  }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // Storage unavailable (private mode edge cases) — stay hidden
      // rather than nag on every page view.
    }
  }, []);

  const choose = (granted: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEY, granted ? "granted" : "denied");
    } catch {}
    updateGtagConsent(granted);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:max-w-sm z-[80] bg-white border border-sand shadow-[0_8px_40px_rgba(9,24,32,0.14)] p-5"
    >
      <p className="text-[0.55rem] tracking-[0.22em] uppercase text-gold mb-2">
        Cookies
      </p>
      <p className="text-[0.78rem] text-ink-soft leading-[1.7] mb-4">
        We use analytics cookies to understand how visitors use Soléi —
        nothing more. See our{" "}
        <Link href="/privacy" className="text-coastal underline underline-offset-2 hover:text-navy">
          privacy policy
        </Link>
        .
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => choose(true)}
          className="flex-1 bg-gold text-navy py-2.5 text-[0.6rem] tracking-[0.18em] uppercase hover:bg-gold-light transition-colors"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => choose(false)}
          className="flex-1 border border-sand text-ink-soft py-2.5 text-[0.6rem] tracking-[0.18em] uppercase hover:border-navy hover:text-navy transition-colors"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
