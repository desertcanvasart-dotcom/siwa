import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-solei-navy border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center">
          <h3 className="text-3xl font-serif font-bold text-white mb-4">Soléi</h3>
          <p className="text-white/60 mb-6">Discover Egypt's Hidden Treasures</p>
          <div className="flex justify-center space-x-8 text-white/40 text-sm">
            <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
            <Link href="/terms-of-service" className="hover:text-white transition-colors duration-300">Terms of Service</Link>
            <a href="#" className="hover:text-white transition-colors duration-300">About Us</a>
            <a href="#contact" className="hover:text-white transition-colors duration-300">Contact</a>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-white/40 text-sm">
            <div className="mb-4 space-y-1">
              <div>Email: <a href="mailto:hello@lasolei.com" className="text-solei-gold hover:text-yellow-400 transition-colors duration-300">hello@lasolei.com</a></div>
              <div>Phone: <a href="tel:+201206887575" className="text-solei-gold hover:text-yellow-400 transition-colors duration-300">+20 120 688 7575</a></div>
            </div>
            <div className="mb-2">© 2024 Soléi Travel. All rights reserved.</div>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span>Powered and Polished by</span>
              <a 
                href="https://traveldigitalera.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-solei-gold via-yellow-400 to-solei-coral text-solei-navy font-bold text-sm hover:scale-105 transform transition-all duration-300 hover:shadow-lg hover:shadow-solei-gold/30"
              >
                <span className="relative z-10 bg-gradient-to-r from-blue-900 to-purple-900 bg-clip-text text-transparent font-extrabold tracking-wide">
                  Travel Digital Era
                </span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-solei-gold via-yellow-400 to-solei-coral opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-solei-gold to-solei-coral opacity-30 group-hover:opacity-50 blur-sm transition-all duration-300"></div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
