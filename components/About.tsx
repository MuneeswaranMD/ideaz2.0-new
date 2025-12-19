
import React from 'react';
import { Layers, Zap, TrendingUp } from 'lucide-react';

const About: React.FC = () => {
  const highlights = [
    {
      icon: <Layers className="w-8 h-8 text-indigo-500" />,
      title: "Modern & Scalable",
      description: "We build future-proof web and mobile solutions designed to scale with your business."
    },
    {
      icon: <Zap className="w-8 h-8 text-indigo-500" />,
      title: "Cutting-edge Tech",
      description: "Our expertise lies in modern UI/UX and using the latest performance-optimized stacks."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-indigo-500" />,
      title: "Proven Results",
      description: "Dedicated track record of helping startups and SMEs achieve digital dominance."
    }
  ];

  return (
    <section id="about" className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-indigo-500 font-bold tracking-widest uppercase text-sm mb-4">About IDEAZ</h2>
            <h3 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
              Transforming Ideas Into <br />
              <span className="text-gray-500 italic font-medium">Digital Reality</span>
            </h3>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              IDEAZ is a creative digital agency based in Coimbatore, specializing in web development, design, digital marketing, and branding. We transform ideas into powerful business solutions through creativity, technology, and strategic insight.
            </p>
            <a
              href="#contact"
              className="inline-block bg-white text-black px-8 py-3.5 rounded-full font-bold hover:bg-gray-200 transition-colors shadow-lg"
            >
              Get a Quote
            </a>
          </div>

          <div className="space-y-6">
            {highlights.map((item, idx) => (
              <div key={idx} className="flex items-start p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-all group">
                <div className="mr-6 p-3 rounded-xl bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
