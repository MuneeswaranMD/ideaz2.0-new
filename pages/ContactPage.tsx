
import React from 'react';
import Contact from '../components/Contact';

const ContactPage: React.FC = () => {
  return (
    <div className="bg-transparent text-white min-h-screen">
      <section className="relative pt-32 pb-24 overflow-hidden border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-6xl md:text-[8rem] font-black mb-12 leading-[0.85] tracking-tighter">
            Say <br />
            <span className="text-purple-500">Hello.</span>
          </h1>
          <p className="text-2xl text-white/50 max-w-3xl font-light leading-relaxed">
            Have a project in mind? We'd love to hear about it. Drop us a message or visit our office in the heart of chennai.
          </p>
        </div>
      </section>

      <Contact />

      <section className="py-24 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 text-center">

            <div className="glass-card p-12 rounded-[40px] border border-white/5">
              <h3 className="text-xs font-black mb-6 uppercase tracking-[0.4em] text-white/30">Office Hours</h3>
              <p className="text-3xl font-black tracking-tighter text-purple-500">Mon - Sat, 9am - 7pm</p>
            </div>
            <div className="glass-card p-12 rounded-[40px] border border-white/5">
              <h3 className="text-xs font-black mb-6 uppercase tracking-[0.4em] text-white/30">Follow Us</h3>
              <p className="text-3xl font-black tracking-tighter text-purple-500">@averqon_hq</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
