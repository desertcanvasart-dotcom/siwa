import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <SEO
        title="404 — Page not found"
        description="The page you are looking for could not be found."
        path="/404"
      />
      <Nav />
      <main className="min-h-[70vh] flex items-center justify-center bg-cream px-6 md:px-12 lg:px-20 pt-32 pb-20">
        <div className="max-w-lg text-center">
          <p className="text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-5">
            404
          </p>
          <h1
            className="font-display font-normal leading-[1.2] text-navy mb-5"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
          >
            This page doesn't <em className="italic text-coastal">exist.</em>
          </h1>
          <p className="text-[0.88rem] text-ink-soft leading-[1.95] mb-10">
            The page you're looking for may have been moved or retired.
            You're welcome to start from the beginning.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/"
              className="text-[0.65rem] tracking-[0.2em] uppercase text-navy bg-gold px-10 py-4 hover:bg-gold-light transition-colors"
            >
              Back to Soléi
            </Link>
            <Link
              href="/enquire"
              className="text-[0.65rem] tracking-[0.2em] uppercase text-navy border border-sand px-10 py-4 hover:border-gold hover:text-gold transition-colors"
            >
              Begin your stay
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
