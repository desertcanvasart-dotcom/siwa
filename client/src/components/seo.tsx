import { Helmet } from "react-helmet-async";

const SITE_URL = "https://soleitravel.com";
const DEFAULT_IMAGE = "/attached_assets/hero-image.jpg";
const SITE_NAME = "Soléi";

export interface SEOProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export function SEO({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  type = "website",
  jsonLd,
}: SEOProps) {
  const fullTitle = path === "/" ? title : `${title} | ${SITE_NAME}`;
  const canonicalUrl = `${SITE_URL}${path}`;
  const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return (
    <Helmet>
      {/* Basic */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* JSON-LD */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(
            Array.isArray(jsonLd) ? jsonLd : jsonLd,
            null,
            2
          )}
        </script>
      )}
    </Helmet>
  );
}
