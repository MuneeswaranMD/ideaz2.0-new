import React from 'react';
import { motion } from 'framer-motion';

const Partners: React.FC = () => {
    const partners = [
        { name: "Algorand", logo: "/partners/algorand.png" },
        { name: "Immutable", logo: "/partners/immutable.png" },
        { name: "Polygon", logo: "/partners/polygon.png" },
        { name: "BNB Chain", logo: "/partners/bnb.png" },
        { name: "Polkadot", logo: "/partners/polkadot.png" },
        { name: "Solana", logo: "/partners/solana.png" },
        { name: "Tezos", logo: "/partners/tezos.png" },
        { name: "Klaytn", logo: "/partners/klaytn.png" }
    ];

    return (
        <section className="py-24 relative overflow-hidden border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-white/30 uppercase tracking-[0.4em] font-black text-xs mb-4 text-center">Our Network</h2>
                    <h3 className="text-4xl font-black   tracking-tighter text-center">Building with the best</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 px-4">
                    {partners.map((partner, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-zinc-950/40 border border-white/5 h-24 md:h-32 rounded-3xl flex items-center justify-center grayscale hover:grayscale-0 hover:bg-white/5 hover:border-white/10 transition-all group px-8"
                        >
                            {/* FALLBACK to text if image fails, making it look professional */}
                            <span className="text-xl font-black tracking-tighter text-white/20 group-hover:text-white/60 transition-colors uppercase  ">{partner.name}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Partners;
