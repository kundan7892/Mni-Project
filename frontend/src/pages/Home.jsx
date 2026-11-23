import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import DroneCard from '../components/DroneCard'
import ShopCard from '../components/ShopCard'
import {
  categoriesData,
  stepsData,
  whyChooseData,
  featuredDrones,
  featuredShops,
  statsData,
} from '../data/mockData'

// ── Hero Slides ──────────────────────────────────────────────────────────────
const heroSlides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=2070&q=85',
    fallback: 'https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=2070&q=85',
    bgColor: '#0a1628',
    tag: 'Dual-Camera Drone for Travel Photography',
    title: 'Phantom Pro X',
    subtitle: 'Chase the View',
    description: 'Industry-leading 4K dual-camera imaging with intelligent flight modes for every mission.',
    cta: 'Rent Now',
    ctaLink: '/drones',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=2070&q=85',
    fallback: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=2070&q=85',
    bgColor: '#0d0f1a',
    tag: 'High-Speed FPV Racing Drone',
    title: 'AeroVision FPV',
    subtitle: 'Speed Meets Precision',
    description: 'Ultra-low latency control system with cinematic stabilization for adrenaline-fueled flights.',
    cta: 'Explore Fleet',
    ctaLink: '/drones',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1500534314209-a157d0ee5e8f?auto=format&fit=crop&w=2070&q=85',
    fallback: 'https://images.unsplash.com/photo-1455156218388-5e61b526818b?auto=format&fit=crop&w=2070&q=85',
    bgColor: '#0a1a0f',
    tag: 'Survey & Precision Agriculture',
    title: 'AgriSense X1',
    subtitle: 'Precision From Above',
    description: 'Multi-spectral sensors and GPS waypoints for complete field coverage and smart farming.',
    cta: 'Learn More',
    ctaLink: '/how-it-works',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=2070&q=85',
    fallback: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=2070&q=85',
    bgColor: '#050d1a',
    tag: 'Thermal & Night Vision Drone',
    title: 'Nighthawk Elite',
    subtitle: 'Dominate the Dark',
    description: 'Thermal imaging and night-vision capabilities for 24/7 surveillance and rescue operations.',
    cta: 'Book a Demo',
    ctaLink: '/drones',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=2070&q=85',
    fallback: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=2070&q=85',
    bgColor: '#101828',
    tag: 'Ultra-Portable Foldable Drone',
    title: 'Mini Scout 3',
    subtitle: 'Adventure Awaits',
    description: 'Weighs under 250g. Folds to pocket size. Shoots cinema-quality 4K wherever you go.',
    cta: 'View Details',
    ctaLink: '/drones',
  },
  {
    id: 6,
    image: '/drone-triple-lens.jpg',
    fallback: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=2070&q=85',
    bgColor: '#0d1a26',
    objectPosition: 'center center',
    objectFit: 'contain',
    tag: 'Triple-Lens Camera Drone',
    title: 'CineVision Pro',
    subtitle: 'Three Lenses. One Legend.',
    description: 'Triple Hasselblad lenses for wide, medium and tele — capture cinematic perfection from every angle.',
    cta: 'Rent Now',
    ctaLink: '/drones',
  },
  {
    id: 7,
    image: '/drone-aero-x4-front.png',
    fallback: '/drone-aero-x4-rear.png',
    bgColor: '#f0f2f5',
    objectPosition: 'center center',
    objectFit: 'contain',
    tag: 'Professional Camera Drone',
    title: 'Aero X4',
    subtitle: 'Built to Dominate the Sky.',
    description: 'Orange-tipped propellers, 4K stabilised camera and 35-min flight time — your creative powerhouse.',
    cta: 'Rent Now',
    ctaLink: '/drones',
  },
  {
    id: 8,
    image: '/drone-aero-x4-rear.png',
    fallback: '/drone-aero-x4-front.png',
    bgColor: '#f0f2f5',
    objectPosition: 'center center',
    objectFit: 'contain',
    tag: 'Aero X4 — Rear View',
    title: 'Aero X4',
    subtitle: 'Every Angle. Every Shot.',
    description: 'Smart obstacle avoidance, dual rear sensors, and intuitive auto-hover for flawless control.',
    cta: 'Explore',
    ctaLink: '/drones',
  },
  {
    id: 9,
    image: '/drone-phantom-top.png',
    fallback: '/drone-aero-x4-front.png',
    bgColor: '#f4f4f4',
    objectPosition: 'center center',
    objectFit: 'contain',
    tag: 'Top-Down View — Folded Compact',
    title: 'Phantom Air Pro',
    subtitle: 'Precision From Every Altitude.',
    description: 'Folds flat for easy transport. Unfolds in seconds for professional-grade imaging missions.',
    cta: 'View Details',
    ctaLink: '/drones',
  },
  {
    id: 10,
    image: '/drone-mini-scout.png',
    fallback: '/drone-aero-x4-front.png',
    bgColor: '#f2f4f6',
    objectPosition: 'center center',
    objectFit: 'contain',
    tag: 'Ultra-Compact 4K 60FPS Drone',
    title: 'Mini Scout Pro',
    subtitle: 'Pocket-Sized. Pro Results.',
    description: 'Under 250g. 4K at 60FPS. Carry it anywhere — mountains, cities, events. No limits.',
    cta: 'Book Now',
    ctaLink: '/drones',
  },
]

