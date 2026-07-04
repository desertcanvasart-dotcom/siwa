import { useState } from 'react';
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, CalendarIcon, Phone, Mail, MapPin, Users, Star, Heart } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Layout from '@/components/layout/layout';
import { apiRequest } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';

const quoteFormSchema = z.object({
  fullName: z.string().min(2, "Please provide your full name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  contactMethod: z.string().min(1, "Please select your preferred contact method"),
  dateFrom: z.string().min(1, "Please select your travel start date"),
  dateTo: z.string().min(1, "Please select your travel end date"),
  destinations: z.string().min(2, "Please specify your desired destination(s)"),
  experienceType: z.array(z.string()).min(1, "Please select at least one experience type"),
  numberOfTravelers: z.string().min(1, "Please specify the number of travelers"),
  accommodationPreference: z.array(z.string()).min(1, "Please select your accommodation preference"),
  specialRequests: z.string().optional(),
  budget: z.string().optional(),
  agreement: z.boolean().refine(val => val === true, "Please agree to the terms and conditions")
});

type QuoteFormData = z.infer<typeof quoteFormSchema>;

const experienceTypes = [
  "Private Tour",
  "Nile Cruise", 
  "Desert Safari",
  "Resort Stay (All-Inclusive)",
  "Cultural & Heritage Exploration",
  "Wellness & Spa Retreat",
  "Other"
];

const accommodationTypes = [
  "Luxury Hotels (5-star)",
  "Boutique Hotels",
  "Private Villas", 
  "Luxury Cruises",
  "All-Inclusive Resorts"
];

const travelerCounts = ["1", "2", "3", "4", "5", "6+"];
const contactMethods = ["Email", "Phone Call", "WhatsApp", "Other"];

export default function GetQuote() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([]);
  const [selectedAccommodation, setSelectedAccommodation] = useState<string[]>([]);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      experienceType: [],
      accommodationPreference: [],
      agreement: false
    }
  });

  const submitQuoteMutation = useMutation({
    mutationFn: async (data: QuoteFormData) => {
      return apiRequest('POST', '/api/send-quote-request', data);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Quote Request Submitted!",
        description: "Thank you for your inquiry. A member of our team will contact you shortly to discuss your bespoke travel experience.",
      });
    },
    onError: () => {
      toast({
        title: "Submission Error",
        description: "There was an issue submitting your request. Please try again or contact us directly.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: QuoteFormData) => {
    submitQuoteMutation.mutate({
      ...data,
      experienceType: selectedExperiences,
      accommodationPreference: selectedAccommodation
    });
  };

  const handleExperienceChange = (experience: string, checked: boolean) => {
    const updated = checked 
      ? [...selectedExperiences, experience]
      : selectedExperiences.filter(e => e !== experience);
    setSelectedExperiences(updated);
    setValue('experienceType', updated);
  };

  const handleAccommodationChange = (accommodation: string, checked: boolean) => {
    const updated = checked 
      ? [...selectedAccommodation, accommodation]
      : selectedAccommodation.filter(a => a !== accommodation);
    setSelectedAccommodation(updated);
    setValue('accommodationPreference', updated);
  };

  if (isSubmitted) {
    return (
      <>
        <SEO
          title="Get a Quote - Custom Travel Itinerary Request"
          description="Submit a personalized travel inquiry specifying destinations, dates, party size, and preferences. Receive bespoke itinerary quotes from the Soléi travel team."
          path="/get-quote"
        />
        <Layout>
          <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center px-4">
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="mb-8">
              <div className="w-20 h-20 bg-travel-teal rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
                Thank You for Reaching Out
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                We understand that luxury is in the details, and we are excited to craft an extraordinary 
                travel experience just for you. A member of our dedicated team will contact you shortly 
                to discuss your bespoke travel experience.
              </p>
              <p className="text-lg text-gray-500">
                In the meantime, feel free to explore our curated destinations and experiences.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.location.href = '/experiences-new'}
                className="bg-travel-teal hover:bg-travel-navy text-white px-8 py-3"
                data-testid="button-explore-experiences"
              >
                Explore Experiences
              </Button>
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="px-8 py-3"
                data-testid="button-return-home"
              >
                Return Home
              </Button>
            </div>
          </div>
        </div>
      </Layout>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Get a Quote - Custom Travel Itinerary Request"
        description="Submit a personalized travel inquiry specifying destinations, dates, party size, and preferences. Receive bespoke itinerary quotes from the Soléi travel team."
        path="/get-quote"
      />
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-[35px]">
        {/* Hero Section */}
        <section className="py-20 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Star className="h-8 w-8 text-travel-teal mr-3" />
              <span className="text-travel-teal text-lg font-medium">Bespoke Luxury Travel</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-light text-gray-900 mb-8">
              Get Your Free Quote
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              To create a bespoke and luxurious travel experience tailored specifically to your needs, 
              please provide us with some details about your upcoming trip.
            </p>
          </div>
        </section>

        {/* Form Section */}
        <section className="pb-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-light text-gray-900 border-b border-gray-200 pb-4">
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-gray-700 font-medium">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        {...register('fullName')}
                        placeholder="John Smith"
                        className="border-gray-300 focus:border-travel-teal focus:ring-travel-teal"
                        data-testid="input-full-name"
                      />
                      <p className="text-sm text-gray-500">Please provide your full name so we can personalize your quote.</p>
                      {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-medium">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          {...register('email')}
                          placeholder="john.smith@example.com"
                          className="pl-10 border-gray-300 focus:border-travel-teal focus:ring-travel-teal"
                          data-testid="input-email"
                        />
                      </div>
                      <p className="text-sm text-gray-500">Enter your email to receive your personalized quote.</p>
                      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-700 font-medium">
                        Phone Number <span className="text-gray-400">(Optional)</span>
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          {...register('phone')}
                          placeholder="+1 234 567 8901"
                          className="pl-10 border-gray-300 focus:border-travel-teal focus:ring-travel-teal"
                          data-testid="input-phone"
                        />
                      </div>
                      <p className="text-sm text-gray-500">If you'd like to discuss your quote directly, please provide your phone number.</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">
                        Preferred Contact Method <span className="text-red-500">*</span>
                      </Label>
                      <Select onValueChange={(value) => setValue('contactMethod', value)}>
                        <SelectTrigger className="border-gray-300 focus:border-travel-teal" data-testid="select-contact-method">
                          <SelectValue placeholder="How would you prefer to be contacted?" />
                        </SelectTrigger>
                        <SelectContent>
                          {contactMethods.map((method) => (
                            <SelectItem key={method} value={method}>{method}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.contactMethod && <p className="text-red-500 text-sm">{errors.contactMethod.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Travel Details */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-light text-gray-900 border-b border-gray-200 pb-4">
                    Travel Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="dateFrom" className="text-gray-700 font-medium">
                        Travel Start Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="dateFrom"
                        type="date"
                        {...register('dateFrom')}
                        className="border-gray-300 focus:border-travel-teal focus:ring-travel-teal"
                        data-testid="input-date-from"
                      />
                      {errors.dateFrom && <p className="text-red-500 text-sm">{errors.dateFrom.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateTo" className="text-gray-700 font-medium">
                        Travel End Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="dateTo"
                        type="date"
                        {...register('dateTo')}
                        className="border-gray-300 focus:border-travel-teal focus:ring-travel-teal"
                        data-testid="input-date-to"
                      />
                      {errors.dateTo && <p className="text-red-500 text-sm">{errors.dateTo.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destinations" className="text-gray-700 font-medium">
                      Destination(s) <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="destinations"
                        {...register('destinations')}
                        placeholder="Cairo, Luxor, Red Sea Coast"
                        className="pl-10 border-gray-300 focus:border-travel-teal focus:ring-travel-teal"
                        data-testid="input-destinations"
                      />
                    </div>
                    <p className="text-sm text-gray-500">Where would you like to travel? Be as specific as possible.</p>
                    {errors.destinations && <p className="text-red-500 text-sm">{errors.destinations.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">
                        Number of Travelers <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Select onValueChange={(value) => setValue('numberOfTravelers', value)}>
                          <SelectTrigger className="pl-10 border-gray-300 focus:border-travel-teal" data-testid="select-travelers">
                            <SelectValue placeholder="How many people will be traveling?" />
                          </SelectTrigger>
                          <SelectContent>
                            {travelerCounts.map((count) => (
                              <SelectItem key={count} value={count}>{count} {count === '1' ? 'person' : 'people'}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {errors.numberOfTravelers && <p className="text-red-500 text-sm">{errors.numberOfTravelers.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budget" className="text-gray-700 font-medium">
                        Estimated Budget <span className="text-gray-400">(Optional but recommended)</span>
                      </Label>
                      <Input
                        id="budget"
                        {...register('budget')}
                        placeholder="$5,000 - $10,000"
                        className="border-gray-300 focus:border-travel-teal focus:ring-travel-teal"
                        data-testid="input-budget"
                      />
                      <p className="text-sm text-gray-500">To tailor the quote to your preferences, please let us know your estimated budget.</p>
                    </div>
                  </div>
                </div>

                {/* Experience Preferences */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-light text-gray-900 border-b border-gray-200 pb-4">
                    Experience Preferences
                  </h3>

                  <div className="space-y-4">
                    <Label className="text-gray-700 font-medium">
                      Type of Experience <span className="text-red-500">*</span>
                    </Label>
                    <p className="text-sm text-gray-500">What type of luxury experience are you looking for? (Select all that apply)</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {experienceTypes.map((experience) => (
                        <div key={experience} className="flex items-center space-x-3">
                          <Checkbox
                            id={experience}
                            checked={selectedExperiences.includes(experience)}
                            onCheckedChange={(checked) => handleExperienceChange(experience, checked as boolean)}
                            data-testid={`checkbox-experience-${experience.toLowerCase().replace(/\s+/g, '-')}`}
                          />
                          <Label htmlFor={experience} className="text-sm font-normal cursor-pointer">
                            {experience}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {errors.experienceType && <p className="text-red-500 text-sm">{errors.experienceType.message}</p>}
                  </div>

                  <div className="space-y-4">
                    <Label className="text-gray-700 font-medium">
                      Accommodation Preference <span className="text-red-500">*</span>
                    </Label>
                    <p className="text-sm text-gray-500">Please select your accommodation preferences for your journey. (Select all that apply)</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {accommodationTypes.map((accommodation) => (
                        <div key={accommodation} className="flex items-center space-x-3">
                          <Checkbox
                            id={accommodation}
                            checked={selectedAccommodation.includes(accommodation)}
                            onCheckedChange={(checked) => handleAccommodationChange(accommodation, checked as boolean)}
                            data-testid={`checkbox-accommodation-${accommodation.toLowerCase().replace(/\s+/g, '-')}`}
                          />
                          <Label htmlFor={accommodation} className="text-sm font-normal cursor-pointer">
                            {accommodation}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {errors.accommodationPreference && <p className="text-red-500 text-sm">{errors.accommodationPreference.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialRequests" className="text-gray-700 font-medium">
                      Special Requests or Interests <span className="text-gray-400">(Optional)</span>
                    </Label>
                    <Textarea
                      id="specialRequests"
                      {...register('specialRequests')}
                      placeholder="Is there anything specific you'd like to include in your journey? (e.g., special celebrations, dietary preferences, guided tours)"
                      rows={4}
                      className="border-gray-300 focus:border-travel-teal focus:ring-travel-teal"
                      data-testid="textarea-special-requests"
                    />
                    <p className="text-sm text-gray-500">We would love a private guided tour of the Pyramids of Giza.</p>
                  </div>
                </div>

                {/* Terms and Submit */}
                <div className="space-y-6 pt-8 border-t border-gray-200">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="agreement"
                      {...register('agreement')}
                      data-testid="checkbox-agreement"
                    />
                    <Label htmlFor="agreement" className="text-sm font-normal cursor-pointer leading-relaxed">
                      I agree to the terms and conditions and privacy policy. I understand that this information will be used 
                      to create a personalized travel quote and may be stored for future communications about luxury travel services.
                    </Label>
                  </div>
                  {errors.agreement && <p className="text-red-500 text-sm">{errors.agreement.message}</p>}

                  <Button 
                    type="submit"
                    className="w-full bg-travel-teal hover:bg-travel-navy text-white py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={submitQuoteMutation.isPending}
                    data-testid="button-submit-quote"
                  >
                    {submitQuoteMutation.isPending ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      'Receive My Tailored Quote'
                    )}
                  </Button>

                  <p className="text-center text-sm text-gray-500">
                    Allow us to create a bespoke, luxurious experience tailored to your unique desires.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </Layout>
    </>
  );
}