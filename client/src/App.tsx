import { Switch, Route, Redirect, useLocation, useParams } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { CookieConsent } from "@/components/CookieConsent";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useRef, lazy, Suspense, Component, type ReactNode, type ComponentType } from "react";
import {
  HOTELS,
  canonicalHotelSlug,
  destForHotelSlug,
  canonicalExperienceSlug,
  destForExperienceSlug,
} from "@/lib/route-maps";

// ──────────────────────────────────────────────────────────────────────
//  Page imports (lazy for code-splitting)
// ──────────────────────────────────────────────────────────────────────

/**
 * Dynamic import that survives redeploys. Every deploy renames the
 * hashed chunk files, so a tab opened before a deploy requests chunks
 * that no longer exist when it navigates — the import rejects and the
 * page went blank. On such a failure we do one full reload (rate-
 * limited so a genuinely broken build can't loop) which picks up the
 * fresh index.html and chunk names.
 */
const RELOAD_FLAG = "chunk-reload-at";
function lazyRetry(importer: () => Promise<{ default: ComponentType<any> }>) {
  return lazy(() =>
    importer()
      .then((m) => {
        sessionStorage.removeItem(RELOAD_FLAG);
        return m;
      })
      .catch((err) => {
        const last = Number(sessionStorage.getItem(RELOAD_FLAG) || 0);
        if (Date.now() - last > 30_000) {
          sessionStorage.setItem(RELOAD_FLAG, String(Date.now()));
          window.location.reload();
          // Never resolves — the reload takes over while Suspense
          // keeps showing the loader instead of a flash of error.
          return new Promise<never>(() => {});
        }
        throw err;
      }),
  );
}

// Core
const Home = lazyRetry(() => import("@/pages/home"));
const OurStory = lazyRetry(() => import("@/pages/our-story"));
const TermsOfService = lazyRetry(() => import("@/pages/terms-of-service"));
const Privacy = lazyRetry(() => import("@/pages/privacy"));
const NotFound = lazyRetry(() => import("@/pages/not-found"));

// Destination hubs
const SiwaHub = lazyRetry(() => import("@/pages/siwa-oasis"));
const SiwaAccommodation = lazyRetry(
  () => import("@/pages/siwa-oasis-accommodation"),
);
const NorthCoastHub = lazyRetry(() => import("@/pages/north-coast-hub"));
const NorthCoastAccommodation = lazyRetry(
  () => import("@/pages/north-coast-accommodation"),
);
const HotelDetail = lazyRetry(() => import("@/pages/hotel-detail"));

// Experience detail — unified template
const ExperienceDetail = lazyRetry(() => import("@/pages/experience-detail"));
const TourDetail = lazyRetry(() => import("@/pages/tour-detail"));
const JourneysPage = lazyRetry(() => import("@/pages/journeys"));
const ReviewPage = lazyRetry(() => import("@/pages/review"));
const PlanPage = lazyRetry(() => import("@/pages/plan"));
const ChatPage = lazyRetry(() => import("@/pages/chat"));

// Transportation
const SiwaTransportation = lazyRetry(() => import("@/pages/siwa-transportation"));

// North Coast experiences archive
const NorthCoastExperiences = lazyRetry(() => import("@/pages/north-coast-experiences"));

// North Coast transportation
const NorthCoastTransportation = lazyRetry(() => import("@/pages/north-coast-transportation"));

// Experience archive
const NewExperiencesArchive = lazyRetry(() => import("@/pages/NewExperiencesArchive"));

// Journal (new canonical) — reuses existing Blog page + post
const Blog = lazyRetry(() => import("@/pages/blog"));
const BlogPostPage = lazyRetry(() => import("@/pages/blog-post"));

// Contact / enquiry
const GetQuote = lazyRetry(() => import("@/pages/get-quote"));
const Enquire = lazyRetry(() => import("@/pages/enquire"));

// Admin + misc
const AdminLogin = lazyRetry(() => import("@/pages/admin-login"));
const AdminDashboard = lazyRetry(() => import("@/pages/admin-dashboard"));
const AdminHotelWizard = lazyRetry(() => import("@/pages/admin-hotel-wizard"));
const AdminTourWizard = lazyRetry(() => import("@/pages/admin-tour-wizard"));
const AdminBlogWizard = lazyRetry(() => import("@/pages/admin-blog-wizard"));
const PageBuilderPage = lazyRetry(() => import("@/pages/page-builder"));
const PremiumExperienceSingle = lazyRetry(
  () => import("@/pages/premium-experience-single"),
);
const SiwaTravelTips = lazyRetry(() => import("@/pages/siwa-travel-tips"));
const NorthCoastTravelTips = lazyRetry(() => import("@/pages/north-coast-travel-tips"));
const SiwaFAQ = lazyRetry(() => import("@/pages/siwa-faq"));
const NorthCoastFAQ = lazyRetry(() => import("@/pages/north-coast-faq"));
const PreviewLayout = lazyRetry(() => import("@/pages/__preview-layout"));

// Branded hub placeholder (used for sections not yet built)
const HubStub = lazyRetry(() => import("@/pages/stubs/HubStub"));