const categoryIcons = {
  Camera: 'photo_camera',
  Video: 'videocam',
  Sprout: 'eco',
  Map: 'map',
  Layers: 'layers',
  ShieldAlert: 'health_and_safety',
}

const featureIcons = {
  Grid: 'grid_view',
  ShieldCheck: 'verified_user',
  Zap: 'bolt',
  DollarSign: 'payments',
  Clock: 'schedule',
  Compass: 'explore',
}

const stepIcons = {
  Search: 'search',
  Sliders: 'tune',
  CalendarCheck: 'event_available',
  Send: 'send',
}

function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [imgErrors, setImgErrors] = useState({})
  const total = heroSlides.length

  const goTo = useCallback((index) => {
    if (animating) return
    setAnimating(true)
    setTimeout(() => {
      setCurrent(index)
      setAnimating(false)
    }, 400)
  }, [animating])

  const prev = () => goTo((current - 1 + total) % total)
  const next = useCallback(() => goTo((current + 1) % total), [current, goTo, total])

  useEffect(() => {
    const timer = setInterval(next, 5500)
    return () => clearInterval(timer)
  }, [next])

  const slide = heroSlides[current]

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {heroSlides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{
            opacity: i === current ? 1 : 0,
            backgroundColor: s.bgColor,
          }}
        >
          <img
            src={imgErrors[s.id] ? s.fallback : s.image}
            alt={s.title}
            className="w-full h-full"
            style={{
              objectFit: s.objectFit || 'cover',
              objectPosition: s.objectPosition || 'center center',
            }}
            loading={i === 0 ? 'eager' : 'lazy'}
            onError={() => setImgErrors(prev => ({ ...prev, [s.id]: true }))}
          />
          {/* Softer overlay so images are clearly visible */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-black/5" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-transparent" />
        </div>
      ))}

      {/* Text content */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
        style={{ opacity: animating ? 0 : 1, transition: 'opacity 0.4s ease' }}
      >
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#00f0ff] mb-3"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          {slide.tag}
        </p>
        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-2"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          {slide.title}
        </h1>
        <p
          className="text-xl sm:text-2xl font-semibold text-white/90 mb-4"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          {slide.subtitle}
        </p>
        <p className="text-[15px] text-white/70 max-w-md mb-8 leading-relaxed">
          {slide.description}
        </p>
        <Link
          to={slide.ctaLink}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-white/60 hover:border-white bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold text-[14px] transition-all duration-200 active:scale-95"
        >
          {slide.cta}
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
        </Link>
      </div>

      {/* Left Arrow */}
      <button
        onClick={prev}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-sm border border-white/20 text-white transition-all hover:scale-110 active:scale-95 z-10"
        aria-label="Previous"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>chevron_left</span>
      </button>

      {/* Right Arrow */}
      <button
        onClick={next}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-sm border border-white/20 text-white transition-all hover:scale-110 active:scale-95 z-10"
        aria-label="Next"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>chevron_right</span>
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                i === current ? 'w-6 h-1.5 bg-[#00f0ff]' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Slide counter */}
      <div
        className="absolute bottom-8 left-6 sm:left-10 text-white/50 text-[12px] z-10"
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
      >
        {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 right-6 sm:right-10 flex flex-col items-center gap-1 z-10">
        <span className="text-white/40 text-[10px] uppercase tracking-widest" style={{ fontFamily: 'JetBrains Mono, monospace' }}>Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  )
}

