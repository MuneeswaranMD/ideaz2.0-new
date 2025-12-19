
import React from 'react';
import Contact from '../components/Contact';

const ContactPage: React.FC = () => {
  return (
    <div className="bg-black">
      <section className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-6xl md:text-8xl font-black mb-8">Say <span className="text-indigo-500">Hello.</span></h1>
          <p className="text-2xl text-gray-400 max-w-3xl font-light">
            Have a project in mind? We'd love to hear about it. Drop us a message or visit our office in the heart of Coimbatore.
          </p>
        </div>
      </section>

      <Contact />

      <section className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 text-center">

            <div className="p-8 border border-white/5 rounded-3xl">
              <h3 className="text-xl font-bold mb-4 uppercase tracking-widest text-gray-500">Office Hours</h3>
              <p className="text-2xl font-medium text-indigo-400">Mon - Sat, 9am - 7pm</p>
            </div>
            <div className="p-8 border border-white/5 rounded-3xl">
              <h3 className="text-xl font-bold mb-4 uppercase tracking-widest text-gray-500">Follow Us</h3>
              <p className="text-2xl font-medium text-indigo-400">@averqon_hq</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
