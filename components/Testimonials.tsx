
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
      message: "The attention to detail in their digital products is unmatched. They truly understand what user experience means in 2024.",
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
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-indigo-500 font-bold tracking-widest uppercase text-sm mb-4"
          >
            Social Proof
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black"
          >
            What Our Clients <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Transmit</span>
          </motion.h3>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-8 md:p-16 rounded-[40px] relative border border-white/5 bg-white/[0.02] backdrop-blur-sm"
            >
              <Quote className="absolute top-10 right-10 w-12 h-12 md:w-20 md:h-20 text-white/5" />

              <div className="relative z-10 text-center">
                <p className="text-xl md:text-3xl font-light italic text-gray-200 leading-relaxed mb-10">
                  “{testimonials[currentIndex]?.message}”
                </p>

                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl mb-4 rotate-3 group-hover:rotate-0 transition-transform flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-500/20">
                    {testimonials[currentIndex]?.name.charAt(0)}
                  </div>
                  <h4 className="text-xl font-bold">{testimonials[currentIndex]?.name}</h4>
                  <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">{testimonials[currentIndex]?.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          {testimonials.length > 1 && (
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={prev}
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all hover:scale-110"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={next}
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all hover:scale-110"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          <div className="mt-16 text-center">
            <button
              onClick={() => setIsFormOpen(true)}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-bold transition-all hover:-translate-y-1 shadow-xl hover:shadow-indigo-500/10"
            >
              <Plus size={18} className="text-indigo-400 group-hover:rotate-90 transition-transform" />
              Submit Your Transmission
            </button>
          </div>
        </div>
      </div>

      <TestimonialForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </section>
  );
};

export default Testimonials;
