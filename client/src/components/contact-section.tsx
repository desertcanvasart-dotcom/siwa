import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    destination: '',
    message: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Show success message
    toast({
      title: "Thank you for your inquiry!",
      description: "We will contact you soon with details about your dream trip.",
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      destination: '',
      message: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 bg-solei-navy text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Begin Your Journey
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Let our travel experts craft your perfect Egyptian adventure. From luxury accommodations to exclusive experiences, we handle every detail.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-6">Get in Touch</h3>
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <i className="fas fa-phone text-solei-gold mr-4"></i>
                <a href="tel:+201206887575" className="hover:text-solei-gold transition-colors duration-300">+20 120 688 7575</a>
              </div>
              <div className="flex items-center">
                <i className="fab fa-whatsapp text-solei-gold mr-4"></i>
                <a href="https://wa.me/201206887575" target="_blank" rel="noopener noreferrer" className="hover:text-solei-gold transition-colors duration-300">WhatsApp Us</a>
              </div>
              <div className="flex items-center">
                <i className="fas fa-envelope text-solei-gold mr-4"></i>
                <a href="mailto:hello@lasolei.com" className="hover:text-solei-gold transition-colors duration-300">hello@lasolei.com</a>
              </div>
              <div className="flex items-center">
                <i className="fas fa-map-marker-alt text-solei-gold mr-4"></i>
                <span>Cairo, Egypt</span>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/soleiluxury?igsh=YTQ2a2ZqZ2xjemd6&utm_source=qr" target="_blank" rel="noopener noreferrer" className="bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-colors duration-300">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://wa.me/201206887575" target="_blank" rel="noopener noreferrer" className="bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-colors duration-300">
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-solei-gold focus:outline-none focus:ring-2 focus:ring-solei-gold/50 text-white placeholder-white/60" 
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-solei-gold focus:outline-none focus:ring-2 focus:ring-solei-gold/50 text-white placeholder-white/60" 
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Destination Interest</label>
                <select 
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-solei-gold focus:outline-none focus:ring-2 focus:ring-solei-gold/50 text-white"
                >
                  <option value="" className="text-gray-800">Select a destination</option>
                  <option value="north-coast" className="text-gray-800">North Coast</option>
                  <option value="siwa" className="text-gray-800">Siwa Oasis</option>
                  <option value="both" className="text-gray-800">Both Destinations</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message *</label>
                <textarea 
                  rows={4} 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-solei-gold focus:outline-none focus:ring-2 focus:ring-solei-gold/50 text-white placeholder-white/60" 
                  placeholder="Tell us about your dream trip..."
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-solei-gold text-solei-navy py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-300"
              >
                Check Availability Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
