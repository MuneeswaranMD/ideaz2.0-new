import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    CreditCard,
    RefreshCw,
    Users,
    Clock,
    ShieldCheck,
    Zap,
    BarChart3,
    CheckCircle2,
    ArrowRight
} from 'lucide-react';
import BookDemoForm from '../components/BookDemoForm';

const AverqonBillingPage: React.FC = () => {
    useEffect(() => {
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Averqon Billing is an advanced cloud-based billing software designed to automate financial workflows for modern businesses. Simplify invoicing, tracking, and payments.');
        }

        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
            metaKeywords.setAttribute('content', 'Cloud Billing Software, SaaS billing, automated invoicing software, financial management tool, Averqon Billing, business automation, online payments, subscription management');
        }
    }, []);
    const features = [
        {
            title: "Smart Invoicing",
            description: "Generate professional estimates and invoices in seconds. Track when they're opened and paid.",
            icon: <FileText className="w-8 h-8 text-purple-400" />,
        },
        {
            title: "Payment Integration",
            description: "Accept payments globally with integrated processors. Automated reconciliations and tracking.",
            icon: <CreditCard className="w-8 h-8 text-indigo-500" />,
        },
        {
            title: "Recurring Billing",
            description: "Automate subscriptions and retainer billing. Set it once and let the system handle the rest.",
            icon: <RefreshCw className="w-8 h-8 text-indigo-500" />,
        },
        {
            title: "Customer CRM",
            description: "Centralized client management. View transaction history and manage relationships effortlessly.",
            icon: <Users className="w-8 h-8 text-indigo-500" />,
        },
        {
            title: "Automated Workflows",
            description: "Schedule follow-ups, payment reminders, and receipts to stop manual chasing.",
            icon: <Zap className="w-8 h-8 text-indigo-500" />,
        },
        {
            title: "Financial Insights",
            description: "Real-time analytics and financial tracking to help you make data-driven decisions.",
            icon: <BarChart3 className="w-8 h-8 text-indigo-500" />,
        }
    ];

    return (
        <div className="bg-transparent text-white min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full mb-8"
                        >
                            <ShieldCheck size={16} className="text-indigo-400" />
                            <span className="text-sm font-semibold text-indigo-300 uppercase tracking-widest">Global Billing Solution</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-6xl md:text-8xl font-black mb-8 leading-tight  "
                        >
                            Master Your <span className="text-purple-500">Billing</span> <br />
                            Like a Pro
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl md:text-2xl text-gray-400 mb-12 font-light leading-relaxed"
                        >
                            The centralized and automated billing platform designed to simplify financial workflows for freelancers, startups, and small-to-medium businesses.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-6"
                        >
                            <a
                                href="#book-demo"
                                className="btn-easya w-full sm:w-auto text-lg sm:text-xl px-10 py-5 sm:px-12 sm:py-6 text-center"
                            >
                                Book a Demo
                            </a>
                            <a
                                href="#features"
                                className="w-full sm:w-auto border border-white/10 glass-card px-10 py-5 sm:px-12 sm:py-6 rounded-2xl font-black text-lg sm:text-xl hover:bg-white/10 transition-all text-center"
                            >
                                Explore Features
                            </a>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Product Showcase */}
            <section className="py-20 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative rounded-[40px] overflow-hidden border border-white/10 shadow-2xl shadow-indigo-500/10"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                        <img
                            src="/averqon/mockup.png"
                            alt="Averqon Billing Dashboard"
                            className="w-full h-auto"
                        />
                        <div className="absolute bottom-12 left-12 right-12 z-20">
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl">
                                    <div className="text-3xl font-black text-indigo-500 mb-2">99%</div>
                                    <div className="text-sm text-gray-400 uppercase tracking-widest font-bold">Accuracy rate</div>
                                </div>
                                <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl">
                                    <div className="text-3xl font-black text-indigo-500 mb-2">2x</div>
                                    <div className="text-sm text-gray-400 uppercase tracking-widest font-bold">Faster Payments</div>
                                </div>
                                <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl">
                                    <div className="text-3xl font-black text-indigo-500 mb-2">-40%</div>
                                    <div className="text-sm text-gray-400 uppercase tracking-widest font-bold">Admin Workload</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Problem Solver Section */}
            <section className="py-24 bg-transparent border-y border-white/5 pb-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                                No More <span className="text-indigo-500">Billing Chaos</span>
                            </h2>
                            <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                                Many businesses rely on manual billing processes or multiple tools to manage invoices and payments, leading to errors, delays, and poor financial tracking.
                            </p>
                            <div className="space-y-6">
                                {[
                                    "Eliminate manual data entry errors",
                                    "Say goodbye to payment delays",
                                    "Consolidated financial reporting",
                                    "Unified customer billing history"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start space-x-4">
                                        <CheckCircle2 className="text-purple-500 mt-1 shrink-0" />
                                        <span className="text-lg text-gray-300">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-6">
                                <div className="bg-zinc-900 border border-white/10 p-8 rounded-[32px] transform -translate-y-8">
                                    <FileText className="w-10 h-10 text-indigo-500 mb-4" />
                                    <h3 className="font-bold text-xl mb-2">Estimates</h3>
                                    <p className="text-gray-500 text-sm">Professional quotes that convert prospects.</p>
                                </div>
                                <div className="bg-indigo-600 border border-white/10 p-8 rounded-[32px]">
                                    <CreditCard className="w-10 h-10 text-white mb-4" />
                                    <h3 className="font-bold text-xl mb-2">Invoices</h3>
                                    <p className="text-indigo-100 text-sm">Automated billing with direct payment links.</p>
                                </div>
                            </div>
                            <div className="space-y-6 mt-12">
                                <div className="bg-zinc-900 border border-white/10 p-8 rounded-[32px]">
                                    <RefreshCw className="w-10 h-10 text-indigo-500 mb-4" />
                                    <h3 className="font-bold text-xl mb-2">Recurring</h3>
                                    <p className="text-gray-500 text-sm">Subscription management made easy.</p>
                                </div>
                                <div className="bg-zinc-900 border border-white/10 p-8 rounded-[32px]">
                                    <BarChart3 className="w-10 h-10 text-indigo-500 mb-4" />
                                    <h3 className="font-bold text-xl mb-2">Analytics</h3>
                                    <p className="text-gray-500 text-sm">Deep dive into your revenue streams.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-black mb-6">Powerful Features</h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Everything you need to automate your billing operations and grow your business with confidence.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -10 }}
                                className="p-10 rounded-[32px] glass-card hover:border-purple-500/50 transition-all group"
                            >
                                <div className="mb-6 bg-indigo-500/10 w-20 h-20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed font-light">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Software Gallery */}
            <section className="py-24 bg-zinc-950 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-black mb-6">Experience the <span className="text-indigo-500">Interface</span></h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            A sleek, intuitive dashboard designed for maximum efficiency. Every feature is just a click away.
                        </p>
                    </div>

                    <div className="space-y-32">
                        {[
                            {
                                title: "Invoice Management",
                                desc: "Track every invoice from draft to payment. Stay on top of your receivables with real-time status updates.",
                                img: "/averqon/invoice.png",
                                reverse: false
                            },
                            {
                                title: "Dynamic Estimates",
                                desc: "Convert quotes to invoices instantly. professional, clear, and designed to win you more business.",
                                img: "/averqon/estimates.png",
                                reverse: true
                            },
                            {
                                title: "Payment Tracking",
                                desc: "Monitor institutional cash flow and transaction ledgers with pinpoint accuracy.",
                                img: "/averqon/payments.png",
                                reverse: false
                            },
                            {
                                title: "Automated Recurring Billing",
                                desc: "Schedule maintenance fees and subscriptions once. The system handles the rest, forever.",
                                img: "/averqon/recurring.png",
                                reverse: true
                            },
                            {
                                title: "Sharable Checkouts",
                                desc: "Create one-click payment links for your website or direct client messages. Quick, secure, and branded.",
                                img: "/averqon/checkouts.png",
                                reverse: false
                            }
                        ].map((item, idx) => (
                            <div key={idx} className={`flex flex-col lg:flex-row gap-16 items-center ${item.reverse ? 'lg:flex-row-reverse' : ''}`}>
                                <motion.div
                                    initial={{ opacity: 0, x: item.reverse ? 50 : -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="flex-1 w-full lg:w-1/2"
                                >
                                    <h3 className="text-4xl font-black mb-6">{item.title}</h3>
                                    <p className="text-xl text-gray-400 font-light leading-relaxed mb-8">{item.desc}</p>
                                    <div className="flex items-center space-x-4 text-indigo-500 font-bold uppercase tracking-widest text-sm">
                                        <div className="w-12 h-[1px] bg-indigo-500"></div>
                                        <span>Intuitive Workflow</span>
                                    </div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    className="flex-1 w-full lg:w-1/2"
                                >
                                    <div className="relative group">
                                        <div className="absolute -inset-4 bg-indigo-600/10 blur-2xl rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <img
                                            src={item.img}
                                            alt={item.title}
                                            className="w-full h-auto rounded-[32px] border border-white/10 shadow-2xl relative z-10 transform transition-transform duration-500 group-hover:scale-[1.02]"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Demo Section */}
            <section id="book-demo" className="py-24 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[600px] bg-indigo-600/10 blur-[150px] rounded-full"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                                Ready to <span className="text-indigo-500">Simplify</span> Your Billing?
                            </h2>
                            <p className="text-xl text-gray-400 mb-12 leading-relaxed">
                                Join hundreds of businesses that have transformed their financial operations with Averqon. Book your free demo today and see the future of billing.
                            </p>

                            <div className="space-y-8">
                                <div className="flex items-center space-x-6">
                                    <div className="w-14 h-14 bg-indigo-600/20 rounded-full flex items-center justify-center border border-indigo-500/30">
                                        <Clock className="text-indigo-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xl">15-Min Session</h4>
                                        <p className="text-gray-500">Quick, focused product tour.</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-6">
                                    <div className="w-14 h-14 bg-indigo-600/20 rounded-full flex items-center justify-center border border-indigo-500/30">
                                        <Users className="text-indigo-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xl">Expert Guidance</h4>
                                        <p className="text-gray-500">Direct answers for your specific use case.</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-6">
                                    <div className="w-14 h-14 bg-indigo-600/20 rounded-full flex items-center justify-center border border-indigo-500/30">
                                        <RefreshCw className="text-indigo-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xl">No Pressure</h4>
                                        <p className="text-gray-500">Just showing how we can help you grow.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <BookDemoForm />
                    </div>
                </div>
            </section>

            {/* CTA Footer */}
            <section className="py-20 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-8">Powering the next generation of businesses</h2>
                    <div className="flex flex-wrap justify-center gap-12 opacity-30">
                        <span className="text-2xl font-black uppercase tracking-tighter  ">FINTECH</span>
                        <span className="text-2xl font-black uppercase tracking-tighter  ">AGENCY.IO</span>
                        <span className="text-2xl font-black uppercase tracking-tighter  ">CLOUDSCALE</span>
                        <span className="text-2xl font-black uppercase tracking-tighter  ">NEXTGEN</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AverqonBillingPage;
