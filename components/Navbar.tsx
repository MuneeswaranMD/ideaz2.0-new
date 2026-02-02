
import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';
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
    { name: 'Product', href: '/averqon-billing' },
    { name: 'Careers', href: '/careers' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <>
      <div className="fixed w-full z-[100] px-4 sm:px-6 lg:px-8 mt-4 pointer-events-none flex justify-center transition-all duration-500">
        <nav
          className={`
                        pointer-events-auto flex items-center justify-between transition-all duration-500 ease-out
                        ${scrolled
              ? 'w-full max-w-5xl bg-black/60 backdrop-blur-xl border border-white/10 px-6 py-2 rounded-full shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]'
              : 'w-full max-w-7xl bg-transparent px-0 py-4 border-transparent'
            }
                    `}
        >
          {/* Brand Logo */}
          <Link to="/" className="flex items-center group relative">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-full" />
              <img src="/logo.png" alt="Averqon Logo" className="h-10 w-10 relative z-10 transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110" />
            </div>
            <span className="ml-3 text-2xl font-black tracking-tighter text-white group-hover:text-indigo-400 transition-colors">
              Averqon
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) => `
                                    relative px-4 py-2 text-sm font-bold tracking-tight transition-all duration-300 group
                                    ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}
                                `}
              >
                {({ isActive }) => (
                  <>
                    <span className="relative z-10">{link.name}</span>
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                    )}
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 rounded-full transition-opacity" />
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setIsEnquiryOpen(true)}
              className="group relative px-6 py-2.5 rounded-full text-sm font-black overflow-hidden bg-white text-black hover:text-white transition-colors duration-500"
            >
              <div className="absolute inset-x-0 bottom-0 h-0 bg-indigo-600 transition-all duration-300 group-hover:h-full group-active:bg-indigo-700" />
              <span className="relative flex items-center gap-2">
                START PROJECT <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="lg:hidden flex items-center pr-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 text-white transition-transform active:scale-95"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Premium Mobile Menu Overlay */}
      <div
        className={`
                    fixed inset-0 z-[90] bg-black/40 backdrop-blur-3xl lg:hidden transition-all duration-700 ease-in-out
                    ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                `}
      >
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <div className="w-full max-w-sm space-y-2">
            {navLinks.map((link, index) => (
              <NavLink
                key={link.name}
                to={link.href}
                onClick={() => setIsOpen(false)}
                style={{ transitionDelay: `${index * 50}ms` }}
                className={({ isActive }) => `
                                    flex items-center justify-between w-full px-6 py-4 rounded-3xl text-3xl font-black transition-all duration-500 translate-y-0
                                    ${isActive
                    ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-500/30'
                    : 'text-gray-500 bg-white/5 hover:bg-white/10 hover:text-white'
                  }
                                    ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                                `}
              >
                {link.name}
                {link.href === '/' && <Sparkles size={24} className="text-indigo-400" />}
              </NavLink>
            ))}

            <div className={`pt-8 transition-all duration-700 delay-500 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
              <button
                onClick={() => { setIsOpen(false); setIsEnquiryOpen(true); }}
                className="w-full bg-white text-black py-6 rounded-[2rem] text-xl font-black flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-95"
              >
                GET IN TOUCH <ArrowRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <EnquiryModal isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} />
    </>
  );
};

export default Navbar;

