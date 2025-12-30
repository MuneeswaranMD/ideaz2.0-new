
import React from 'react';
import { Instagram, Twitter, Linkedin, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-zinc-950 pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <img src="/logo.png" alt="Averqon Logo" className="h-10 w-10 object-contain" />
              <span className="text-3xl font-black tracking-tighter text-white">
                Averqon
              </span>
            </Link>
            <p className="text-gray-500 leading-relaxed mb-8 max-w-sm">
              We build visual experiences and robust digital solutions for brands that want to grow in the digital age.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/averqon_hq?igsh=NnN4ZzRsNTQydWRp" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-indigo-600 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-indigo-600 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://www.linkedin.com/company/averqon/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-indigo-600 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-indigo-600 transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-gray-500 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-gray-500 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/services" className="text-gray-500 hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/portfolio" className="text-gray-500 hover:text-white transition-colors">Portfolio</Link></li>
              <li><Link to="/averqon-billing" className="text-gray-500 hover:text-white transition-colors">Billing Software</Link></li>
              <li><Link to="/careers" className="text-gray-500 hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Services</h4>
            <ul className="space-y-4">
              <li><Link to="/services" className="text-gray-500 hover:text-white transition-colors">Web Design</Link></li>
              <li><Link to="/services" className="text-gray-500 hover:text-white transition-colors">Web Development</Link></li>
              <li><Link to="/services" className="text-gray-500 hover:text-white transition-colors">Digital Marketing</Link></li>
              <li><Link to="/services" className="text-gray-500 hover:text-white transition-colors">Graphic Design</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Contact Info</h4>
            <ul className="space-y-4">
              <li className="text-gray-500">
                <span className="block text-white text-sm font-semibold uppercase mb-1">Location</span>
                Coimbatore, India
              </li>
              <li className="text-gray-500">
                <span className="block text-white text-sm font-semibold uppercase mb-1">Email</span>
                <a href="mailto:hr@ideaz.org.in" className="hover:text-indigo-400 transition-colors">hr@ideaz.org.in</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>&copy; 2024 Averqon HQ. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Made with Averqon Development Team</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
