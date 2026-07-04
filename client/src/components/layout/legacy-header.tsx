import { Link } from "wouter";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-white hover:text-travel-teal transition-colors">
            Soléi
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/north-coast" className="text-white hover:text-travel-teal transition-colors">
              North Coast
            </Link>
            <Link href="/siwa-sanctuary" className="text-white hover:text-travel-teal transition-colors">
              Siwa Oasis
            </Link>
            <Link href="/experiences" className="text-white hover:text-travel-teal transition-colors">
              Experiences
            </Link>
            <Link href="/tours" className="text-white hover:text-travel-teal transition-colors">
              Tours
            </Link>
            <Link 
              href="/get-quote" 
              className="bg-travel-teal hover:bg-travel-navy px-6 py-2 rounded-lg text-white font-medium transition-colors"
              data-testid="button-get-quote"
            >
              Get a Free Quote
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-travel-teal transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-6 pb-4 border-t border-white/10 pt-4">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/north-coast" 
                className="text-white hover:text-travel-teal transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                North Coast
              </Link>
              <Link 
                href="/siwa-sanctuary" 
                className="text-white hover:text-travel-teal transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Siwa Oasis
              </Link>
              <Link 
                href="/experiences" 
                className="text-white hover:text-travel-teal transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Experiences
              </Link>
              <Link 
                href="/tours" 
                className="text-white hover:text-travel-teal transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Tours
              </Link>
              <Link 
                href="/get-quote" 
                className="bg-travel-teal hover:bg-travel-navy px-6 py-2 rounded-lg text-white font-medium transition-colors inline-block w-fit"
                onClick={() => setIsMenuOpen(false)}
                data-testid="button-get-quote-mobile"
              >
                Get a Free Quote
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}