import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, Star, Play, Heart, Share2, Camera, Droplets, Leaf, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Layout from '@/components/layout/layout';
import saltLakeVideo from '@assets/Salt Lake Float Therapy_1751926016176.mp4';
import floatingSpringImage from '@assets/floating-in-spring_1753576589836.jpeg';

export default function PremiumExperienceSingle() {
  const [selectedDate, setSelectedDate] = useState('');
  const [guests, setGuests] = useState(2);
  const [selectedTime, setSelectedTime] = useState('morning');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isBooking, setIsBooking] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBooking = async () => {
    if (!selectedDate) {
      toast({
        title: "Please select a date",
        description: "Choose your preferred date for the sacred experience.",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);
    
    // Simulate booking process
    try {
      // Here you would normally make an API call to book the experience
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Booking Confirmed! ✨",
        description: `Your Cleopatra Sacred Soak is confirmed for ${selectedDate} with ${guests} guest${guests > 1 ? 's' : ''}.`,
      });
      
      // Reset form
      setSelectedDate('');
      setGuests(2);
      setSelectedTime('morning');
      
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Something went wrong. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  const handleAddToWishlist = () => {
    toast({
      title: "Added to Wishlist ❤️",
      description: "Cleopatra Sacred Soak has been saved to your travel wishlist.",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Cleopatra Spring Sacred Soak - Soléi',
        text: 'Discover this amazing sacred spring experience in Siwa Oasis',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Experience link copied to clipboard for sharing.",
      });
    }
  };

  const handleAddToJourney = (experienceTitle: string) => {
    toast({
      title: "Added to Journey ✨",
      description: `${experienceTitle} has been added to your travel itinerary.`,
    });
  };

  const experience = {
    title: "Cleopatra Spring Sacred Soak",
    subtitle: "Ancient healing waters beneath the desert stars",
    duration: "90 minutes",
    price: 85,
    location: "Siwa Oasis Sacred Springs",
    rating: 4.9,
    reviews: 127,
    tags: [
      { name: "Wellness", icon: Sparkles, color: "bg-purple-100 text-purple-700" },
      { name: "Sacred", icon: Star, color: "bg-gold-100 text-gold-700" },
      { name: "Healing", icon: Droplets, color: "bg-blue-100 text-blue-700" },
      { name: "Eco", icon: Leaf, color: "bg-green-100 text-green-700" }
    ],
    highlights: [
      "Natural mineral-rich spring waters",
      "Traditional purification ritual",
      "Expert wellness guide",
      "Herbal aromatherapy session",
      "Sunset timing available"
    ]
  };

  const journeySteps = [
    { step: "Welcome Ritual", duration: "10 min", description: "Traditional blessing and intention setting" },
    { step: "Sacred Walk", duration: "15 min", description: "Guided path through palm grove to springs" },
    { step: "Water Preparation", duration: "10 min", description: "Natural oils and minerals blessing" },
    { step: "Sacred Soak", duration: "45 min", description: "Mindful immersion in healing waters" },
    { step: "Integration", duration: "10 min", description: "Herbal tea and reflection time" }
  ];

  const testimonials = [
    {
      quote: "The most transformative 90 minutes of my entire Egypt journey. I emerged feeling completely renewed.",
      author: "Sarah Chen",
      location: "Singapore",
      rating: 5,
      verified: true
    },
    {
      quote: "Cleopatra herself couldn't have experienced anything more divine. Pure magic.",
      author: "Marcus Rodriguez", 
      location: "Barcelona",
      rating: 5,
      verified: true
    },
    {
      quote: "The healing properties of these waters are real. My chronic stress just melted away.",
      author: "Dr. Amelia Foster",
      location: "London",
      rating: 5,
      verified: true
    }
  ];

  const pairings = [
    {
      title: "Desert Breathwork Meditation",
      duration: "60 mins",
      price: 65,
      image: floatingSpringImage,
      description: "Complete your wellness journey"
    },
    {
      title: "Sacred Sand Bath Healing",
      duration: "75 mins", 
      price: 75,
      image: floatingSpringImage,
      description: "Ancient therapeutic practice"
    },
    {
      title: "Oracle Temple Pilgrimage",
      duration: "120 mins",
      price: 95,
      image: floatingSpringImage,
      description: "Spiritual discovery experience"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Cinematic Hero Section */}
        <section className="relative h-screen overflow-hidden">
          <div className="absolute inset-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              onPlay={() => setIsVideoPlaying(true)}
            >
              <source src={saltLakeVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
          </div>

          {/* Hero Content */}
          <div className="absolute inset-0 flex items-end justify-center pb-32">
            <div className="text-center text-white max-w-4xl mx-auto px-6">
              <div className="mb-4">
                <Badge className="bg-white/20 text-white border-white/30 mb-4">
                  ✦ Sacred Spring Experience
                </Badge>
              </div>
              <h1 className="text-5xl md:text-7xl font-light mb-6 tracking-wide">
                {experience.title}
              </h1>
              <p className="text-xl md:text-2xl font-light mb-8 opacity-90">
                {experience.subtitle}
              </p>
              <div className="flex items-center justify-center gap-8 text-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{experience.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-light">from ${experience.price}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Hint */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80 animate-bounce">
            <div className="text-center">
              <p className="text-sm mb-2">Discover the Experience</p>
              <div className="w-6 h-10 border border-white/40 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content with Floating Booking Panel */}
        <div className="relative">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* Main Content Column */}
              <div className="lg:col-span-2 space-y-16">
                
                {/* Experience Overview */}
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{experience.rating}</span>
                      <span className="text-gray-600">({experience.reviews} reviews)</span>
                    </div>
                    <Separator orientation="vertical" className="h-6" />
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{experience.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {experience.tags.map((tag, index) => {
                      const IconComponent = tag.icon;
                      return (
                        <Badge key={index} className={`${tag.color} border-0 px-3 py-1`}>
                          <IconComponent className="w-4 h-4 mr-1" />
                          {tag.name}
                        </Badge>
                      );
                    })}
                  </div>
                </section>

                {/* Storytelling Block */}
                <section className="prose prose-lg max-w-none">
                  <h2 className="text-3xl font-light mb-6">Your Oasis Within the Oasis</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <p className="text-gray-700 leading-relaxed mb-6">
                        Legend whispers that Queen Cleopatra herself discovered these sacred springs, 
                        drawn by their legendary healing powers. Today, these same mineral-rich waters 
                        offer a portal to ancient wellness wisdom, where time dissolves and renewal begins.
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        Nestled among fragrant date palms in Siwa's most protected sanctuary, 
                        this intimate experience honors both the sacred feminine and the desert's 
                        profound capacity for transformation.
                      </p>
                    </div>
                    <div className="relative">
                      <img
                        src={floatingSpringImage}
                        alt="Sacred spring sanctuary"
                        className="rounded-lg shadow-lg w-full h-64 object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
                    </div>
                  </div>

                  <blockquote className="border-l-4 border-gold-500 pl-6 my-8 italic text-xl text-gray-700">
                    "The waters hold memory. They remember every prayer, every healing, 
                    every moment of surrender. You become part of that eternal story."
                    <footer className="text-base not-italic mt-2 text-gray-600">
                      — Fatima Al-Siwi, Wellness Guide & Spring Keeper
                    </footer>
                  </blockquote>
                </section>

                {/* What to Expect */}
                <section>
                  <h2 className="text-3xl font-light mb-8">Your Sacred Journey</h2>
                  
                  <div className="space-y-6">
                    {journeySteps.map((step, index) => (
                      <div key={index} className="flex gap-6 p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center gap-4 mb-2">
                            <h3 className="text-xl font-medium">{step.step}</h3>
                            <Badge variant="outline" className="text-sm">
                              {step.duration}
                            </Badge>
                          </div>
                          <p className="text-gray-600">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold mb-4">What's Included</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {experience.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-700">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Location & Map */}
                <section>
                  <h2 className="text-3xl font-light mb-8">Sacred Location</h2>
                  
                  <div className="bg-gray-100 rounded-lg p-8 text-center">
                    <MapPin className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Cleopatra Sacred Springs</h3>
                    <p className="text-gray-600 mb-4">
                      Located 3km from central Siwa, accessible by traditional cart or 4x4 vehicle
                    </p>
                    <div className="flex justify-center gap-4">
                      <Button variant="outline">
                        <Camera className="w-4 h-4 mr-2" />
                        View Photos
                      </Button>
                      <Button variant="outline">
                        <MapPin className="w-4 h-4 mr-2" />
                        Get Directions
                      </Button>
                    </div>
                  </div>
                </section>

                {/* Guest Testimonials */}
                <section>
                  <h2 className="text-3xl font-light mb-8">Guest Stories</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                      <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-1 mb-4">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <blockquote className="text-gray-700 mb-4 italic">
                            "{testimonial.quote}"
                          </blockquote>
                          <div className="text-sm">
                            <div className="font-semibold">{testimonial.author}</div>
                            <div className="text-gray-600">{testimonial.location}</div>
                            {testimonial.verified && (
                              <div className="text-green-600 text-xs mt-1">✓ Verified Guest</div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* Suggested Pairings */}
                <section>
                  <h2 className="text-3xl font-light mb-8">Other Guests Also Loved</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {pairings.map((pairing, index) => (
                      <Card key={index} className="hover:shadow-lg transition-shadow group cursor-pointer">
                        <div className="relative">
                          <img
                            src={pairing.image}
                            alt={pairing.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          <div className="absolute bottom-4 left-4 text-white">
                            <div className="text-lg font-semibold">${pairing.price}</div>
                            <div className="text-sm opacity-90">{pairing.duration}</div>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">{pairing.title}</h3>
                          <p className="text-gray-600 text-sm mb-3">{pairing.description}</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleAddToJourney(pairing.title)}
                          >
                            Add to Journey
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              </div>

              {/* Floating Booking Panel */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24 shadow-xl border-0 bg-white">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="text-3xl font-light mb-2">${experience.price}</div>
                      <div className="text-gray-600">per person</div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Select Date</label>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Guests</label>
                        <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                          <span>Adults</span>
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setGuests(Math.max(1, guests - 1))}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center">{guests}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setGuests(Math.min(6, guests + 1))}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Preferred Time</label>
                        <select 
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="morning">Morning Session (9:00 AM)</option>
                          <option value="afternoon">Afternoon Session (2:00 PM)</option>
                          <option value="sunset">Sunset Session (5:30 PM)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button 
                        onClick={handleBooking}
                        disabled={isBooking}
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3"
                      >
                        {isBooking ? "Confirming..." : "Book Sacred Experience"}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={handleAddToWishlist}
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Add to Wishlist
                      </Button>
                    </div>

                    <div className="flex justify-center gap-4 mt-6 pt-6 border-t">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleShare}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="ghost" size="sm">
                        Questions?
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Bottom CTA (Mobile) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">${experience.price} / person</div>
              <div className="text-sm text-gray-600">{experience.duration}</div>
            </div>
            <Button 
              onClick={handleBooking}
              disabled={isBooking}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
            >
              {isBooking ? "Booking..." : "Book Now"}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}