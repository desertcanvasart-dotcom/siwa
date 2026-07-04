import { useEffect } from "react";

/**
 * Reveal-on-scroll system.
 *
 * Strategy:
 *   1. `.reveal` defaults to FULLY VISIBLE in CSS so content never
 *      stays hidden if JS or IntersectionObserver fails to fire.
 *   2. On mount we synchronously mark every `.reveal` element that
 *      is already in the viewport as `.visible` — no flicker for
 *      the first screen of content.
 *   3. Body gets a `.js-reveal` class which switches the CSS rules
 *      so any remaining `.reveal:not(.visible)` element fades up
 *      when the IntersectionObserver adds `.visible` on intersect.
 *   4. A MutationObserver picks up elements added to the DOM later
 *      (e.g. when a useQuery resolves) and observes them too.
 */
export function useReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    const markIfInViewport = (el: HTMLElement) => {
      if (el.classList.contains("visible")) return true;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        el.classList.add("visible");
        return true;
      }
      return false;
    };

    const handle = (el: HTMLElement) => {
      if (!markIfInViewport(el)) io.observe(el);
    };

    // 1. Initial pass: mark above-the-fold elements visible BEFORE
    //    flipping body into js-reveal mode, so they never flicker.
    const initial = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal"),
    );
    initial.forEach(markIfInViewport);

    // 2. Enable JS-driven fade-up for the rest of the page.
    document.body.classList.add("js-reveal");

    // 3. Observe elements still hidden so they animate in on scroll.
    initial.forEach((el) => {
      if (!el.classList.contains("visible")) io.observe(el);
    });

    // 4. Pick up future `.reveal` elements (e.g. when async data lands).
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.classList?.contains("reveal")) handle(node);
          node.querySelectorAll?.<HTMLElement>(".reveal").forEach(handle);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      document.body.classList.remove("js-reveal");
    };
  }, []);
}
