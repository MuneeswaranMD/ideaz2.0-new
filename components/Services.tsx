
import React from 'react';
import { Monitor, Megaphone, Palette } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: <Monitor className="w-10 h-10 text-indigo-500" />,
      title: "Web Design & Development",
      description: "Creating seamless, visually stunning, and responsive websites that deliver exceptional user experiences."
    },
    {
      icon: <Megaphone className="w-10 h-10 text-indigo-500" />,
      title: "Digital Marketing",
      description: "From SEO to social campaigns, we ensure your brand reaches the right audience and drives measurable growth."
    },
    {
      icon: <Palette className="w-10 h-10 text-indigo-500" />,
      title: "Branding & Graphic Design",
      description: "Building memorable brands and visually striking assets that set your business apart from the competition."
    }
  ];

  return (
    <section id="services" className="py-24 bg-black relative">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600/5 blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-indigo-500 font-bold tracking-widest uppercase text-sm mb-4">Our Services</h2>
          <h3 className="text-4xl md:text-5xl font-black mb-6">Empowering Your Business</h3>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Empowering businesses with technology, creativity, and innovation to thrive in the digital age.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div 
              key={idx} 
              className="glass-card p-10 rounded-3xl hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className="mb-6 group-hover:scale-110 transition-transform duration-300 inline-block">
                {service.icon}
              </div>
              <h4 className="text-2xl font-bold mb-4">{service.title}</h4>
              <p className="text-gray-400 leading-relaxed mb-8">
                {service.description}
              </p>
              <a 
                href="#contact" 
                className="text-indigo-400 font-semibold flex items-center hover:text-indigo-300 transition-colors"
              >
                Learn More <span className="ml-2">→</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
