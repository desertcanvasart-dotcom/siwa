import type { ExperienceSlug } from "./experience-data";

export type BlogDestination = "siwa" | "north-coast";
export type BlogArticleType = "guide" | "experience";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: "Siwa" | "North Coast" | "Wellness" | "Culture" | "Travel Tips";
  coverImage: string;
  author: string;
  publishedAt: string;
  readTime: number;
  featured?: boolean;
  tags: string[];
  /**
   * Destination grouping for the Journal index grid and the filter bar.
   * Articles without a destination show under "All" but not under Siwa /
   * North Coast — they are treated as destination-agnostic pieces.
   */
  destination?: BlogDestination;
  /**
   * Article type for the Guides / Experiences filter. Guides are
   * practical or overview pieces; Experience articles link editorial
   * content to a specific bookable Soléi experience.
   */
  articleType?: BlogArticleType;
  /**
   * Optional linked experience slug. When set, the article renders an
   * inline CTA block that deep-links to `/:destination/experiences/<slug>`.
   */
  linkedExperience?: ExperienceSlug;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "why-siwa-oasis-should-be-your-next-escape",
    title: "Why Siwa Oasis Should Be Your Next Escape",
    excerpt:
      "Tucked away in Egypt's Western Desert, Siwa Oasis is a world apart — a place where ancient traditions, healing springs, and endless starlit skies create the ultimate digital detox.",
    content: [
      "There are places you visit, and then there are places that quietly rearrange something inside you. Siwa Oasis is the latter. Tucked away in Egypt's Western Desert, some 750 kilometres from Cairo, this ancient settlement feels like it belongs to another era entirely — one where time moves with the sun and silence is something you can actually hear.",
      "Siwa has been inhabited for thousands of years. Alexander the Great made the gruelling desert crossing to consult the Oracle of Amun here in 331 BC, and the ruins of the temple still stand on a rocky outcrop overlooking the town. The crumbling medieval fortress of Shali, built from kershef — a local mixture of salt rock and clay — dominates the skyline, its honey-coloured walls glowing gold at sunset.",
      "But Siwa is far more than its history. The oasis is home to over 200 freshwater springs and vast salt lakes whose mineral-rich waters are said to have therapeutic properties. Floating in one of these lakes at golden hour, weightless and warm, with nothing but dunes on the horizon, is the kind of experience that stays with you long after you leave.",
      "Accommodation in Siwa ranges from simple guesthouses to extraordinary eco-lodges built from local materials. Adrère Amellal, constructed entirely from salt blocks and lit only by candlelight, is regularly cited as one of the most unique hotels in the world. Newer properties like Taziry Eco-Lodge run entirely on solar power, while heritage stays like Soléi Old Town offer handcrafted clay rooms in the historic centre.",
      "Getting to Siwa takes effort — there are no commercial flights, and the drive from Cairo is a solid nine hours. But that remoteness is precisely the point. In a world of constant connectivity, Siwa offers something increasingly rare: genuine stillness. Your phone signal fades somewhere past Marsa Matrouh, and with it goes the noise.",
      "The best time to visit is between October and April, when daytime temperatures hover around a pleasant 25°C. Summer months can push past 45°C, making outdoor exploration uncomfortable. If you time your visit right, you might catch the annual Siwan festival of reconciliation, a tradition that has brought the community together for centuries.",
      "Whether you come for the history, the healing waters, the star-filled skies, or simply to disconnect, Siwa has a way of giving you exactly what you need — even if you didn't know you needed it.",
    ],
    category: "Siwa",
    coverImage: "/attached_assets/siwa-shali-resort-.jpg",
    author: "Soléi Editorial",
    publishedAt: "2026-03-10",
    readTime: 5,
    featured: true,
    tags: ["Siwa", "Desert", "Eco-Travel", "Wellness"],
    destination: "siwa",
    articleType: "guide",
  },
  {
    slug: "ultimate-guide-to-egypts-north-coast",
    title: "The Ultimate Guide to Egypt's North Coast",
    excerpt:
      "From the turquoise lagoons of Marassi to the historic shores of Al Alamein, Egypt's Mediterranean coastline is redefining luxury beach travel. Here's everything you need to know.",
    content: [
      "Egypt's North Coast stretches along the Mediterranean from Alexandria westward to the Libyan border, and over the past decade it has transformed from a quiet summer retreat for Cairene families into one of the region's most exciting luxury destinations.",
      "The stretch between Al Alamein and Ras El Hekma — roughly 200 kilometres of coastline — is where the action is. Here, master-planned resort communities like Marassi, Hacienda Bay, and Almaza Bay have created self-contained worlds of private beaches, championship golf courses, marinas, and world-class dining.",
      "The water is the first thing that strikes you. The Mediterranean here is an almost Caribbean shade of turquoise, with white-sand beaches that rival anything in Southern Europe. The season runs from May through October, with peak months in July and August when temperatures sit comfortably in the low 30s and the sea is warm enough for long evening swims.",
      "For accommodation, the North Coast now offers genuine five-star options. The Address Beach Resort Marassi brings Dubai-level luxury to the Egyptian coast. Rixos Premium Alamein operates on an all-inclusive model with multiple restaurants and a private beach club. Casa Cook offers minimalist, design-led rooms for travellers who prefer style over spectacle.",
      "Beyond the resorts, the area carries real historical weight. Al Alamein was the site of one of World War II's most decisive battles, and the excellent war museum tells the story with sensitivity and detail. Further west, the small fishing town of Marsa Matrouh offers a glimpse of North Coast life before the developers arrived.",
      "Getting there is straightforward — the new Al Alamein International Airport receives domestic flights from Cairo, and the coastal highway from Alexandria is a smooth two-hour drive. Most resorts offer shuttle services from both entry points.",
      "The North Coast is no longer Egypt's best-kept secret, but with hundreds of kilometres of coastline still being developed, there's plenty of room to find your own stretch of paradise.",
    ],
    category: "North Coast",
    coverImage: "/attached_assets/Hotel-Beach.jpeg (1)_1751327157755.webp",
    author: "Soléi Editorial",
    publishedAt: "2026-03-05",
    readTime: 5,
    featured: true,
    tags: ["North Coast", "Beach", "Luxury", "Resorts"],
    destination: "north-coast",
    articleType: "guide",
  },
  {
    slug: "healing-waters-of-siwa-salt-lake-therapy",
    title: "The Healing Waters of Siwa: A Guide to Salt Lake Therapy",
    excerpt:
      "For centuries, Siwans have known what science is now confirming — the mineral-rich salt lakes of this remote oasis offer genuine therapeutic benefits for body and mind.",
    content: [
      "The salt lakes of Siwa Oasis are not ordinary bodies of water. With salinity levels that rival the Dead Sea, these striking turquoise pools allow you to float effortlessly on the surface, weightless and still, while minerals absorb through your skin.",
      "The largest and most accessible is Birket Siwa, a vast lake that shimmers white and blue against the desert. Smaller therapeutic pools, some heated naturally by underground springs, are scattered across the oasis and often attached to eco-lodges. Adrère Amellal's private salt lake is perhaps the most beautiful — a mirror-still pool surrounded by nothing but dunes and sky.",
      "The therapeutic claims are not just folklore. The lakes contain high concentrations of sodium chloride, magnesium, potassium, and trace minerals. Studies have shown that salt water immersion can reduce inflammation, improve skin conditions like psoriasis and eczema, ease joint pain, and promote deep relaxation through magnesium absorption.",
      "A typical float therapy session lasts around 90 minutes. You enter the water slowly — the salt concentration makes it denser than your body, so you rise to the surface naturally. Most people float on their backs, arms outstretched, eyes closed. The sensation is strange at first, almost disconcerting, but within minutes the body surrenders to it. Your muscles release tension you didn't know you were holding.",
      "The best time for a float is late afternoon, when the desert light turns golden and the water takes on an almost supernatural glow. Some lodges offer guided sessions with breathwork or meditation, though many travellers prefer to float in silence, letting the landscape do the work.",
      "A few practical notes: don't shave for at least 24 hours before floating (the salt will sting), bring sunglasses for the glare, and rinse off in fresh water afterwards. The salt dries to a fine white crust on your skin that feels oddly satisfying — proof that the minerals have done their work.",
      "Whether you approach it as wellness, therapy, or simply one of the most unusual experiences available in Egypt, floating in Siwa's salt lakes is something that stays with you. The combination of silence, weightlessness, and vast open sky creates a meditative state that no spa treatment can replicate.",
    ],
    category: "Wellness",
    coverImage: "/attached_assets/salt-lake_1752975614632.jpg",
    author: "Soléi Editorial",
    publishedAt: "2026-02-25",
    readTime: 5,
    tags: ["Wellness", "Salt Lakes", "Siwa", "Therapy"],
    destination: "siwa",
    articleType: "experience",
    linkedExperience: "salt-lake-float-therapy",
  },
  {
    slug: "siwan-culture-traditions-you-should-know",
    title: "Siwan Culture: Traditions Every Visitor Should Know",
    excerpt:
      "Siwa's Amazigh community has preserved a distinct culture for millennia — from their own language to unique customs around hospitality, dress, and celebration.",
    content: [
      "Siwa is not just geographically remote — it is culturally distinct from the rest of Egypt in ways that surprise and delight visitors who take the time to understand. The Siwan people are Amazigh (Berber), with their own language, customs, and traditions that have survived centuries of relative isolation.",
      "The Siwan language, Siwi, is an Eastern Berber tongue unrelated to Arabic. While most Siwans now speak Egyptian Arabic for commerce and communication with outsiders, Siwi remains the language of home, family, and tradition. Hearing it spoken in the marketplace — rapid, melodic, and entirely distinct from anything else in Egypt — is a reminder of just how unique this community is.",
      "Hospitality in Siwa follows its own codes. When invited into a Siwan home, you may be offered dates and tea as a welcome gesture — accepting is both polite and expected. Meals are typically communal, served on large shared platters, and eaten by hand or with bread. The food itself is distinctive: tagines slow-cooked in clay pots, bread baked in underground sand ovens, and a local speciality of dried meat preserved with salt from the lakes.",
      "Dress is another marker of Siwan identity. Women traditionally wear elaborately embroidered garments and heavy silver jewellery, though this is seen less frequently in daily life now. Wedding celebrations, however, remain spectacular multi-day affairs where traditional dress, music, and dance are displayed in full. If you're fortunate enough to witness even part of a Siwan wedding, the colour and energy are unforgettable.",
      "The annual Festival of Reconciliation, held around the October full moon at the foot of Jebel Dakrour, is Siwa's most important cultural event. For three days, the community gathers to resolve disputes, share meals, and reaffirm social bonds. Outsiders are welcome to observe, and the atmosphere of collective forgiveness and celebration is deeply moving.",
      "As a visitor, a few courtesies go a long way. Dress modestly, particularly women — Siwa is conservative by Egyptian standards. Ask permission before photographing people. Learn a few words of Siwi (\"azul\" for hello goes a long way). And approach the culture with genuine curiosity rather than as a spectacle to be consumed.",
      "Siwa's traditions are not museum pieces — they are living practices that shape daily life. Understanding them, even partially, transforms a visit from tourism into something closer to genuine cultural exchange.",
    ],
    category: "Culture",
    coverImage: "/attached_assets/Siwa Oracle Temple_1751926882739.jpg",
    author: "Soléi Editorial",
    publishedAt: "2026-02-15",
    readTime: 6,
    tags: ["Culture", "Siwa", "Amazigh", "Traditions"],
    destination: "siwa",
    articleType: "guide",
  },
  {
    slug: "packing-for-the-desert-what-to-bring-to-siwa",
    title: "Packing for the Desert: What to Bring to Siwa",
    excerpt:
      "Siwa's remote location and desert climate mean packing smart is essential. Here's our tried-and-tested list for a comfortable oasis stay.",
    content: [
      "Packing for Siwa requires a slightly different mindset than packing for a typical holiday. The oasis sits in the middle of the Western Desert, the nearest sizeable town is hours away, and while eco-lodges provide the essentials, there are items you'll wish you'd brought if you forget them.",
      "Start with clothing. During the peak season (October to April), days are warm (20-28°C) but evenings can drop sharply, sometimes to single digits. Layers are essential: lightweight linen or cotton for daytime, a warm fleece or light down jacket for after sunset. A scarf or shawl serves triple duty — sun protection, warmth, and modest coverage when visiting local areas. Siwa is conservative, so pack clothing that covers shoulders and knees, especially for women.",
      "Sun protection is non-negotiable. The desert sun is intense and largely unobstructed. Bring a high-SPF sunscreen (50+), a wide-brimmed hat, and quality sunglasses with UV protection. Lip balm with SPF is easily forgotten and sorely missed. If you plan to float in the salt lakes, a rash guard or UV-protective swim shirt will save your shoulders.",
      "Footwear depends on your planned activities. Comfortable sandals work for the town and eco-lodges, but if you're doing any desert excursions — dune surfing, stargazing trips, temple visits — bring closed-toe shoes that can handle sand. Hiking sandals with ankle straps are a good compromise.",
      "Electronics require thought. Phone signal is limited in Siwa, and some lodges (notably Adrère Amellal) have no electricity at all. Bring a portable power bank, a headlamp or small torch for candlelit lodges, and consider downloading maps and entertainment offline before you arrive. A camera with good low-light capability is worth its weight in gold for stargazing nights.",
      "Health essentials: bring any prescription medications you need, as pharmacies in Siwa are basic. A small first-aid kit with plasters, antiseptic, and anti-diarrheal medication is sensible. Insect repellent is useful in spring and autumn when mosquitoes are active near the springs. If you're prone to dry skin, bring a good moisturiser — the desert air will dehydrate your skin quickly.",
      "Finally, bring cash. ATMs exist in Siwa but are unreliable, and many eco-lodges, restaurants, and experience operators deal in cash only. Egyptian pounds are essential; USD or EUR can sometimes be exchanged but not relied upon. Bring more than you think you'll need — running out of cash in the desert is not a situation you want to experience.",
    ],
    category: "Travel Tips",
    coverImage: "/attached_assets/Great_Sand_Sea_Adventures_1764706599725.PNG",
    author: "Soléi Editorial",
    publishedAt: "2026-02-08",
    readTime: 5,
    tags: ["Travel Tips", "Packing", "Siwa", "Desert"],
    destination: "siwa",
    articleType: "guide",
  },
  {
    slug: "stargazing-in-siwa-guide-to-desert-night-sky",
    title: "Stargazing in Siwa: A Guide to the Desert Night Sky",
    excerpt:
      "With virtually zero light pollution, Siwa offers some of the darkest skies in North Africa. Here's how to make the most of a night under the stars.",
    content: [
      "There is a moment, about an hour after sunset in the desert outside Siwa, when the sky does something extraordinary. The last traces of twilight fade, and what replaces them is not simply darkness — it is a dome of stars so dense, so vivid, that it fundamentally changes your understanding of the night sky.",
      "Siwa's position in the Western Desert, far from any major city, gives it a Bortle scale rating of 1-2, making it one of the darkest places in North Africa. The Milky Way is not a faint smudge here — it is a blazing river of light that stretches from horizon to horizon, its structure clearly visible to the naked eye.",
      "The best stargazing months are October through March, when the air is cool and dry, reducing atmospheric distortion. The period around the new moon is ideal, though even a crescent moon in Siwa's clear air produces enough light to cast shadows on the dunes.",
      "Several eco-lodges and experience operators offer guided stargazing sessions. These typically involve a short drive into the desert, away from even Siwa's minimal lights, where telescopes are set up on the sand. A good guide will walk you through the major constellations, point out planets, and share the mythology — both Greek and Siwan — behind the patterns overhead.",
      "For astrophotography, bring a camera with manual exposure control and a sturdy tripod. Wide-angle lenses (14-24mm) work best for capturing the full sweep of the Milky Way. Exposure settings of 15-25 seconds at high ISO (3200-6400) with a wide aperture (f/2.8 or lower) will reveal detail invisible to the naked eye. A remote shutter release prevents camera shake.",
      "Even without a telescope or camera, simply lying on a blanket in the desert and watching the sky is one of Siwa's most profound experiences. Shooting stars are common — the Perseids in August and the Geminids in December put on particularly good shows. Satellites trace their silent paths, and on very clear nights, you might catch the faint glow of the zodiacal light on the horizon.",
      "The desert sky has been a source of wonder and navigation for millennia — the ancient Egyptians aligned their temples and pyramids with specific stars. In Siwa, far from the artificial glow of modern life, you experience what they experienced: the universe in its full, humbling immensity.",
    ],
    category: "Siwa",
    coverImage: "/attached_assets/stargazing_1752963245806.jpg",
    author: "Soléi Editorial",
    publishedAt: "2026-01-28",
    readTime: 5,
    tags: ["Stargazing", "Siwa", "Desert", "Astronomy"],
    destination: "siwa",
    articleType: "experience",
    linkedExperience: "desert-stargazing-experience",
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter((post) => post.featured);
}

export function getPostsByCategory(category: BlogPost["category"]): BlogPost[] {
  return blogPosts.filter((post) => post.category === category);
}

export const blogCategories: BlogPost["category"][] = [
  "Siwa",
  "North Coast",
  "Wellness",
  "Culture",
  "Travel Tips",
];
