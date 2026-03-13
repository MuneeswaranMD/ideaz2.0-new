
import React from 'react';
import { Instagram, Twitter, Linkedin, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="relative z-10 pt-32 pb-16 border-t border-white/5 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24 mb-24">
          <div className="col-span-1 md:col-span-2 lg:col-span-1 space-y-10">
            <Link to="/" className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500 blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-700 rounded-full" />
                <img src="/averqon-logo.jpg" alt="Averqon Logo" className="h-12 w-12 object-contain group-hover:rotate-[360deg] transition-transform duration-1000 rounded-xl relative z-10" />
              </div>
              <span className="text-3xl font-black tracking-tighter text-white uppercase group-hover:text-purple-400 transition-colors">
                Averqon
              </span>
            </Link>
            <p className="text-white/40 text-lg font-light leading-relaxed max-w-sm">
              We build visual experiences and robust digital solutions for brands that define the digital age.
            </p>
            <div className="flex space-x-6">
              {[
                { icon: <Instagram size={20} />, href: "https://www.instagram.com/averqon_hq?igsh=NnN4ZzRsNTQydWRp" },
                { icon: <Twitter size={20} />, href: "#" },
                { icon: <Linkedin size={20} />, href: "https://www.linkedin.com/company/averqon/" },
                { icon: <Facebook size={20} />, href: "#" }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center hover:bg-purple-600 hover:border-purple-500 transition-all hover:scale-110 border border-white/5 group"
                >
                  <div className="text-white group-hover:scale-110 transition-transform">
                    {social.icon}
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-10">Quick Links</h4>
            <ul className="space-y-6">
              {[
                { name: 'Home', path: '/' },
                { name: 'About Us', path: '/about' },
                { name: 'Services', path: '/services' },
                { name: 'Portfolio', path: '/portfolio' },
                { name: 'Billing Protocol', path: '/averqon-billing' },
                { name: 'Careers', path: '/careers' },
                { name: 'Contact', path: '/contact' }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-white/40 hover:text-purple-400 transition-all font-light text-lg flex items-center group">
                    <span className="w-0 group-hover:w-4 h-px bg-purple-500 mr-0 group-hover:mr-3 transition-all"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-10">Logic Nodes</h4>
            <ul className="space-y-6">
              {[
                'Web Development',
                'Cloud Infrastructure',
                'Digital Strategy',
                'Visual Identity'
              ].map((service) => (
                <li key={service}>
                  <Link to="/services" className="text-white/40 hover:text-purple-400 transition-all font-light text-lg flex items-center group">
                    <span className="w-0 group-hover:w-4 h-px bg-purple-500 mr-0 group-hover:mr-3 transition-all"></span>
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-10">Terminal Info</h4>
            <ul className="space-y-10">
              <li className="space-y-3">
                <span className="block text-white/20 text-[10px] font-black uppercase tracking-widest">Global Base</span>
                <p className="text-xl font-black tracking-tighter text-white/60 group cursor-default">
                  Chennai, TN, IN
                </p>
              </li>
              <li className="space-y-3">
                <span className="block text-white/20 text-[10px] font-black uppercase tracking-widest">Comm Link</span>
                <a href="mailto:averqon.hr@averqon.in" className="text-xl font-black   tracking-tighter text-purple-500 hover:text-purple-400 transition-colors">
                  averqon.hr@averqon.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/10">
            &copy; 2026 Averqon HQ Protocol. All human rights reserved.
          </p>
          <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/10">
            <span>Security Encrypted</span>
            <span>Made by Averqon Elite</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