// ── Drone Video Section ───────────────────────────────────────────────────────
function DroneVideoSection() {
  return (
    <section className="relative bg-black overflow-hidden">
      {/* Section label */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
        <span
          className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-sm border border-[#00f0ff]/30 text-[#00f0ff] px-4 py-1.5 rounded-full text-[11px] font-semibold"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
          LIVE DEMO — WATCH IN ACTION
        </span>
      </div>

      {/* Video embed — 16:9 responsive */}
      <div className="relative w-full" style={{ paddingBottom: '52%' }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src="https://www.youtube.com/embed/D8oDMFQVP7Q?autoplay=1&mute=1&loop=1&playlist=D8oDMFQVP7Q&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1"
          title="Drone in Action"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
        {/* Top & bottom gradient blends */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
      </div>

      {/* Overlay text */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 z-20 pointer-events-none">
        <h2
          className="text-2xl sm:text-3xl font-bold text-white text-center tracking-tight"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          Experience the{' '}
          <span style={{ color: '#00f0ff', textShadow: '0 0 20px rgba(0,240,255,0.6)' }}>
            Future of Flight
          </span>
        </h2>
        <p className="text-[13px] text-white/50 mt-2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          AI-Powered Navigation · 4K Cinematic · Real-time Telemetry
        </p>
      </div>
    </section>
  )
}

function Home() {
  return (
    <div className="bg-[#0f131c] overflow-hidden">

      {/* ── HERO SLIDER ──────────────────────────────────────────── */}
      <HeroSlider />

      {/* ── DRONE VIDEO ──────────────────────────────────────────── */}
      <DroneVideoSection />

      {/* ── CATEGORIES ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <span
            className="text-[11px] font-bold uppercase tracking-widest text-[#00f0ff]"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            Browse by Use Case
          </span>
          <h2
            className="text-[32px] font-bold text-white mt-3 tracking-tight"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Drone Categories
          </h2>
          <p className="text-[14px] text-[#849495] mt-2">Find the perfect drone for your mission.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categoriesData.map((cat, i) => (
            <Link
              key={i}
              to="/drones"
              className="group flex flex-col items-center gap-3 p-6 bg-[#181c24] border border-[#3b494b]/40 hover:border-[#00f0ff]/50 rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(0,240,255,0.08)]"
            >
              <div className="w-12 h-12 rounded-xl bg-[#1c2028] border border-[#3b494b]/50 group-hover:border-[#00f0ff]/40 flex items-center justify-center transition-colors">
                <span
                  className="material-symbols-outlined text-[#849495] group-hover:text-[#00f0ff] transition-colors"
                  style={{ fontSize: '22px' }}
                >
                  {categoryIcons[cat.iconName] || 'flight'}
                </span>
              </div>
              <span className="text-[12px] font-semibold text-[#b9cacb] group-hover:text-[#00f0ff] text-center transition-colors leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED DRONES ──────────────────────────────────────────── */}
      <section className="bg-[#0a0e16] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <span
                className="text-[11px] font-bold uppercase tracking-widest text-[#00f0ff]"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                Top Rated Fleet
              </span>
              <h2
                className="text-[32px] font-bold text-white mt-2 tracking-tight"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Featured Drones
              </h2>
              <p className="text-[13px] text-[#849495] mt-1">Popular rental drones ready for dispatch.</p>
            </div>
            <Link
              to="/drones"
              className="flex items-center gap-1.5 text-[13px] text-[#b9cacb] hover:text-[#00f0ff] font-semibold transition-colors whitespace-nowrap border border-[#3b494b]/40 hover:border-[#00f0ff]/30 px-4 py-2 rounded-full"
            >
              View All
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredDrones.map((drone) => (
              <DroneCard key={drone.id} drone={drone} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span
              className="text-[11px] font-bold uppercase tracking-widest text-[#00f0ff]"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              Simple Process
            </span>
            <h2
              className="text-[32px] font-bold text-white mt-3 tracking-tight"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              How It Works
            </h2>
            <p className="text-[14px] text-[#849495] mt-2">Get in the air in four easy steps.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stepsData.map((step, i) => (
              <div
                key={i}
                className="relative p-6 bg-[#181c24] border border-[#3b494b]/40 hover:border-[#00f0ff]/30 rounded-2xl transition-all duration-300 hover:-translate-y-1.5 group"
              >
                <div
                  className="absolute top-5 right-5 font-black text-[40px] text-[#3b494b]/30 leading-none select-none"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#1c2028] border border-[#00f0ff]/20 flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined text-[#00f0ff]" style={{ fontSize: '22px' }}>
                    {stepIcons[step.iconName] || 'flight'}
                  </span>
                </div>
                <h3
                  className="text-[16px] font-semibold text-white mb-2"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {step.title}
                </h3>
                <p className="text-[13px] text-[#849495] leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BANNER ─────────────────────────────────────────────── */}
      <section className="bg-[#181c24] border-y border-[#3b494b]/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {statsData.map((stat, i) => (
              <div key={i} className="space-y-2">
                <div
                  className="text-[48px] sm:text-[56px] font-bold text-[#00f0ff] leading-none"
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    textShadow: '0 0 30px rgba(0,240,255,0.4)',
                  }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-[11px] text-[#849495] uppercase tracking-widest"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span
              className="text-[11px] font-bold uppercase tracking-widest text-[#4ae176]"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              Our Edge
            </span>
            <h2
              className="text-[32px] font-bold text-white mt-3 tracking-tight"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Why Choose DroneHub?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyChooseData.map((item, i) => (
              <div
                key={i}
                className="p-6 bg-[#181c24] border border-[#3b494b]/40 hover:border-[#4ae176]/30 rounded-2xl transition-all duration-300 hover:-translate-y-1.5 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#1c2028] border border-[#4ae176]/20 flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined text-[#4ae176]" style={{ fontSize: '22px' }}>
                    {featureIcons[item.iconName] || 'star'}
                  </span>
                </div>
                <h3
                  className="text-[16px] font-semibold text-white mb-2"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {item.title}
                </h3>
                <p className="text-[13px] text-[#849495] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED SHOPS ───────────────────────────────────────────── */}
      <section id="shops" className="bg-[#0a0e16] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <span
                className="text-[11px] font-bold uppercase tracking-widest text-[#aac7ff]"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                Certified Hosts
              </span>
              <h2
                className="text-[32px] font-bold text-white mt-2 tracking-tight"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Featured Rental Shops
              </h2>
              <p className="text-[13px] text-[#849495] mt-1">Rent from verified local store owners.</p>
            </div>
            <Link
              to="/drones"
              className="flex items-center gap-1.5 text-[13px] text-[#b9cacb] hover:text-[#aac7ff] font-semibold transition-colors whitespace-nowrap border border-[#3b494b]/40 hover:border-[#aac7ff]/30 px-4 py-2 rounded-full"
            >
              Explore
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ──────────────────────────────────────────────── */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[#0f131c]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#00f0ff]/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span
            className="inline-flex items-center gap-2 bg-[#1c2028] border border-[#00f0ff]/20 text-[#00f0ff] px-4 py-1.5 rounded-full text-[11px] font-semibold mb-6"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>bolt</span>
            Ready to Launch?
          </span>
          <h2
            className="text-[42px] sm:text-[56px] font-bold text-white tracking-tight leading-tight mb-5"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Take Your Next{' '}
            <span style={{ color: '#00f0ff', textShadow: '0 0 30px rgba(0,240,255,0.5)' }}>
              Flight
            </span>{' '}
            Today
          </h2>
          <p className="text-[16px] text-[#849495] leading-relaxed mb-10 max-w-2xl mx-auto">
            Join thousands of pilots and businesses discovering top drone technology through DroneHub.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/drones"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#00f0ff] text-[#002022] font-bold text-[14px] transition-all hover:bg-[#7df4ff] active:scale-95"
              style={{ boxShadow: '0 0 30px rgba(0,240,255,0.3)' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>flight_takeoff</span>
              Explore Drones
            </Link>
            <Link
              to="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white font-semibold text-[14px] transition-all active:scale-95"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home
