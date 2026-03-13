
import React, { useState, useEffect } from 'react';
import { Quote, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import TestimonialForm from './TestimonialForm';
import { motion, AnimatePresence } from 'framer-motion';

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const defaultTestimonials = [
    {
      name: "Ajay",
      role: "E-Commerce Entrepreneur",
      message: "Shopping here has been an absolute pleasure! The website is easy to navigate, checkout is seamless, and customer support is excellent. Highly recommended!",
      id: 'default-1'
    },
    {
      name: "Sarah Chen",
      role: "Tech Maven",
      message: "The attention to detail in their digital products is unmatched. They truly understand what user experience means in 2026.",
      id: 'default-2'
    }
  ];

  useEffect(() => {
    const q = query(
      collection(db, 'testimonials'),
      where('status', '==', 'approved'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      if (items.length > 0) {
        setTestimonials(items);
      } else {
        setTestimonials(defaultTestimonials);
      }
      setLoading(false);
    }, (error) => {
      console.error("Testimonials fetch error:", error);
      setTestimonials(defaultTestimonials);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  if (loading) return null;

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-purple-500 font-black tracking-[0.4em] uppercase text-xs mb-6"
          >
            Social Engineering
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black   tracking-tighter"
          >
            What They <span className="text-white/20">Transmit</span>
          </motion.h3>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="glass-card p-8 md:p-20 rounded-[40px] relative border-white/5"
            >
              <Quote className="absolute top-10 right-10 w-12 h-12 md:w-32 md:h-32 text-white/[0.03]" />

              <div className="relative z-10 text-center">
                <p className="text-xl md:text-3xl font-light   text-white/80 leading-relaxed mb-12 tracking-tight">
                  “{testimonials[currentIndex]?.message}”
                </p>

                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-purple-600/10 rounded-[2rem] mb-6 flex items-center justify-center text-purple-500 font-black text-3xl border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                    {testimonials[currentIndex]?.name.charAt(0)}
                  </div>
                  <h4 className="text-2xl font-black   tracking-tighter">{testimonials[currentIndex]?.name}</h4>
                  <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mt-2">{testimonials[currentIndex]?.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          {testimonials.length > 1 && (
            <div className="flex justify-center gap-6 mt-12">
              <button
                onClick={prev}
                className="p-5 rounded-2xl glass-card hover:bg-white/5 text-white transition-all hover:scale-110 active:scale-90"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={next}
                className="p-5 rounded-2xl glass-card hover:bg-white/5 text-white transition-all hover:scale-110 active:scale-90"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}

          <div className="mt-16 text-center">
            <button
              onClick={() => setIsFormOpen(true)}
              className="group inline-flex items-center gap-4 px-10 py-5 glass-card rounded-2xl text-white font-black uppercase tracking-widest text-xs transition-all hover:-translate-y-1 hover:border-purple-500/30"
            >
              <Plus size={18} className="text-purple-500 group-hover:rotate-90 transition-transform" />
              Submit Transmission
            </button>
          </div>
        </div>
      </div>

      <TestimonialForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </section>
  );
};

export default Testimonials;
