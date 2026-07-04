import { Switch, Route, Redirect, useLocation, useParams } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, lazy, Suspense } from "react";
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

// Core
const Home = lazy(() => import("@/pages/home"));
const OurStory = lazy(() => import("@/pages/our-story"));
const TermsOfService = lazy(() => import("@/pages/terms-of-service"));
const Privacy = lazy(() => import("@/pages/privacy"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Destination hubs
const SiwaHub = lazy(() => import("@/pages/siwa-oasis"));
const SiwaAccommodation = lazy(
  () => import("@/pages/siwa-oasis-accommodation"),
);
const NorthCoastHub = lazy(() => import("@/pages/north-coast-hub"));
const NorthCoastAccommodation = lazy(
  () => import("@/pages/north-coast-accommodation"),
);
const HotelDetail = lazy(() => import("@/pages/hotel-detail"));

// Experience detail — unified template
const ExperienceDetail = lazy(() => import("@/pages/experience-detail"));
const TourDetail = lazy(() => import("@/pages/tour-detail"));
const JourneysPage = lazy(() => import("@/pages/journeys"));
const ReviewPage = lazy(() => import("@/pages/review"));
const PlanPage = lazy(() => import("@/pages/plan"));
const ChatPage = lazy(() => import("@/pages/chat"));

// Transportation
const SiwaTransportation = lazy(() => import("@/pages/siwa-transportation"));

// North Coast experiences archive
const NorthCoastExperiences = lazy(() => import("@/pages/north-coast-experiences"));

// North Coast transportation
const NorthCoastTransportation = lazy(() => import("@/pages/north-coast-transportation"));

// Experience archive
const NewExperiencesArchive = lazy(() => import("@/pages/NewExperiencesArchive"));

// Journal (new canonical) — reuses existing Blog page + post
const Blog = lazy(() => import("@/pages/blog"));
const BlogPostPage = lazy(() => import("@/pages/blog-post"));

// Contact / enquiry
const GetQuote = lazy(() => import("@/pages/get-quote"));
const Enquire = lazy(() => import("@/pages/enquire"));

// Admin + misc
const AdminLogin = lazy(() => import("@/pages/admin-login"));
const AdminDashboard = lazy(() => import("@/pages/admin-dashboard"));
const AdminHotelWizard = lazy(() => import("@/pages/admin-hotel-wizard"));
const AdminTourWizard = lazy(() => import("@/pages/admin-tour-wizard"));
const AdminBlogWizard = lazy(() => import("@/pages/admin-blog-wizard"));
const PageBuilderPage = lazy(() => import("@/pages/page-builder"));
const PremiumExperienceSingle = lazy(
  () => import("@/pages/premium-experience-single"),
);
const SiwaTravelTips = lazy(() => import("@/pages/siwa-travel-tips"));
const NorthCoastTravelTips = lazy(() => import("@/pages/north-coast-travel-tips"));
const SiwaFAQ = lazy(() => import("@/pages/siwa-faq"));
const NorthCoastFAQ = lazy(() => import("@/pages/north-coast-faq"));
const PreviewLayout = lazy(() => import("@/pages/__preview-layout"));

// Branded hub placeholder (used for sections not yet built)
const HubStub = lazy(() => import("@/pages/stubs/HubStub"));

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

function ScrollRestoration() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
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
      <AnchorClickHandler />
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
          <Route path="/siwa-oasis/transportation/:slug">
            <HubStub
              title="Siwa Transportation Route"
              subtitle="This transportation route page is being prepared."
              path="/siwa-oasis/transportation"
              backHref="/siwa-oasis/transportation"
              backLabel="Back to routes"
            />
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
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
