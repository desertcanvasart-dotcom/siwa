export interface Experience {
  id: string;
  title: string;
  destination: 'north-coast' | 'siwa-oasis';
  category: string;
  mood: string[];
  price: number;
  img: string;
  video?: string;
  type: 'image' | 'video';
  summary: string;
  description: string;
  duration: string;
  bestMonths: string[];
  coords: [number, number];
  slug: string;
}