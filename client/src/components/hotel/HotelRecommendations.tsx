import { useMemo } from "react";
import { SmartLink } from "@/components/ui/SmartLink";
import { useSiteContent, pickContent } from "@/lib/useSiteContent";
import { useHotelsBySlug } from "@/lib/useHotelsBySlug";
import { useExperiencesRaw } from "@/lib/useExperiencesRaw";
import { buildRecCards, recPrefix, type RecCard, type RecDestination } from "@/lib/recommendations";

const STAR_TEX =
  "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23B89A5B' fill-opacity='0.07'%3E%3Cpath d='M20 0L21 5L20 4L19 5ZM0 20L5 21L4 20L5 19ZM40 20L35 21L36 20L35 19ZM20 40L21 35L20 36L19 35Z'/%3E%3C/g%3E%3C/svg%3E\")";

/**
 * Bottom-of-page recommendations on hotel detail pages. Content and
 * cards are set per destination in the admin; see lib/recommendations.
 * The layout follows the number of cards (1 = one wide feature card).
 */
export function HotelRecommendations({
  currentSlug,
  destination,
  relatedSlugs,
  gradient,
}: {
  currentSlug: string;
  destination: RecDestination;
  relatedSlugs: string[];
  /** Panel colour behind cards without a photo. */
  gradient: string;
}) {
  const c = useSiteContent();
  const hotelsMap = useHotelsBySlug();
  const { data: experiences } = useExperiencesRaw();
  const p = recPrefix(destination);
  const isSiwa = destination === "siwa";

  const viewAll = pickContent(c, `${p}.view_all`, "View all →");
  const viewAllHref = pickContent(
    c,
    `${p}.view_all_href`,
    isSiwa ? "/siwa-oasis/accommodation" : "/north-coast/accommodation",
  );

  const cards = useMemo(
    () =>
      buildRecCards({
        slots: c[`${p}.cards`],
        currentSlug,
        destination,
        relatedSlugs,
        hotelsMap,
        experiences,
      }),
    [c, p, currentSlug, destination, relatedSlugs, hotelsMap, experiences],
  );

  // Default heading follows what's in the block: "Other Siwa properties"
  // when it's all hotels, "More from Siwa" once experiences or custom
  // cards are mixed in. An admin-set heading always wins.
  const allHotels = cards.every((card) => card.key.startsWith("hotel:"));
  const title = pickContent(
    c,
    `${p}.title`,
    allHotels ? (isSiwa ? "Other Siwa" : "Other coastal") : "More from",
  );
  const italic = pickContent(
    c,
    `${p}.italic`,
    allHotels ? "properties" : isSiwa ? "Siwa" : "the coast",
  );

  // "-" as the title hides the block; so does having nothing to show.
  if (title.trim() === "-" || cards.length === 0) return null;

  const grid =
    cards.length === 1
      ? "grid-cols-1"
      : cards.length === 2
        ? "grid-cols-1 md:grid-cols-2"
        : cards.length === 3
          ? "grid-cols-1 md:grid-cols-3"
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";

  return (
    <section className="bg-sand-light px-6 md:px-12 lg:px-20 py-20">
      <div className="max-w-5xl mx-auto">
        <div className="reveal flex flex-col md:flex-row justify-between items-start md:items-end gap-3 mb-10">
          <h2
            className="font-display font-normal text-navy leading-[1.2]"
            style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)" }}
          >
            {title} {italic && <em className="italic text-coastal">{italic}</em>}
          </h2>
          {viewAll && viewAllHref && (
            <SmartLink
              href={viewAllHref}
              className="text-[0.6rem] tracking-[0.2em] uppercase text-navy opacity-35 hover:opacity-100 transition-opacity inline-flex items-center gap-2"
            >
              {viewAll}
            </SmartLink>
          )}
        </div>
        <div className={`grid ${grid} gap-[2px]`}>
          {cards.map((card, i) => (
            <RecCardView key={card.key} card={card} index={i} wide={cards.length === 1} gradient={gradient} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RecCardView({
  card,
  index,
  wide,
  gradient,
}: {
  card: RecCard;
  index: number;
  wide: boolean;
  gradient: string;
}) {
  const className = `reveal ${index > 0 ? `reveal-d${Math.min(index, 3)}` : ""} group bg-white border border-sand hover:border-gold transition-colors block overflow-hidden ${
    wide ? "md:grid md:grid-cols-2" : ""
  }`;
  const body = (
    <>
      <div className={`relative overflow-hidden ${wide ? "h-[200px] md:h-auto md:min-h-[240px]" : "h-[160px]"} ${gradient}`}>
        {card.image ? (
          <img
            src={card.image}
            alt={card.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0" style={{ backgroundImage: STAR_TEX }} />
        )}
      </div>
      <div className={wide ? "p-7 md:p-10 flex flex-col justify-center" : "p-5"}>
        <h3 className={`font-display text-navy leading-tight mb-1 ${wide ? "text-[1.3rem]" : "text-[0.95rem]"}`}>
          {card.title}
        </h3>
        {card.subtitle && (
          <p className="text-[0.6rem] tracking-[0.1em] uppercase text-ink-soft/50 mb-3">{card.subtitle}</p>
        )}
        {card.price && (
          <p className={`font-display text-navy ${wide ? "text-[1rem]" : "text-[0.9rem]"}`}>
            {/^from\b/i.test(card.price) ? (
              <>
                <span className="font-body text-[0.6rem] text-ink-soft/45 mr-1">From</span>
                {card.price.replace(/^from\s*/i, "")}
              </>
            ) : (
              card.price
            )}
          </p>
        )}
        {wide && card.href && (
          <span className="mt-5 text-[0.58rem] tracking-[0.2em] uppercase text-gold group-hover:text-navy transition-colors">
            Discover →
          </span>
        )}
      </div>
    </>
  );
  if (!card.href) return <div className={className}>{body}</div>;
  return (
    <SmartLink href={card.href} className={className}>
      {body}
    </SmartLink>
  );
}
