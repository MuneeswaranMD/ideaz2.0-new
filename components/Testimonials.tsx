
import React from 'react';
import { Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-indigo-500 font-bold tracking-widest uppercase text-sm mb-4">Testimonials</h2>
          <h3 className="text-4xl md:text-5xl font-black">What Our Clients Say</h3>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-12 rounded-[40px] relative">
            <Quote className="absolute top-10 right-10 w-16 h-16 text-white/5" />
            
            <div className="relative z-10 text-center">
              <p className="text-2xl md:text-3xl font-light italic text-gray-200 leading-relaxed mb-10">
                “Shopping here has been an absolute pleasure! The website is easy to navigate, checkout is seamless, and customer support is excellent. Highly recommended!”
              </p>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full mb-4"></div>
                <h4 className="text-xl font-bold">Ajay</h4>
                <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest">E-Commerce Entrepreneur</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
             <button className="text-white/40 hover:text-white transition-colors underline underline-offset-8">
                Submit Your Testimonial
             </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
