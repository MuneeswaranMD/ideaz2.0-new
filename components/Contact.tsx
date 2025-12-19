
import React from 'react';
import { Mail, MapPin, Send } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-24 bg-black relative">
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-indigo-900/10 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20">
          <div>
            <h2 className="text-indigo-500 font-bold tracking-widest uppercase text-sm mb-4">Contact Us</h2>
            <h3 className="text-4xl md:text-5xl font-black mb-8">Let's Create Together</h3>
            <p className="text-xl text-gray-400 mb-12">
              We would love to hear from you! Whether you have a question, need assistance, or want to start a project, our team is here to help.
            </p>

            <div className="space-y-8">
              <div className="flex items-center group">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mr-4 group-hover:bg-indigo-600/20 transition-colors">
                  <MapPin className="text-indigo-500" />
                </div>
                <div>
                  <h4 className="text-gray-500 font-semibold uppercase text-xs tracking-widest mb-1">Our Base</h4>
                  <p className="text-lg font-medium">Coimbatore, Tamil Nadu</p>
                </div>
              </div>

              <div className="flex items-center group">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mr-4 group-hover:bg-indigo-600/20 transition-colors">
                  <Mail className="text-indigo-500" />
                </div>
                <div>
                  <h4 className="text-gray-500 font-semibold uppercase text-xs tracking-widest mb-1">Email Us</h4>
                  <a href="mailto:hr@ideaz.org.in" className="text-lg font-medium hover:text-indigo-400 transition-colors">hr@ideaz.org.in</a>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-10 rounded-[40px]">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-widest">Name</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-indigo-500 focus:outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-widest">Email</label>
                  <input
                    type="email"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-indigo-500 focus:outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-widest">Service</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-indigo-500 focus:outline-none transition-colors appearance-none">
                  <option className="bg-zinc-900">Web Design & Development</option>
                  <option className="bg-zinc-900">Digital Marketing</option>
                  <option className="bg-zinc-900">Branding & Identity</option>
                  <option className="bg-zinc-900">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-widest">Message</label>
                <textarea
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-bold py-5 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center group"
              >
                Send Message
                <Send size={18} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
