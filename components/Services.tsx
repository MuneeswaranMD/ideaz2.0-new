import React from 'react';
import { Monitor, Megaphone, Palette, Cloud, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Services: React.FC = () => {
  const services = [
    {
      icon: <Monitor className="w-10 h-10 text-purple-500" />,
      title: "Visionary Development",
      description: "Creating seamless, visually stunning, and responsive websites that deliver exceptional user experiences.",
      image: "/services/web-design.png"
    },
    {
      icon: <Cloud className="w-10 h-10 text-purple-500" />,
      title: "Cloud Infrastructure",
      description: "Scalable cloud infrastructure, migration, and management solutions for the modern enterprise.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80"
    },
    {
      icon: <Megaphone className="w-10 h-10 text-purple-500" />,
      title: "Strategic Growth",
      description: "From SEO to social campaigns, we ensure your brand reaches the right audience and drives measurable growth.",
      image: "/services/marketing.png"
    },
    {
      icon: <Palette className="w-10 h-10 text-purple-500" />,
      title: "Brand Engineering",
      description: "Building memorable brands and visually striking assets that set your business apart from the competition.",
      image: "/services/branding.png"
    }
  ];

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-purple-500 font-black tracking-[0.4em] uppercase text-xs mb-6"
          >
            Engineering Excellence
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black mb-8   tracking-tighter"
          >
            Precision <span className="text-white/20">Solutions</span>
          </motion.h3>
          <p className="text-xl text-white/40 max-w-2xl mx-auto font-light leading-relaxed">
            Empowering businesses with technology, creativity, and innovation to thrive in the digital age.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card flex flex-col md:flex-row overflow-hidden hover:border-purple-500/30 transition-all duration-500 group border-white/5 h-auto md:h-80"
            >
              <div className="relative w-full md:w-2/5 overflow-hidden h-64 md:h-full">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#11111a]/80 hidden md:block"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#11111a]/80 to-transparent md:hidden"></div>
              </div>

              <div className="p-10 flex-grow flex flex-col justify-center">
                <div className="mb-6">
                  {service.icon}
                </div>
                <h4 className="text-2xl font-black mb-4 group-hover:text-purple-400 transition-colors   tracking-tighter">
                  {service.title}
                </h4>
                <p className="text-white/40 leading-relaxed text-sm font-light mb-auto">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
