
import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Testimonials from '../components/Testimonials';
import PortfolioPreview from '../components/PortfolioPreview';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
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
      <PortfolioPreview />
      <Testimonials />
    </>
  );
};

export default HomePage;
