'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Menu, X, ArrowRight, Play, Sparkles } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

export function Hero() {
  const [isMuted, setIsMuted] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Video setup
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true
      const playPromise = videoRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was prevented
        })
      }
    }
  }, [])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted
      videoRef.current.volume = isMuted ? 0 : 0.6
    }
  }, [isMuted])

  const capabilities = ["AI Strategy", "Visual Narratives", "Digital Identity", "Motion Design"]

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0c]">
      {/* Background Video with Overlay */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="h-full w-full object-cover scale-105 filter brightness-[0.5] contrast-[1.2] grayscale-[0.3]"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="https://mojli.s3.us-east-2.amazonaws.com/Mojli+Website+upscaled+(12mb).webm" type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0c]/80 via-transparent to-[#0a0a0c]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,12,0.8)_100%)]" />
      </div>

      {/* Floating Elements / Creative Layer */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        <div className="easya-glow-1" />
        <div className="easya-glow-2" />
        <div className="absolute inset-0 easya-grid opacity-10" />
      </div>

      {/* Styled Hero Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-[100] px-6 transition-all duration-700 flex justify-center ${isScrolled ? 'mt-4' : 'mt-8'}`}
      >
        <div className="max-w-[1400px] w-full flex justify-center">
          <div
            className={`
              flex items-center justify-between transition-all duration-700 ease-in-out
              ${isScrolled
                ? 'w-full max-w-[1400px] glass-card px-10 py-3 rounded-full'
                : 'w-full max-w-[1400px] glass-card px-10 py-5 rounded-[2rem] border-white/5'
              }
            `}
          >
            {/* Brand Logo */}
            <Link to="/" className="group flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500 blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-700 rounded-full" />
                <img
                  src="/averqon-logo.jpg"
                  alt="Averqon Logo"
                  className="h-12 w-12 relative z-10 transition-transform duration-700 group-hover:rotate-[360deg] group-hover:scale-110 rounded-xl"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white group-hover:text-purple-400 transition-colors uppercase">
                Averqon
              </span>
            </Link>

            {/* Desktop Nav - Centered Menu style */}
            <div className="hidden lg:flex items-center gap-2">
              {[
                { name: 'About', href: '/about' },
                { name: 'Services', href: '/services' },
                { name: 'Portfolio', href: '/portfolio' },
                { name: 'Product', href: '/averqon-billing' },
                { name: 'Careers', href: '/careers' },
                { name: 'Blog', href: '/blog' }
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="px-5 py-2 text-xs font-black text-white/40 hover:text-white uppercase tracking-[0.2em] transition-all relative group overflow-hidden"
                >
                  <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-full block">
                    {item.name}
                  </span>
                  <span className="absolute top-full left-5 text-purple-400 transition-transform duration-300 group-hover:-translate-y-full block">
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>

            {/* Action Group */}
            <div className="flex items-center space-x-4">
              {/* Cinematic Mute Toggle */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="w-10 h-10 flex items-center justify-center rounded-full glass-card hover:bg-white/10 text-white transition-all group overflow-hidden"
                title={isMuted ? "Unmute Cinematic" : "Mute Cinematic"}
              >
                <div className="transition-transform duration-500 group-hover:scale-125">
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </div>
              </button>

              <Link
                to="/contact"
                className="flex btn-easya px-5 py-2 sm:px-8 sm:py-3 text-[10px] rounded-full uppercase tracking-widest"
              >
                START PROJECT
                <ArrowRight size={14} className="ml-2 transition-transform group-hover:translate-x-1 hidden xs:block" />
              </Link>

              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full glass-card text-white active:scale-95 transition-transform"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content Area */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-full mb-6 text-purple-400">
            <Sparkles size={14} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Engineering the Future</span>
          </div>

          <h1 className="text-[clamp(2.5rem,8vw,6rem)] font-black leading-[0.9] text-white select-none  ">
            <motion.span
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="block"
            >
              DIGITAL <span className="text-transparent px-2" style={{ WebkitTextStroke: '2px white' }}>EXCELLENCE</span>
            </motion.span>
            <motion.span
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 1 }}
              className="block mt-4 text-[#a855f7]"
            >
              SIMPLIFIED
            </motion.span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="max-w-xl text-lg md:text-xl text-white/50 font-light leading-relaxed mb-12"
        >
          Breaking physical barriers through neural rendering and cinematic AI. We don't just film; we synthesize reality.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
        >
          <button className="btn-easya !rounded-2xl group overflow-hidden">
            <span className="relative z-10">BOOK A SHOWREEL</span>
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
          </button>

          <button className="flex items-center space-x-3 text-white font-bold group">
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-[#a855f7] group-hover:border-[#a855f7] transition-all text-white">
              <Play size={20} fill="currentColor" />
            </div>
            <span className="tracking-widest text-xs">WATCH TRAILER</span>
          </button>
        </motion.div>
      </div>

      {/* Capability Tags - Creative Sidebar */}
      <div className="absolute bottom-12 right-12 z-30 hidden lg:flex flex-col items-end space-y-4">
        {capabilities.map((tech, idx) => (
          <motion.div
            key={tech}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5 + idx * 0.1 }}
            className="flex items-center space-x-3"
          >
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{tech}</span>
            <div className="w-8 h-[1px] bg-white/10" />
          </motion.div>
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-12 z-30 flex items-center space-x-6"
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
            <motion.div
              animate={{ y: [0, 48] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute top-0 left-0 w-full h-4 bg-[#a855f7]"
            />
          </div>
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em] rotate-90 translate-y-8">SCROLL</span>
        </div>
      </motion.div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[200] md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-zinc-950 z-[210] p-12 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-16">
                  <span className="font-bagel text-2xl text-white">AVERQON</span>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="text-white">
                    <X size={32} />
                  </button>
                </div>

                <nav className="space-y-6 text-3xl font-black   text-white">
                  {[
                    { name: 'Home', href: '/' },
                    { name: 'About', href: '/about' },
                    { name: 'Services', href: '/services' },
                    { name: 'Portfolio', href: '/portfolio' },
                    { name: 'Product', href: '/averqon-billing' },
                    { name: 'Careers', href: '/careers' },
                    { name: 'Blog', href: '/blog' },
                    { name: 'Contact', href: '/contact' }
                  ].map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block hover:text-indigo-500 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="pt-12 border-t border-white/5 space-y-6">
                <p className="text-white/40 text-sm">muneeswaranmd2004@gmail.com</p>
                <div className="flex space-x-6 grayscale opacity-50">
                  <Link to="#" className="text-white text-xs font-bold uppercase tracking-widest">Instagram</Link>
                  <Link to="#" className="text-white text-xs font-bold uppercase tracking-widest">LinkedIn</Link>
                  <Link to="#" className="text-white text-xs font-bold uppercase tracking-widest">Vimeo</Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Hero;
