
import React from 'react';
import { Zap, ExternalLink, RefreshCw } from 'lucide-react';

const Automation: React.FC = () => {
    const n8nUrl = "https://n8n-render-cf3i.onrender.com/";

    const refreshIframe = () => {
        const iframe = document.getElementById('n8n-iframe') as HTMLIFrameElement;
        if (iframe) {
            iframe.src = iframe.src;
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] md:h-screen bg-black">
            {/* Header */}
            <header className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between bg-zinc-950 gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <Zap size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-white tracking-tight">n8n <span className="text-amber-500">Automation</span></h1>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Workflow Command Center</p>
                    </div>
                </div>

                {/* Status/Tip */}
                <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Tip: Best viewed in Incognito Mode</span>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={refreshIframe}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                        title="Refresh View"
                    >
                        <RefreshCw size={20} />
                    </button>
                    <a
                        href={n8nUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-black rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20"
                    >
                        <ExternalLink size={16} />
                        Launch Externally
                    </a>
                </div>
            </header>

            {/* Iframe Container */}
            <div className="flex-grow relative bg-zinc-900 overflow-hidden">
                <iframe
                    id="n8n-iframe"
                    src={n8nUrl}
                    className="w-full h-full border-none"
                    title="n8n Automation"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        </div>
    );
};

export default Automation;
