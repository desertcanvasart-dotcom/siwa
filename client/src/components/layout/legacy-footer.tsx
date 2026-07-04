import { Link } from "wouter";
import { Instagram, Mail, Phone, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-travel-navy text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand + Contact Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-travel-teal">Soléi</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Discover Egypt's hidden treasures through immersive experiences that blend luxury with authentic cultural heritage.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/soleiluxury?igsh=YTQ2a2ZqZ2xjemd6&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-travel-teal transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://wa.me/201206887575" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-travel-teal transition-colors">
                <MessageCircle size={20} />
              </a>
            </div>
            <div className="pt-2 space-y-2">
              <div className="flex items-center space-x-3">
                <Phone size={14} className="text-travel-teal flex-shrink-0" />
                <span className="text-gray-300 text-sm">+20 120 688 7575</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={14} className="text-travel-teal flex-shrink-0" />
                <a href="mailto:hello@lasolei.com" className="text-gray-300 hover:text-travel-teal transition-colors text-sm">
                  hello@lasolei.com
                </a>
              </div>
            </div>
          </div>

          {/* Experiences */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Experiences</h4>
            <div className="space-y-2">
              <Link href="/experience/salt-lake-float-therapy" className="block text-gray-300 hover:text-travel-teal transition-colors text-sm">
                Salt Lake Float Therapy
              </Link>
              <Link href="/experience/sunset-sand-surfing" className="block text-gray-300 hover:text-travel-teal transition-colors text-sm">
                Sunset Sand-Surfing
              </Link>
              <Link href="/experience/cleopatra-spring-soak" className="block text-gray-300 hover:text-travel-teal transition-colors text-sm">
                Cleopatra Spring Soak
              </Link>
              <Link href="/experience/desert-stargazing-experience" className="block text-gray-300 hover:text-travel-teal transition-colors text-sm">
                Desert Stargazing
              </Link>
              <Link href="/experience/sleeping-under-stars" className="block text-gray-300 hover:text-travel-teal transition-colors text-sm">
                Sleeping Under Stars
              </Link>
              <Link href="/experiences" className="block text-gray-300 hover:text-travel-teal transition-colors text-sm">
                Browse All Experiences
              </Link>
            </div>
          </div>

          {/* Tours */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Tours</h4>
            <div className="space-y-2">
              <Link href="/tours" className="block text-gray-300 hover:text-travel-teal transition-colors text-sm">
                Royal Siwa Escape
              </Link>
              <Link href="/tours" className="block text-gray-300 hover:text-travel-teal transition-colors text-sm">
                Desert & Stars Experience
              </Link>
              <Link href="/tours" className="block text-gray-300 hover:text-travel-teal transition-colors text-sm">
                Great Sand Sea Odyssey
              </Link>
              <Link href="/tours" className="block text-gray-300 hover:text-travel-teal transition-colors text-sm">
                Mediterranean & Siwa Wellness
              </Link>
              <Link href="/tours" className="block text-gray-300 hover:text-travel-teal transition-colors text-sm">
                Coastal & Desert Royalty
              </Link>
              <Link href="/tours" className="block text-gray-300 hover:text-travel-teal transition-colors text-sm">
                Browse All Tours
              </Link>
            </div>
          </div>

          {/* Travel Guides */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Travel Guides</h4>
            <div className="space-y-2">
              <Link href="/siwa-travel-tips" className="block text-gray-300 hover:text-travel-teal transition-colors text-sm">
                Siwa Travel Tips
              </Link>
              <Link href="/north-coast-travel-tips" className="block text-gray-300 hover:text-travel-teal transition-colors text-sm">
                North Coast Travel Tips
              </Link>
              <Link href="/north-coast-faq" className="block text-gray-300 hover:text-travel-teal transition-colors text-sm">
                North Coast FAQs
              </Link>
              <Link href="/siwa-faq" className="block text-gray-300 hover:text-travel-teal transition-colors text-sm">
                Siwa FAQs
              </Link>
              <Link href="/blog" className="block text-gray-300 hover:text-travel-teal transition-colors text-sm">
                Blog
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 Soléi Travel. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <Link href="/terms-of-service" className="hover:text-travel-teal transition-colors">
                Terms
              </Link>
              <a href="#" className="hover:text-travel-teal transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-travel-teal transition-colors">
                Cookies
              </a>
            </div>
          </div>
          
          {/* Travel Digital Era Credit */}
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-gray-400 text-sm">Powered and Polished by</span>
              <a 
                href="https://traveldigitalera.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-travel-teal transition-colors text-sm"
              >
                Travel Digital Era
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}