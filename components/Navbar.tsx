
import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, MessageSquare } from 'lucide-react';
import EnquiryModal from './EnquiryModal';

interface NavbarProps {
  scrolled: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ scrolled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Our Product', href: '/averqon-billing' },
    { name: 'Careers', href: '/careers' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md py-4 border-b border-white/10' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="Averqon Logo" className="h-10 w-10 object-contain" />
              <span className="text-2xl font-black tracking-tighter text-white">
                Averqon
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${isActive ? 'text-indigo-400' : 'text-gray-300 hover:text-white'}`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <button
                onClick={() => setIsEnquiryOpen(true)}
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/20 flex items-center"
              >
                <MessageSquare size={16} className="mr-2" />
                Enquire Now
              </button>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-300 hover:text-white"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden absolute left-0 right-0 bg-black/95 backdrop-blur-2xl transition-all duration-500 ease-in-out ${isOpen ? 'top-full opacity-100 translate-y-0' : '-translate-y-full opacity-0 pointer-events-none'} border-b border-white/10 max-h-[80vh] overflow-y-auto custom-scrollbar`}>
          <div className="px-6 pt-4 pb-12 space-y-2 text-center">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-4 text-xl font-bold transition-all ${isActive ? 'text-indigo-500 scale-110' : 'text-gray-300 hover:text-white'}`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <div className="pt-8 px-4">
              <button
                onClick={() => { setIsOpen(false); setIsEnquiryOpen(true); }}
                className="w-full bg-indigo-600 text-white py-5 rounded-2xl text-lg font-black hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-500/40 flex items-center justify-center group"
              >
                <MessageSquare size={20} className="mr-3 group-hover:rotate-12 transition-transform" />
                GET A QUOTE
              </button>
            </div>
          </div>
        </div>
      </nav>
      <EnquiryModal isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} />
    </>
  );
};

export default Navbar;
