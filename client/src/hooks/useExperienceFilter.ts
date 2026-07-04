import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Fuse from "fuse.js";

interface FilterState {
  destination: string;
  category: string;
  mood: string;
  priceRange: [number, number];
  search: string;
}

interface Experience {
  id: string;
  title: string;
  destination: string;
  category: string;
  mood: string[];
  price: number;
  img: string;
  video?: string;
  type: string;
  summary: string;
  description: string;
  duration: string;
  bestMonths: string[];
  coords: [number, number];
  slug: string;
}

export function useExperienceFilter() {
  const [filters, setFilters] = useState<FilterState>({
    destination: 'all',
    category: 'all',
    mood: 'all',
    priceRange: [0, 500],
    search: ''
  });

  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);

  // Fetch experiences from API and transform to expected structure
  const { data: rawExperiencesData = [], isLoading } = useQuery<Experience[]>({
    queryKey: ['/api/experiences'],
    select: (data) => {
      if (!data || !Array.isArray(data)) return [];
      
      return data.map((apiExp: any) => {
        // Determine destination based on experience type or category
        const title = (apiExp.title || '').toLowerCase();
        const summary = (apiExp.summary || '').toLowerCase();
        const description = (apiExp.description || '').toLowerCase();
        const category = apiExp.category || '';
        
        const isNorthCoast = category === 'Water Sports' || 
                           category === 'Beach Club' ||
                           category === 'Nightlife' ||
                           title.includes('yacht') ||
                           title.includes('beach') ||
                           title.includes('coastal') ||
                           title.includes('marina') ||
                           title.includes('spa') ||
                           summary.includes('sea-inspired') ||
                           summary.includes('marina') ||
                           summary.includes('luxury marina') ||
                           description.includes('marina') ||
                           description.includes('sea') ||
                           description.includes('coastal');
        
        // Force specific experiences to correct destinations
        const isSiwaExperience = title.includes('sand-surfing') ||
                                title.includes('sand surfing') ||
                                category === 'Desert & Dunes' ||
                                category === 'Salt Lakes' ||
                                category === 'Culture & History' ||
                                category === 'Wellbeing' ||
                                title.includes('stargazing') ||
                                title.includes('oracle') ||
                                title.includes('cleopatra');
                           
        const destination = isSiwaExperience ? 'siwa' : (isNorthCoast ? 'north-coast' : 'siwa');
        
        // Convert price to number
        const price = typeof apiExp.pricePerPerson === 'string' 
          ? parseInt(apiExp.pricePerPerson) || 0
          : apiExp.pricePerPerson || 0;

        return {
          id: apiExp.id?.toString() || Math.random().toString(),
          title: apiExp.title || '',
          destination,
          category: apiExp.category || 'Other',
          mood: [], // Default empty array for mood
          price,
          img: apiExp.imageUrl || apiExp.videoUrl || '',
          video: apiExp.videoUrl,
          type: apiExp.mediaType || 'image',
          summary: apiExp.summary || '',
          description: apiExp.description || '',
          duration: apiExp.duration || '',
          bestMonths: [], // Default empty array for bestMonths
          coords: [0, 0] as [number, number], // Default coordinates
          slug: apiExp.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || ''
        } as Experience;
      });
    }
  });

  const experiencesData = rawExperiencesData;

  // Setup Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(experiencesData as Experience[], {
      keys: ['title', 'summary', 'description', 'category'],
      threshold: 0.3,
      includeScore: true
    });
  }, [experiencesData]);

  const filtered = useMemo(() => {
    if (!experiencesData.length) return [];
    let results = experiencesData as Experience[];

    // Apply search filter first
    if (filters.search.trim()) {
      const searchResults = fuse.search(filters.search);
      results = searchResults.map(result => result.item);
    }

    // Apply other filters
    results = results.filter((experience) => {
      // Destination filter
      if (filters.destination !== 'all' && experience.destination !== filters.destination) {
        return false;
      }

      // Category filter
      if (filters.category !== 'all' && experience.category !== filters.category) {
        return false;
      }

      // Mood filter
      if (filters.mood !== 'all' && !experience.mood.includes(filters.mood)) {
        return false;
      }

      // Price filter
      if (experience.price < filters.priceRange[0] || experience.price > filters.priceRange[1]) {
        return false;
      }

      // Season filter
      if (selectedSeason && !experience.bestMonths.includes(selectedSeason)) {
        return false;
      }

      return true;
    });

    return results;
  }, [filters, selectedSeason, fuse, experiencesData]);

  return {
    experiences: experiencesData as Experience[],
    filtered,
    filters,
    setFilters,
    selectedSeason,
    setSelectedSeason,
    isLoading
  };
}