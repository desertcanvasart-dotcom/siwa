import { useState } from 'react';
import { Phone, Mail, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelName: string;
  hotelEmail?: string;
}

export function RequestModal({ isOpen, onClose, hotelName, hotelEmail = "info@siwahotels.com" }: RequestModalProps) {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: '2',
    message: ''
  });

  if (!isOpen) return null;

  // Function to calculate next day date
  const getNextDay = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    date.setDate(date.getDate() + 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Handle check-in date change and automatically set check-out to next day
  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checkInDate = e.target.value;
    const nextDay = getNextDay(checkInDate);

    setFormData(prev => ({
      ...prev,
      checkIn: checkInDate,
      checkOut: nextDay
    }));
  };

  // Handle check-out date change
  const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      checkOut: e.target.value
    }));
  };

  // Handle other form changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please provide your name and email address.",
        variant: "destructive",
      });
      return;
    }

    if (formData.checkOut && formData.checkIn && new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      toast({
        title: "Invalid Dates",
        description: "Check-out date must be after check-in date.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Prepare data for API call
      const requestData = {
        ...formData,
        hotelName,
        hotelEmail
      };

      // Make API call to send hotel request
      const response = await apiRequest('POST', '/api/hotel-requests', requestData);
      const result = await response.json();

      if (result.success) {
        // Show success state
        setIsSubmitted(true);
        toast({
          title: "Request Sent!",
          description: result.message || "Your hotel request has been sent successfully.",
        });

        setTimeout(() => {
          setIsSubmitted(false);
          onClose();
          // Reset form
          setFormData({
            name: '',
            email: '',
            phone: '',
            checkIn: '',
            checkOut: '',
            guests: '2',
            message: ''
          });
        }, 3000);
      } else {
        // Handle API error response
        toast({
          title: "Request Failed",
          description: result.message || "Failed to send your request. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending hotel request:', error);
      toast({
        title: "Request Failed",
        description: "An error occurred while sending your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Success screen
  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-solei-navy mb-2">Request Sent!</h3>
          <p className="text-gray-600 mb-4">
            Thank you for your interest in {hotelName}. Our team will contact you within 24 hours to discuss your request and provide personalized recommendations.
          </p>
          <p className="text-sm text-gray-500">
            You'll receive a confirmation email at {formData.email}
          </p>
        </div>
      </div>
    );
  }

  // Main form
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white rounded-t-2xl border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-serif font-bold text-solei-navy">Send a Request - {hotelName}</h2>
          <button 
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            data-testid="close-request-modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Tell us about your ideal stay and we'll get back to you with personalized recommendations and availability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-solei-navy mb-2">
                Full Name *
              </label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-solei-gold focus:border-transparent"
                placeholder="Your full name"
                required
                data-testid="input-name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-solei-navy mb-2">
                Email Address *
              </label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-solei-gold focus:border-transparent"
                placeholder="your.email@example.com"
                required
                data-testid="input-email"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-solei-navy mb-2">
              Phone Number (Optional)
            </label>
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-solei-gold focus:border-transparent"
              placeholder="+20 XXX XXX XXXX"
              data-testid="input-phone"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-solei-navy mb-2">
                Check-in Date
              </label>
              <input 
                type="date" 
                name="checkIn"
                value={formData.checkIn}
                onChange={handleCheckInChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-solei-gold focus:border-transparent"
                min={new Date().toISOString().split('T')[0]}
                data-testid="input-checkin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-solei-navy mb-2">
                Check-out Date
              </label>
              <input 
                type="date" 
                name="checkOut"
                value={formData.checkOut}
                onChange={handleCheckOutChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-solei-gold focus:border-transparent"
                min={formData.checkIn || new Date().toISOString().split('T')[0]}
                data-testid="input-checkout"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-solei-navy mb-2">
                Number of Guests
              </label>
              <select 
                name="guests"
                value={formData.guests}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-solei-gold focus:border-transparent"
                data-testid="select-guests"
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
                <option value="5">5 Guests</option>
                <option value="6">6 Guests</option>
                <option value="7">7 Guests</option>
                <option value="8">8 Guests</option>
                <option value="9">9 Guests</option>
                <option value="10">10+ Guests</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-solei-navy mb-2">
              Special Requests or Questions
            </label>
            <textarea 
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-solei-gold focus:border-transparent resize-none"
              placeholder="Tell us about any special occasions, preferences, or questions you have about your stay..."
              data-testid="textarea-message"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-solei-gold text-solei-navy py-3 px-6 rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="button-send-request"
            >
              {isLoading ? 'Sending...' : 'Send Request'}
            </button>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <a href={`tel:+201234567890`} className="flex items-center gap-1 text-solei-teal hover:text-solei-navy transition-colors" data-testid="link-call">
                <Phone className="w-4 h-4" />
                Call Us
              </a>
              <a href={`mailto:${hotelEmail}`} className="flex items-center gap-1 text-solei-teal hover:text-solei-navy transition-colors" data-testid="link-email">
                <Mail className="w-4 h-4" />
                Email
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}