const SITE_URL = "https://soleitravel.com";

// JSON-LD Schema helpers

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Soléi",
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.png`,
    description:
      "Luxury travel experiences across Egypt's North Coast and Siwa Oasis. Curated resort stays, wellness retreats, and desert adventures.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "reservations",
      url: `${SITE_URL}/get-quote`,
    },
    areaServed: {
      "@type": "Place",
      name: "Egypt",
    },
    sameAs: [],
  };
}

export function hotelSchema(hotel: {
  name: string;
  description: string;
  path: string;
  image?: string;
  starRating?: number;
  priceRange?: string;
  address?: { locality: string; region: string };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: hotel.name,
    description: hotel.description,
    url: `${SITE_URL}${hotel.path}`,
    image: hotel.image ? `${SITE_URL}${hotel.image}` : undefined,
    starRating: hotel.starRating
      ? { "@type": "Rating", ratingValue: hotel.starRating }
      : undefined,
    priceRange: hotel.priceRange,
    address: hotel.address
      ? {
          "@type": "PostalAddress",
          addressLocality: hotel.address.locality,
          addressRegion: hotel.address.region,
          addressCountry: "EG",
        }
      : undefined,
  };
}

export function experienceSchema(exp: {
  name: string;
  description: string;
  path: string;
  image?: string;
  duration?: string;
  price?: string;
  location?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: exp.name,
    description: exp.description,
    url: `${SITE_URL}${exp.path}`,
    image: exp.image ? `${SITE_URL}${exp.image}` : undefined,
    touristType: "Wellness & Adventure Travelers",
    address: exp.location
      ? {
          "@type": "PostalAddress",
          addressLocality: exp.location,
          addressCountry: "EG",
        }
      : undefined,
  };
}

export function faqSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function breadcrumbSchema(
  items: Array<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
