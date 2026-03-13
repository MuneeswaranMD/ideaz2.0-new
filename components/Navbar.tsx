
import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
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
      <div className={`fixed w-full z-[100] px-4 sm:px-6 lg:px-8 transition-all duration-500 flex justify-center ${scrolled ? 'mt-4' : 'mt-8'}`}>
        <nav
          className={`
                        pointer-events-auto flex items-center justify-between transition-all duration-700 ease-out
                        ${scrolled
              ? 'w-full max-w-5xl glass-card px-8 py-3 rounded-full shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]'
              : 'w-full max-w-7xl bg-transparent px-0 py-4 border-transparent'
            }
                    `}
        >
          {/* Brand Logo */}
          <Link to="/" className="flex items-center group relative">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500 blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-700 rounded-full" />
              <img src="/averqon-logo.jpg" alt="Averqon Logo" className="h-12 w-12 relative z-10 transition-transform duration-700 group-hover:rotate-[360deg] group-hover:scale-110 rounded-xl" />
            </div>
            <span className="ml-4 text-2xl font-black tracking-tighter text-white group-hover:text-purple-400 transition-colors uppercase">
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
                                    relative px-5 py-2 text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 group
                                    ${isActive ? 'text-white' : 'text-white/40 hover:text-white'}
                                `}
              >
                {({ isActive }) => (
                  <>
                    <span className="relative z-10">{link.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-4 right-4 h-0.5 bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)]"
                      />
                    )}
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity" />
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setIsEnquiryOpen(true)}
              className="btn-easya !px-8 !py-3 !text-[10px] !rounded-full uppercase tracking-widest"
            >
              START PROJECT
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
                    ? 'bg-[#a855f7] text-white shadow-2xl shadow-purple-500/30'
                    : 'text-white/40 bg-white/5 hover:bg-white/10 hover:text-white'
                  }
                                    ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                                `}
              >
                {link.name}
                {link.href === '/' && <Sparkles size={24} className="text-purple-400" />}
              </NavLink>
            ))}

            <div className={`pt-8 transition-all duration-700 delay-500 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
              <button
                onClick={() => { setIsOpen(false); setIsEnquiryOpen(true); }}
                className="w-full btn-easya !py-6 rounded-[2rem] text-xl font-black flex items-center justify-center gap-3"
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

