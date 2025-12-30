
import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { sendEnquiryEmail } from '../lib/emailService';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Web Design & Development',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      // 1. Save to Firestore
      await addDoc(collection(db, 'enquiries'), {
        ...formData,
        timestamp: serverTimestamp()
      });

      // 2. Dispatch Email Notification
      try {
        await sendEnquiryEmail(formData);
      } catch (emailError) {
        console.warn('Email dispatch failed, but enquiry was saved:', emailError);
      }

      setStatus('success');
      setFormData({ name: '', email: '', service: 'Web Design & Development', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
    }
  };

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
                  <a href="mailto:averqon.hr@averqon.in" className="text-lg font-medium hover:text-indigo-400 transition-colors">averqon.hr@averqon.in</a>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-10 rounded-[40px]">
            {status === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-3xl font-black mb-4">Message Transmitted!</h3>
                <p className="text-gray-400">Our creative team will respond to your transmission shortly.</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-8 text-indigo-500 font-bold hover:text-indigo-400 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-widest">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-indigo-500 focus:outline-none transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-widest">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-indigo-500 focus:outline-none transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-widest">Service</label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-indigo-500 focus:outline-none transition-colors appearance-none"
                  >
                    <option className="bg-zinc-900">Web Design & Development</option>
                    <option className="bg-zinc-900">Digital Marketing</option>
                    <option className="bg-zinc-900">Branding & Identity</option>
                    <option className="bg-zinc-900">WordPress Development</option>
                    <option className="bg-zinc-900">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-widest">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full bg-indigo-600 text-white font-bold py-5 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center group disabled:bg-indigo-600/50"
                >
                  {status === 'submitting' ? 'Transmitting...' : 'Send Message'}
                  <Send size={18} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
                {status === 'error' && <p className="text-red-500 text-sm text-center">Connection failed. Please try again.</p>}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