// ──────────────────────────────────────────────────────────────────────
//  Redirect helpers (client-side; for production true 301s configure
//  at the edge — Railway nginx / Vercel / Cloudflare rules)
// ──────────────────────────────────────────────────────────────────────

/**
 * Replace-mode redirect — wouter's default `<Redirect>` PUSHES a new
 * history entry, which leaves the legacy URL in the user's back
 * stack and breaks the browser Back button. This component swaps
 * the URL in place so the legacy path is invisible to history.
 */
function ReplaceRedirect({ to }: { to: string }) {
  const [, setLocation] = useLocation();
  useEffect(() => {
    setLocation(to, { replace: true });
  }, [to, setLocation]);
  return null;
}

/** Redirect a legacy flat hotel slug to its new nested canonical URL. */
function LegacyHotelRedirect() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";
  const dest = destForHotelSlug(slug);
  const canonical = canonicalHotelSlug(slug);
  if (!dest) return <ReplaceRedirect to="/" />;
  return <ReplaceRedirect to={`/${dest}/accommodation/${canonical}`} />;
}

/** Redirect a legacy flat experience slug to its new nested canonical URL. */
function LegacyExperienceRedirect() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";
  const dest = destForExperienceSlug(slug);
  const canonical = canonicalExperienceSlug(slug);
  if (!dest) return <ReplaceRedirect to="/" />;
  return <ReplaceRedirect to={`/${dest}/experiences/${canonical}`} />;
}

/** Redirect /blog/:slug → /journal/:slug */
function BlogPostRedirect() {
  const params = useParams<{ slug: string }>();
  return <ReplaceRedirect to={`/journal/${params.slug ?? ""}`} />;
}

// ──────────────────────────────────────────────────────────────────────
//  Shell
// ──────────────────────────────────────────────────────────────────────

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="text-navy text-sm tracking-[0.3em] uppercase animate-pulse">
        Loading
      </div>
    </div>
  );
}

/**
 * Last line of defense: without a boundary, any render/chunk error
 * unmounts the entire tree and the visitor sees only the page
 * background. This shows a branded recovery screen instead.
 */
class RouteErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Page failed to render:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-5 bg-cream px-6 text-center">
          <p className="font-display text-[1.4rem] text-navy">
            Something went wrong loading this page.
          </p>
          <p className="text-[0.85rem] text-ink-soft max-w-[40ch]">
            This usually clears with a quick refresh.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="bg-gold text-navy px-7 py-3 text-[0.62rem] tracking-[0.22em] uppercase hover:bg-gold-light transition-colors"
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function ScrollRestoration() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
  return null;
}

/**
 * Google Analytics page views for client-side navigation. The gtag
 * snippet in index.html only records the initial full-page load; in
 * an SPA every route change after that would go uncounted without
 * this. The first location is skipped — gtag('config') already
 * reported it.
 */
