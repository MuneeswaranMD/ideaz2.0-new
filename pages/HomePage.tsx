import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Services from '../components/Services';
import Testimonials from '../components/Testimonials';
import Partners from '../components/Partners';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  useEffect(() => {
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Averqon is a leading digital agency offering premium web development, cloud services, and digital marketing solutions. Scale your business with our expertise.');
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'Digital Agency, Web Development, Cloud Services, Business Growth, Averqon, chennai, Software Solutions, Automation, UI/UX Design, Strategic Marketing');
    }
  }, []);

  return (
    <div className="bg-transparent">
      <Hero />

      <Features />

      {/* Featured Product Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 md:p-20 relative overflow-hidden group border-white/5">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] -mr-64 -mt-64 transition-all duration-1000 group-hover:bg-purple-600/20"></div>

            <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-full mb-8">
                  <ShieldCheck size={16} className="text-purple-400" />
                  <span className="text-xs font-black text-purple-400 uppercase tracking-[0.2em]">Flagship Software</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black mb-10 leading-[0.9] text-white   tracking-tighter">
                  Centralized <br />
                  <span className="text-purple-500">Billing.</span> <br />
                  Simplified.
                </h2>
                <p className="text-xl text-white/50 mb-12 leading-relaxed font-light max-w-lg">
                  Empower your fintech operations with Averqon Billing. A robust, automated platform designed for the next generation of scale.
                </p>
                <Link
                  to="/averqon-billing"
                  className="btn-easya inline-flex items-center group/btn"
                >
                  Explore Software
                  <ArrowRight size={20} className="ml-3 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative rounded-[40px] overflow-hidden border border-white/10 shadow-2xl group-hover:border-purple-500/30 transition-all duration-700">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent z-10 opacity-60"></div>
                  <img
                    src="/averqon/mockup.png"
                    alt="Averqon Billing Software"
                    className="w-full h-auto object-cover transition-all duration-700 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                {/* Floating Stat */}
                <div className="absolute -bottom-8 -right-8 glass-card p-8 hidden md:block border-purple-500/20">
                  <div className="text-4xl font-black text-purple-400 mb-1  ">99.9%</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Uptime Guaranteed</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Services />

      <Partners />

      <Testimonials />

      {/* Final CTA / Download Section */}
      <section className="py-32 relative overflow-hidden text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl md:text-[6rem] font-black mb-12   tracking-tighter leading-none">
              Ready to <br />
              <span className="text-purple-500">Elevate?</span>
            </h2>
            <p className="text-2xl text-white/50 mb-16 font-light">
              Join the league of forward-thinking brands. Let's engineer your future together.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/contact" className="btn-easya w-full sm:w-auto text-lg sm:text-xl px-10 py-5 sm:px-12 sm:py-6 text-center">
                Start Project
              </Link>
              <Link to="/portfolio" className="glass-card px-10 py-5 sm:px-12 sm:py-6 rounded-2xl w-full sm:w-auto font-black text-lg sm:text-xl hover:bg-white/5 transition-all text-center">
                View Work
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
