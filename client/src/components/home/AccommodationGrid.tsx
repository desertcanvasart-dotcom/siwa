import { useMemo } from "react";
import { Link } from "wouter";
import { useHotelsBySlug } from "@/lib/useHotelsBySlug";
import { resolvePrice, parseAmount } from "@/lib/price";
import adrereAmellalImage from "@assets/adrerre-amelal_1751755031600.jpg";
import taziryImage from "@assets/taziry-room-.jpg";
import soleiOldTownImage from "@assets/solei-old-town-heritage.png";
import vidaMarinaImage from "@assets/Vida Marina Resort Marassi _1758142322079.jpg";
import addressBeachImage from "@assets/Address beach Resort _1758144493080.jpg";
import casaCookImage from "@assets/Casa Cook North Coast _001_1758143858816.png";

type Hotel = {
  slug: string;
  name: string;
  location: string;
  desc: string;
  price: string;
  dest: "Siwa Oasis" | "North Coast";
  video?: boolean;
  image?: string;
  gradientClass: string;
  href: string;
};

const hotels: Hotel[] = [
  {
    slug: "adrere-amellal",
    name: "Adrere Amellal",
    location: "Siwa Oasis · Eco Lodge",
    desc: "Built from karsheef salt rock and palm wood. No electricity. No noise. Just the oasis as it has always been.",
    price: "€320 / night",
    dest: "Siwa Oasis",
    image: adrereAmellalImage,
    gradientClass:
      "bg-[linear-gradient(160deg,#1a3a52_0%,#0F2436_100%)]",
    href: "/siwa-oasis/accommodation/adrere-amellal",
  },
  {
    slug: "taziry-ecolodge",
    name: "Taziry Ecolodge",
    location: "Siwa Oasis · Boutique Lodge",
    desc: "Mud-brick villas overlooking the salt lake. Quiet mornings, warm evenings, the stars at night.",
    price: "€180 / night",
    dest: "Siwa Oasis",
    image: taziryImage,
    gradientClass:
      "bg-[linear-gradient(160deg,#0F2436_0%,#0d3040_100%)]",
    href: "/siwa-oasis/accommodation/taziry-ecolodge",
  },
  {
    slug: "solei-old-town",
    name: "Soléi Old Town",
    location: "Siwa Oasis · Heritage Stay",
    desc: "Stone walls, cool interiors, a rooftop that overlooks the shali fortress at dusk.",
    price: "€145 / night",
    dest: "Siwa Oasis",
    image: soleiOldTownImage,
    gradientClass:
      "bg-[linear-gradient(160deg,#162d3e_0%,#1a3a52_100%)]",
    href: "/siwa-oasis/accommodation/solei-old-town",
  },
  {
    slug: "vida-marina",
    name: "Vida Marina Resort Marassi",
    location: "North Coast · Resort",
    desc: "Mediterranean-facing. Clean lines, open sea, and enough space to feel genuinely alone.",
    price: "€210 / night",
    dest: "North Coast",
    image: vidaMarinaImage,
    gradientClass:
      "bg-[linear-gradient(160deg,#2F6F8F_0%,#1a4a6a_100%)]",
    href: "/north-coast/accommodation/vida-marina-resort-marassi",
  },
  {
    slug: "address-beach-resort-marassi",
    name: "Address Beach Resort",
    location: "North Coast · Luxury Resort",
    desc: "Refined, unhurried, positioned directly on the water. The coast at its most quiet.",
    price: "€290 / night",
    dest: "North Coast",
    image: addressBeachImage,
    gradientClass:
      "bg-[linear-gradient(160deg,#1a4a6a_0%,#0F2436_100%)]",
    href: "/north-coast/accommodation/address-beach-resort-marassi",
  },
  {
    slug: "casa-cook-north-coast",
    name: "Casa Cook North Coast",
    location: "North Coast · Boutique Resort",
    desc: "Bohemian, warm, designed for people who travel slowly. Every corner feels considered.",
    price: "€195 / night",
    dest: "North Coast",
    image: casaCookImage,
    gradientClass:
      "bg-[linear-gradient(160deg,#235570_0%,#2F6F8F_100%)]",
    href: "/north-coast/accommodation/casa-cook-north-coast",
  },
];

/**
 * AccommodationGrid — 3-col card grid on cream.
 * First Siwa card uses the salt-lake video as its thumbnail; the rest
 * fall back to gradient + textile texture.
 */
export function AccommodationGrid() {
  const overlays = useHotelsBySlug();
  const overlayedHotels = useMemo(
    () =>
      // Drop any hotel the API no longer publishes (drafted in the dashboard).
      hotels
        .filter((h) => overlays.has(h.slug))
        .map((h) => {
        const o = overlays.get(h.slug);
        if (!o) return h;
        // One shared resolver so the card can't disagree with the
        // property page (it used to print the raw admin text, giving
        // "From From $620 / night" and "$70" against the page's "€70").
        const resolved = resolvePrice({
          pricePerNight: o.pricePerNight,
          rooms: o.details?.rooms,
          fallbackAmount: parseAmount(h.price),
          fallbackLabel: "/ night",
        });
        return {
          ...h,
          name: o.name || h.name,
          desc: o.blurb || h.desc,
          price: resolved.display || h.price,
          image: o.imageUrl || h.image,
        };
      }),
    [overlays],
  );
  return (
    <section className="bg-cream px-6 md:px-12 lg:px-20 py-32">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <p className="reveal flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-4">
              <span className="block w-6 h-px bg-gold opacity-50" />
              Where you stay
            </p>
            <h2
              className="reveal font-display font-normal text-navy leading-[1.2]"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
            >
              Curated <em className="italic text-coastal">accommodation</em>
            </h2>
          </div>
          <Link
            href="/siwa-oasis/accommodation"
            className="reveal text-[0.6rem] tracking-[0.2em] uppercase text-navy opacity-40 hover:opacity-100 transition-opacity inline-flex items-center gap-2"
          >
            View all properties →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2px]">
          {overlayedHotels.map((h, i) => (
            <Link
              key={h.slug}
              href={h.href}
              className={`reveal reveal-d${(i % 3) + 1} bg-white border border-sand hover:border-gold transition-colors duration-300 block group overflow-hidden`}
            >
              <div
                className={`relative h-[210px] overflow-hidden ${h.gradientClass}`}
              >
                {h.video && (
                  <video
                    className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-500"
                    src="/videos/salt-lake.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                )}
                {h.image && (
                  <img
                    src={h.image}
                    alt={h.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 textile-bg--strong z-[1]" />
                <span className="absolute top-4 left-4 z-[2] text-[0.54rem] tracking-[0.2em] uppercase text-gold bg-navy-deep/70 backdrop-blur-sm px-3 py-1">
                  {h.dest}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-[1.05rem] font-normal text-navy leading-[1.3] mb-1">
                  {h.name}
                </h3>
                <p className="text-[0.68rem] tracking-wider text-ink-soft/60 uppercase mb-3">
                  {h.location}
                </p>
                <p className="text-[0.8rem] text-ink-soft leading-[1.8] mb-4">
                  {h.desc}
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-sand-light">
                  <div>
                    <p className="text-[0.68rem] text-ink-soft/60">From</p>
                    <p className="font-display text-[1.05rem] text-navy">
                      {h.price}
                    </p>
                  </div>
                  <span className="text-[0.58rem] tracking-[0.16em] uppercase text-gold">
                    {h.dest === "Siwa Oasis" ? "Book →" : "Enquire →"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AccommodationGrid;
