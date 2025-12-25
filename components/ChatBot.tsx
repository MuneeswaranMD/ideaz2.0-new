
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2, User, Bot, ChevronDown } from 'lucide-react';
import { getAIResponse, saveChatLead } from '../lib/aiService';
import { motion, AnimatePresence } from 'framer-motion';

const ChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [history, setHistory] = useState<{ role: 'user' | 'model', parts: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    const handleSend = async () => {
        if (!message.trim() || loading) return;

        const userMsg = message;
        setMessage('');
        setHistory(prev => [...prev, { role: 'user', parts: userMsg }]);
        setLoading(true);

        const aiResponse = await getAIResponse(userMsg, history);

        setHistory(prev => [...prev, { role: 'model', parts: aiResponse }]);
        setLoading(false);

        // Simple Lead Detection: If message contains email-like pattern
        if (userMsg.includes('@') || userMsg.match(/\d{5,}/)) {
            await saveChatLead({
                name: 'Website Visitor',
                email: userMsg.includes('@') ? userMsg.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] || 'Unknown' : 'Phone Only',
                service: 'General AI enquiry',
                message: `Lead detected in chat: ${userMsg}`
            });
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="absolute bottom-20 right-0 w-[400px] h-[600px] bg-zinc-950 border border-white/5 rounded-[32px] shadow-2xl overflow-hidden flex flex-col backdrop-blur-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 bg-gradient-to-r from-indigo-600/10 to-transparent border-b border-white/5 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full border-2 border-indigo-500/30 p-0.5 overflow-hidden shadow-lg shadow-indigo-600/20">
                                    <img
                                        src="/ella.png"
                                        alt="Ella"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-base">Ella</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Digital Assistant</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div
                            ref={scrollRef}
                            className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-hide"
                        >
                            {history.length === 0 && (
                                <div className="text-center py-10 animate-in fade-in duration-1000">
                                    <div className="w-20 h-20 rounded-full border-2 border-indigo-500/20 p-1 mx-auto mb-6 shadow-2xl shadow-indigo-500/10">
                                        <img
                                            src="/ella.png"
                                            alt="Ella"
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    </div>
                                    <h4 className="text-white text-xl font-bold mb-2 tracking-tight">Hi, I'm Ella!</h4>
                                    <p className="text-gray-500 text-sm px-10 leading-relaxed">
                                        I'm your official Averqon guide. How can I help you grow your business today?
                                    </p>
                                    <div className="mt-8 grid grid-cols-1 gap-2">
                                        {['What services do you offer?', 'Show me your portfolio', 'I need a quotation'].map((text) => (
                                            <button
                                                key={text}
                                                onClick={() => {
                                                    setMessage(text);
                                                }}
                                                className="text-xs text-gray-400 bg-white/5 border border-white/5 px-4 py-3 rounded-2xl hover:bg-white/10 hover:border-indigo-500/30 hover:text-white transition-all text-left group flex justify-between items-center"
                                            >
                                                {text}
                                                <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Send size={10} />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {history.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-3 animate-in slide-in-from-bottom-2 duration-300`}>
                                    {msg.role === 'model' && (
                                        <div className="w-8 h-8 rounded-full border border-indigo-500/20 overflow-hidden flex-shrink-0 mt-1">
                                            <img
                                                src="/ella.png"
                                                alt="Ella Small"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                        : 'bg-white/5 text-gray-300 rounded-tl-none border border-white/5'
                                        }`}>
                                        {msg.parts}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start gap-3">
                                    <div className="w-8 h-8 rounded-full border border-indigo-500/20 overflow-hidden flex-shrink-0">
                                        <img
                                            src="/ella.png"
                                            alt="Ella Thinking"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="bg-white/5 text-gray-500 rounded-2xl rounded-tl-none px-4 py-3 text-xs italic border border-white/5 flex items-center gap-2">
                                        <Loader2 className="animate-spin" size={12} /> Ella is thinking...
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-6 border-t border-white/5 bg-zinc-950">
                            <div className="relative">
                                <input
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Type your message..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-4 pr-12 py-4 text-sm focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-700 text-white"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!message.trim() || loading}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/20"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                            <div className="mt-4 flex justify-center">
                                <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest flex items-center gap-1">
                                    Powered by <Sparkles size={10} className="text-indigo-500" /> Avergon
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${isOpen ? 'bg-zinc-900 border border-white/10 rotate-90' : 'bg-indigo-600'
                    }`}
            >
                {isOpen ? <X className="text-white" size={28} /> : <MessageSquare className="text-white" size={28} />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-black animate-bounce" />
                )}
            </motion.button>
        </div>
    );
};

export default ChatBot;
