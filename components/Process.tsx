
import React from 'react';

const Process: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "Strategic Planning",
      desc: "Understanding goals, audience, and competition to build a solid foundation."
    },
    {
      num: "02",
      title: "Custom Development",
      desc: "Scalable, secure web & e-commerce solutions tailored for your business."
    },
    {
      num: "03",
      title: "Engaging Design",
      desc: "Intuitive UI with a strong visual identity that resonates with your users."
    },
    {
      num: "04",
      title: "Digital Marketing & SEO",
      desc: "Targeted strategies to drive traffic, leads, and sustainable growth."
    },
    {
      num: "05",
      title: "Branding & Identity",
      desc: "Crafting powerful stories that connect emotionally with your audience."
    },
    {
      num: "06",
      title: "Ongoing Support",
      desc: "Continuous maintenance and optimization to keep you ahead."
    }
  ];

  return (
    <section className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-indigo-500 font-bold tracking-widest uppercase text-sm mb-4">How We Work</h2>
          <h3 className="text-4xl md:text-5xl font-black mb-12">What We Do for Our Clients</h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-12 relative">
          {/* Connector line for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-white/5 -z-0"></div>
          
          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 group">
              <div className="flex items-center mb-6">
                <span className="text-5xl font-black text-white/5 group-hover:text-indigo-500/20 transition-colors duration-500">{step.num}</span>
                <div className="w-12 h-1 bg-indigo-600 rounded-full ml-4 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </div>
              <h4 className="text-xl font-bold mb-3">{step.title}</h4>
              <p className="text-gray-400 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
