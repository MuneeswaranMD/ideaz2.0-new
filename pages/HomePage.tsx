import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Testimonials from '../components/Testimonials';
import PortfolioPreview from '../components/PortfolioPreview';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  useEffect(() => {
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Averqon is a leading digital agency offering premium web development, cloud services, and digital marketing solutions. Scale your business with our expertise.');
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'Digital Agency, Web Development, Cloud Services, Business Growth, Averqon, Coimbatore, Software Solutions, Automation, UI/UX Design, Strategic Marketing');
    }
  }, []);
  return (
    <>
      <Hero />
      <About />
      <section className="py-12 bg-zinc-950 flex justify-center border-b border-white/5">
        <Link to="/about" className="group text-indigo-400 font-bold flex items-center hover:text-indigo-300">
          Read Our Full Story <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>
      <Services />

      {/* Featured Product Section */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-zinc-900/50 border border-white/10 rounded-[48px] p-8 md:p-16 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[120px] -mr-48 -mt-48 transition-all group-hover:bg-indigo-600/20"></div>

            <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full mb-8">
                  <span className="text-sm font-semibold text-indigo-400 uppercase tracking-widest">Our Flagship Product</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight text-white">
                  Meet <span className="text-indigo-500">Averqon</span> Billing Software
                </h2>
                <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                  Simplify your financial workflows with our centralized and automated billing platform. Designed for the next generation of businesses.
                </p>
                <Link
                  to="/averqon-billing"
                  className="inline-flex items-center bg-white text-black px-8 py-4 rounded-2xl font-black text-lg hover:bg-indigo-500 hover:text-white transition-all group/btn"
                >
                  Explore Software
                  <ArrowRight size={20} className="ml-3 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                  <img
                    src="/averqon/mockup.png"
                    alt="Averqon Billing Software"
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-indigo-600 p-6 rounded-2xl shadow-xl hidden md:block">
                  <p className="text-white font-black text-xl italic whitespace-nowrap">Automate Everything.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PortfolioPreview />
      <Testimonials />
    </>
  );
};

export default HomePage;
