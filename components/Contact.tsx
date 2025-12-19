
import React from 'react';
import { Mail, MapPin, Send, CheckCircle } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';

const Contact: React.FC = () => {
  const [state, handleSubmit] = useForm("xqezaoqo");

  const SuccessMessage = () => (
    <div className="glass-card p-12 rounded-[40px] text-center animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
        <CheckCircle className="text-white" size={32} />
      </div>
      <h3 className="text-3xl font-black mb-4">Message Received!</h3>
      <p className="text-gray-400 text-lg leading-relaxed">
        Thank you for reaching out. We've received your message and will get back to you within 24 hours.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-8 text-indigo-500 font-bold hover:text-indigo-400 transition-colors"
      >
        Send another message
      </button>
    </div>
  );

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

          <div className="relative">
            {state.succeeded ? (
              <SuccessMessage />
            ) : (
              <div className="glass-card p-10 rounded-[40px]">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-widest">Name</label>
                      <input
                        id="name"
                        name="name"
                        required
                        type="text"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-indigo-500 focus:outline-none transition-colors"
                        placeholder="John Doe"
                      />
                      <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red-500 text-xs mt-1" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-widest">Email</label>
                      <input
                        id="email"
                        name="email"
                        required
                        type="email"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-indigo-500 focus:outline-none transition-colors"
                        placeholder="john@example.com"
                      />
                      <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-500 text-xs mt-1" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="service" className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-widest">Service</label>
                    <select
                      id="service"
                      name="service"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-indigo-500 focus:outline-none transition-colors appearance-none"
                    >
                      <option className="bg-zinc-900" value="web">Web Design & Development</option>
                      <option className="bg-zinc-900" value="marketing">Digital Marketing</option>
                      <option className="bg-zinc-900" value="branding">Branding & Identity</option>
                      <option className="bg-zinc-900" value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-widest">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                      placeholder="Tell us about your project..."
                    />
                    <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-500 text-xs mt-1" />
                  </div>

                  <button
                    type="submit"
                    disabled={state.submitting}
                    className="w-full bg-indigo-600 text-white font-bold py-5 rounded-2xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg flex items-center justify-center group"
                  >
                    {state.submitting ? 'Sending...' : 'Send Message'}
                    {!state.submitting && <Send size={18} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
