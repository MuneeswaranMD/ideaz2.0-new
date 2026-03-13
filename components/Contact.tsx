
import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { sendEnquiryEmail } from '../lib/emailService';
import { triggerAutoResponse } from '../lib/automation';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
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

      // 2. Dispatch Email Notification & Automation
      try {
        await sendEnquiryEmail(formData);
        await triggerAutoResponse(formData, 'Averqon Website - Contact Page');
      } catch (triggerError) {
        console.warn('Notification/Automation failed, but enquiry was saved:', triggerError);
      }

      setStatus('success');
      setFormData({ name: '', email: '', phone: '', service: 'Web Design & Development', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20">
          <div>
            <h2 className="text-purple-500 font-black tracking-[0.4em] uppercase text-xs mb-6">Contact Us</h2>
            <h3 className="text-5xl md:text-7xl font-black tracking-tighter mb-10 leading-tight">Let's Create <br /> <span className="text-white/20">Together</span></h3>
            <p className="text-xl text-white/40 mb-16 font-light leading-relaxed max-w-xl">
              We would love to hear from you! Whether you have a question, need assistance, or want to start a project, our team is here to help.
            </p>

            <div className="space-y-10">
              <div className="flex items-center group">
                <div className="w-16 h-16 rounded-[2rem] glass-card flex items-center justify-center mr-6 group-hover:bg-purple-600/20 transition-all duration-500 border border-white/5 group-hover:border-purple-500/30">
                  <MapPin className="text-purple-500 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h4 className="text-white/20 font-black uppercase text-[10px] tracking-[0.3em] mb-2">Our Base</h4>
                  <p className="text-2xl font-black tracking-tighter">Chennai, Tamil Nadu</p>
                </div>
              </div>

              <div className="flex items-center group">
                <div className="w-16 h-16 rounded-[2rem] glass-card flex items-center justify-center mr-6 group-hover:bg-purple-600/20 transition-all duration-500 border border-white/5 group-hover:border-purple-500/30">
                  <Mail className="text-purple-500 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h4 className="text-white/20 font-black uppercase text-[10px] tracking-[0.3em] mb-2">Email Us</h4>
                  <a href="mailto:averqon.hr@averqon.in" className="text-2xl font-black tracking-tighter hover:text-purple-400 transition-colors">averqon.hr@averqon.in</a>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-4 md:p-1 rounded-[50px] border border-white/5">
            <div className="bg-[#0a0a0c]/40 p-10 md:p-14 rounded-[45px]">
              {status === 'success' ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20 animate-in fade-in zoom-in duration-700">
                  <div className="w-24 h-24 bg-purple-500/10 text-purple-500 rounded-full flex items-center justify-center mb-8 border border-purple-500/20 shadow-[0_0_50px_rgba(168,85,247,0.2)]">
                    <CheckCircle size={48} />
                  </div>
                  <h3 className="text-4xl font-black tracking-tighter mb-4">Transmission Received</h3>
                  <p className="text-white/40 text-lg font-light">Our creative team will respond shortly.</p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-12 text-purple-500 font-black uppercase tracking-widest text-xs hover:text-purple-400 transition-colors"
                  >
                    Send another transmission
                  </button>
                </div>
              ) : (
                <form className="space-y-8" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-2">Protocol Identity</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white/[0.03] border border-white/5 rounded-3xl px-6 py-5 focus:border-purple-500/50 focus:outline-none transition-all placeholder:text-white/10 text-lg font-light"
                        placeholder="Full Name"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-2">Digital Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white/[0.03] border border-white/5 rounded-3xl px-6 py-5 focus:border-purple-500/50 focus:outline-none transition-all placeholder:text-white/10 text-lg font-light"
                        placeholder="email@protocol.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-2">Comm Link</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-white/[0.03] border border-white/5 rounded-3xl px-6 py-5 focus:border-purple-500/50 focus:outline-none transition-all placeholder:text-white/10 text-lg font-light"
                        placeholder="Phone Number"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-2">Requested Logic</label>
                      <div className="relative">
                        <select
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                          className="w-full bg-white/[0.03] border border-white/5 rounded-3xl px-6 py-5 focus:border-purple-500/50 focus:outline-none transition-all appearance-none text-lg font-light cursor-pointer"
                        >
                          <option className="bg-zinc-950">Web Design & Development</option>
                          <option className="bg-zinc-950">Digital Marketing</option>
                          <option className="bg-zinc-950">Branding & Identity</option>
                          <option className="bg-zinc-950">WordPress Development</option>
                          <option className="bg-zinc-950">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-2">Transmission Data</label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/5 rounded-3xl px-6 py-5 focus:border-purple-500/50 focus:outline-none transition-all placeholder:text-white/10 text-lg font-light resize-none"
                      placeholder="Tell us about your requirements..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full bg-purple-600 text-white font-black uppercase tracking-[0.4em] text-xs py-6 rounded-[2rem] hover:bg-purple-500 transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)] flex items-center justify-center group disabled:bg-purple-600/50"
                  >
                    <span>{status === 'submitting' ? 'Transmitting...' : 'Send Transmission'}</span>
                    <Send size={16} className="ml-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                  </button>
                  {status === 'error' && <p className="text-red-500 text-xs font-black uppercase tracking-widest text-center mt-4">Critical Error: Connection Failed</p>}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