function AnalyticsPageViews() {
  const [location] = useLocation();
  const firstRef = useRef(true);
  useEffect(() => {
    if (firstRef.current) {
      firstRef.current = false;
      return;
    }
    const g = (window as any).gtag;
    if (typeof g === "function") {
      g("event", "page_view", {
        page_path: location,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);
  return null;
}

/**
 * Intercept clicks on in-page hash anchors so they smooth-scroll
 * without pushing a new history entry. Without this, every "Book
 * now" / "Enquire" / etc. button that points at `#section` adds a
 * step in the browser's back stack, and the user has to click Back
 * multiple times to return to the real previous page.
 */
function AnchorClickHandler() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("#") || href.length < 2) return;
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // Replace (not push) the hash so Back returns to the prior page.
      if (typeof window.history.replaceState === "function") {
        window.history.replaceState(window.history.state, "", `#${id}`);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}

function Router() {
  return (
    <>
      <ScrollRestoration />
      <AnalyticsPageViews />
      <AnchorClickHandler />
      <RouteErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Switch>
          {/* ───── Core ───── */}
          <Route path="/" component={Home} />
          <Route path="/terms-of-service" component={TermsOfService} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/enquire" component={Enquire} />
          <Route path="/our-story" component={OurStory} />

          {/* ───── Journal (canonical) ───── */}
          <Route path="/journal" component={Blog} />
          <Route path="/journal/:slug" component={BlogPostPage} />
          {/* Legacy blog URLs → journal */}
          <Route path="/blog">
            <ReplaceRedirect to="/journal" />
          </Route>
          <Route path="/blog/:slug" component={BlogPostRedirect} />

          {/* ───── Siwa Oasis ───── */}
          <Route path="/siwa-oasis" component={SiwaHub} />
          <Route
            path="/siwa-oasis/accommodation"
            component={SiwaAccommodation}
          />
          {/* Siwa hotel detail — unified template */}
          <Route
            path="/siwa-oasis/accommodation/:slug"
            component={HotelDetail}
          />

          <Route path="/siwa-oasis/experiences" component={NewExperiencesArchive} />
          <Route path="/siwa-oasis/experiences/:slug" component={TourDetail} />

          <Route path="/siwa-oasis/transportation" component={SiwaTransportation} />
          {/* No per-route detail pages exist; every route's information
              lives on the index. Redirect stale/bookmarked slug URLs
              there instead of 404ing or showing a dead-end stub. */}
          <Route path="/siwa-oasis/transportation/:slug">
            <ReplaceRedirect to="/siwa-oasis/transportation" />
          </Route>

          {/* Siwa FAQ / Travel Tips — keep existing paths */}
          <Route path="/siwa-travel-tips" component={SiwaTravelTips} />
          <Route path="/siwa-faq" component={SiwaFAQ} />

          {/* Legacy Siwa hub → new canonical */}
          <Route path="/siwa-sanctuary">
            <ReplaceRedirect to="/siwa-oasis" />
          </Route>

          {/* ───── North Coast ───── */}
          <Route path="/north-coast" component={NorthCoastHub} />
          <Route
            path="/north-coast/accommodation"
            component={NorthCoastAccommodation}
          />
          <Route
            path="/north-coast/accommodation/:slug"
            component={HotelDetail}
          />

          <Route path="/north-coast/experiences" component={NorthCoastExperiences} />
          <Route path="/north-coast/experiences/:slug" component={TourDetail} />
          <Route path="/journeys" component={JourneysPage} />
          <Route path="/journeys/:slug" component={TourDetail} />
          <Route path="/review" component={ReviewPage} />
          <Route path="/plan" component={PlanPage} />
          <Route path="/chat" component={ChatPage} />

          <Route path="/north-coast/transportation" component={NorthCoastTransportation} />
          {/* Was a 404: these slug URLs were linked from the homepage
              and the North Coast hub but never had pages. */}
          <Route path="/north-coast/transportation/:slug">
            <ReplaceRedirect to="/north-coast/transportation" />
          </Route>

          {/* North Coast FAQ / Travel Tips — keep existing paths */}
          <Route path="/north-coast-travel-tips" component={NorthCoastTravelTips} />
          <Route path="/north-coast-faq" component={NorthCoastFAQ} />

          {/* ───── Legacy 301 redirects ───── */}

          {/* /hotel/:slug → /<dest>/accommodation/<canonical-slug> */}
          <Route path="/hotel/:slug" component={LegacyHotelRedirect} />

          {/* /experience/:slug → /<dest>/experiences/<canonical-slug> */}
          <Route path="/experience/:slug" component={LegacyExperienceRedirect} />

          {/* Old flat hotel paths — inline the canonical target since these
              routes have no :slug param pattern for useParams to read. */}
          {HOTELS.flatMap((h) => [h.slug, ...(h.aliases ?? [])]).map((s) => {
            const dest = destForHotelSlug(s);
            const canonical = canonicalHotelSlug(s);
            if (!dest) return null;
            return (
              <Route key={`flat-hotel-${s}`} path={`/${s}`}>
                <ReplaceRedirect to={`/${dest}/accommodation/${canonical}`} />
              </Route>
            );
          })}

          {/* Old flat experience paths — only a subset were exposed in the
              previous router; keep those so we don't 404. */}
          {["salt-lake-float-therapy", "sleeping-under-stars", "traditional-sand-bath-healing", "oracle-temple-pilgrimage"].map((s) => {
            const dest = destForExperienceSlug(s);
            const canonical = canonicalExperienceSlug(s);
            if (!dest) return null;
            return (
              <Route key={`flat-exp-${s}`} path={`/${s}`}>
                <ReplaceRedirect to={`/${dest}/experiences/${canonical}`} />
              </Route>
            );
          })}

          {/* Legacy /get-quote → /enquire */}
          <Route path="/get-quote">
            <ReplaceRedirect to="/enquire" />
          </Route>

          {/* ───── Legacy experiences archive alias ───── */}
          <Route path="/experiences" component={NewExperiencesArchive} />
          <Route path="/experiences-new" component={NewExperiencesArchive} />

          {/* ───── Premium experience single ───── */}
          <Route
            path="/experience/premium/cleopatra-sacred-soak"
            component={PremiumExperienceSingle}
          />

          {/* ───── Admin ───── */}
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin/dashboard" component={AdminDashboard} />
          <Route path="/admin/hotels/new" component={AdminHotelWizard} />
          <Route path="/admin/hotels/:id/edit" component={AdminHotelWizard} />
          <Route path="/admin/tours/new" component={AdminTourWizard} />
          <Route path="/admin/tours/:id/edit" component={AdminTourWizard} />
          <Route path="/admin/blog/new" component={AdminBlogWizard} />
          <Route path="/admin/blog/:id/edit" component={AdminBlogWizard} />
          <Route path="/admin/page-builder/:pageId" component={PageBuilderPage} />
          <Route path="/admin" component={AdminDashboard} />

          {/* ───── Dev previews ───── */}
          <Route path="/__preview-layout" component={PreviewLayout} />

          {/* ───── 404 ───── */}
          <Route component={NotFound} />
        </Switch>
      </Suspense>
      </RouteErrorBoundary>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <CookieConsent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
