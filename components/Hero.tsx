import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.21, 0.45, 0.32, 0.9] as const },
    },
  };

  const glowVariants: Variants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.15, 0.25, 0.15],
      transition: { duration: 8, repeat: Infinity, ease: "easeInOut" },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#030303] text-white pt-20">
      {/* Digital Grid & Ambient Motion */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <motion.div
          variants={glowVariants}
          animate="animate"
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[140px]"
        />
        <motion.div
          variants={glowVariants}
          animate="animate"
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[140px]"
          transition={{ delay: 1 }}
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center text-center"
      >
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-10"
        >
          <Sparkles size={14} className="text-indigo-400 animate-pulse" />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-indigo-200">Engineering the Future</span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-[0.9]"
        >
          Digital <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Excellence</span><br />
          <span className="opacity-90">Simplified.</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed font-normal"
        >
          Averqon transforms complex ideas into high-performance digital products. We bridge the gap between visionary design and robust engineering.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-6 items-center"
        >
          <Link
            to="/services"
            className="group relative px-10 py-4 bg-white text-black rounded-full font-bold transition-all hover:scale-105 flex items-center gap-2 overflow-hidden"
          >
            <span className="relative z-10">Launch Project</span>
            <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-indigo-50 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Link>
          <Link
            to="/contact"
            className="px-10 py-4 bg-transparent border border-white/20 rounded-full font-bold transition-all hover:bg-white/5 hover:border-white/40 backdrop-blur-sm"
          >
            Contact Us
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] uppercase tracking-[0.5em] font-bold text-gray-500">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={20} className="text-gray-400" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
