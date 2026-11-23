import React, { useState, useEffect, useCallback, useRef } from 'react'
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

// ── Hero Slides ──────────────────────────────────────────────────────────
const heroSlides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=2070&q=85',
    fallback: 'https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=2070&q=85',
    bgColor: '#050a14',
    tag: 'Dual-Camera Travel Drone',
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
    bgColor: '#08060f',
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
    bgColor: '#030d06',
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
    bgColor: '#030810',
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
    bgColor: '#080f1a',
    tag: 'Ultra-Portable Foldable Drone',
    title: 'Mini Scout 3',
    subtitle: 'Adventure Awaits',
    description: 'Weighs under 250g. Folds to pocket size. Shoots cinema-quality 4K wherever you go.',
    cta: 'View Details',
    ctaLink: '/drones',
  },
  {
    id: 6,
    image: '/drone-red-top.jpg',
    fallback: '/drone-red-side.jpg',
    bgColor: '#0d0808',
    objectPosition: 'center center',
    objectFit: 'contain',
    tag: 'Industrial Inspection Drone',
    title: 'Raptor X',
    subtitle: 'Red. Ready. Ruthless.',
    description: 'Military-grade body with red-accent motors. Built for infrastructure inspection and industrial surveillance.',
    cta: 'Rent Now',
    ctaLink: '/drones',
  },
  {
    id: 7,
    image: '/drone-red-side.jpg',
    fallback: '/drone-red-front.jpg',
    bgColor: '#0d0808',
    objectPosition: 'center center',
    objectFit: 'contain',
    tag: 'Heavy-Lift Payload Drone',
    title: 'Raptor X — Tactical',
    subtitle: 'Built for the Field.',
    description: 'Side-mounted payload bay, retractable landing gear, and 50-min flight time under full load.',
    cta: 'View Specs',
    ctaLink: '/drones',
  },
  {
    id: 8,
    image: '/drone-red-front.jpg',
    fallback: '/drone-red-top.jpg',
    bgColor: '#0d0808',
    objectPosition: 'center center',
    objectFit: 'contain',
    tag: 'Multi-Mission Combat Drone',
    title: 'Raptor X — Stealth',
    subtitle: 'Every Mission. Zero Compromise.',
    description: 'Low-profile body, wide-angle 6K camera and AI-powered target tracking for every terrain.',
    cta: 'Book Now',
    ctaLink: '/drones',
  },
]

// ── Use Cases data ────────────────────────────────────────────────────────
const useCases = [
  {
    id: 1,
    icon: 'eco',
    label: 'Agriculture',
    title: 'Smart Crop Management',
    desc: 'Multi-spectral imaging and precision spraying to monitor crop health and boost yield across every field.',
    img: 'https://images.unsplash.com/photo-1500534314209-a157d0ee5e8f?auto=format&fit=crop&w=900&q=80',
    color: '#4ae176',
  },
  {
    id: 2,
    icon: 'construction',
    label: 'Infrastructure',
    title: 'Survey & Inspection',
    desc: 'High-accuracy RTK mapping and thermal inspection of power lines, towers, and bridges at scale.',
    img: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=900&q=80',
    color: '#00f0ff',
  },
  {
    id: 3,
    icon: 'videocam',
    label: 'Cinematography',
    title: 'Cinematic Aerial Shots',
    desc: 'Hasselblad-grade optics and 3-axis gimbal stabilization for broadcast-quality aerial footage.',
    img: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=900&q=80',
    color: '#aac7ff',
  },
  {
    id: 4,
    icon: 'health_and_safety',
    label: 'Public Safety',
    title: 'Search & Rescue',
    desc: 'Thermal night-vision and real-time telemetry to locate and assist in emergency response missions.',
    img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=900&q=80',
    color: '#ff9966',
  },
]

// ── Product showcase data (DJI-style large cards) ─────────────────────────
const productShowcase = [
  {
    id: 'p1',
    badge: 'Best Seller',
    name: 'Raptor X Industrial',
    tagline: 'Fly Heavy. Fly Smart.',
    specs: ['6K Wide + Thermal', '50 Min Flight', 'IP54 Rated', 'AI Obstacle'],
    price: '₹150/day',
    image: '/drone-red-top.jpg',
    bgFrom: '#1a0505',
    bgTo: '#0d0808',
    accent: '#ff4444',
    ctaLink: '/drones',
  },
  {
    id: 'p2',
    badge: 'Pro Grade',
    name: 'Raptor X Tactical',
    tagline: 'Built for the Field.',
    specs: ['AI Target Track', '50 Min Flight', '6K Sensor', 'Payload Bay'],
    price: '₹160/day',
    image: '/drone-red-side.jpg',
    bgFrom: '#0a0a1a',
    bgTo: '#060612',
    accent: '#00f0ff',
    ctaLink: '/drones',
  },
  {
    id: 'p3',
    badge: 'New Arrival',
    name: 'AgriSense X1',
    tagline: 'Precision From Above.',
    specs: ['Multi-Spectral', '45 Min Flight', 'RTK GPS', '10L Tank'],
    price: '₹120/day',
    image: '/drone-phantom-top.png',
    bgFrom: '#061209',
    bgTo: '#040c05',
    accent: '#4ae176',
    ctaLink: '/drones',
  },
  {
    id: 'p4',
    badge: 'Most Booked',
    name: 'Phantom Pro X',
    tagline: 'Chase the View.',
    specs: ['4K Dual-Cam', '38 Min Flight', '12km Range', 'OmniSense'],
    price: '₹85/day',
    image: '/drone-triple-lens.jpg',
    bgFrom: '#050a16',
    bgTo: '#03080e',
    accent: '#aac7ff',
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

// ── Hero Slider ──────────────────────────────────────────────────────────
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
          style={{ opacity: i === current ? 1 : 0, backgroundColor: s.bgColor }}
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/5 to-transparent" />
        </div>
      ))}

      {/* Text — bottom-left DJI style */}
      <div
        className="absolute bottom-0 left-0 right-0 px-10 sm:px-16 lg:px-24 pb-14"
        style={{ opacity: animating ? 0 : 1, transition: 'opacity 0.4s ease' }}
      >
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#00f0ff] mb-3"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          {slide.tag}
        </p>
        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-3"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          {slide.title}
        </h1>
        <p
          className="text-xl sm:text-2xl font-medium text-white/80 mb-3"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          {slide.subtitle}
        </p>
        <p className="text-[14px] text-white/55 max-w-sm mb-8 leading-relaxed hidden sm:block">
          {slide.description}
        </p>
        <div className="flex items-center gap-4">
          <Link
            to={slide.ctaLink}
            className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full text-[13px] font-semibold text-[#001a2e] transition-all hover:opacity-90 active:scale-95"
            style={{ background: 'linear-gradient(90deg, #00f0ff, #0066ff)' }}
          >
            {slide.cta}
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>arrow_forward</span>
          </Link>
          <Link
            to="/drones"
            className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full border border-white/25 hover:border-white/50 bg-white/5 hover:bg-white/10 text-white text-[13px] font-semibold transition-all"
          >
            Explore Fleet
          </Link>
        </div>
      </div>

      {/* Right arrow */}
      <button
        onClick={next}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 text-white transition-all hover:scale-105 active:scale-95 z-10"
        aria-label="Next"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_right</span>
      </button>
      <button
        onClick={prev}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 text-white transition-all hover:scale-105 active:scale-95 z-10"
        aria-label="Prev"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_left</span>
      </button>

      {/* Dot Indicators — bottom center */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                i === current ? 'w-6 h-1 bg-white' : 'w-1 h-1 bg-white/35 hover:bg-white/60'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Counter */}
      <div
        className="absolute bottom-10 right-8 text-white/35 text-[11px] z-10"
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
      >
        {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </div>
    </section>
  )
}

// ── Drone Video Section ──────────────────────────────────────────────────
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
          DRONES IN ACTION — Real Use Cases
        </span>
      </div>

      {/* Video embed — 16:9 responsive */}
      <div className="relative w-full" style={{ paddingBottom: '52%' }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src="https://www.youtube.com/embed/kcfs1-ryKWE?autoplay=1&mute=1&loop=1&playlist=kcfs1-ryKWE&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&start=0&end=20&disablekb=1&fs=0"
          title="Drone in Action"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
        {/* Full transparent blocker — prevents ALL mouse hover so YouTube never shows controls, play button, bell, or end screen */}
        <div className="absolute inset-0 z-20" style={{ background: 'transparent', cursor: 'default' }} />
        {/* Cover top title bar completely */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-black z-30 pointer-events-none" />
        {/* Cover bottom "More videos" / YouTube logo end screen */}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black to-transparent z-30 pointer-events-none" />
        {/* Cover left side */}
        <div className="absolute top-0 left-0 bottom-0 w-10 bg-black z-30 pointer-events-none" />
        {/* Cover right side */}
        <div className="absolute top-0 right-0 bottom-0 w-10 bg-black z-30 pointer-events-none" />
      </div>

      {/* Overlay text */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 z-20 pointer-events-none">
        <h2
          className="text-2xl sm:text-3xl font-bold text-white text-center tracking-tight"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          Drones That{' '}
          <span style={{ color: '#00f0ff', textShadow: '0 0 20px rgba(0,240,255,0.6)' }}>
            Work For You
          </span>
        </h2>
        <p className="text-[13px] text-white/50 mt-2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          Agriculture Spraying · Search & Rescue · Infrastructure Inspection
        </p>
      </div>
    </section>
  )
}

// ── DJI-Style Product Showcase ────────────────────────────────────────────
function ProductShowcase() {
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  const scrollBy = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 420, behavior: 'smooth' })
  }

  return (
    <section className="relative bg-[#050508] py-12 overflow-hidden">
      {/* Subtle background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] rounded-full blur-[140px] pointer-events-none opacity-25"
        style={{ background: 'radial-gradient(ellipse, rgba(0,240,255,0.12) 0%, rgba(0,102,255,0.05) 50%, transparent 70%)' }}
      />

      {/* Header */}
      <div className="relative max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/[0.06]">
          {/* Left: Title & Subtitle */}
          <div className="max-w-xl">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/20 text-[#00f0ff] text-[11px] font-semibold mb-3"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
              OUR FLEET · COMMERCIAL & ENTERPRISE
            </div>
            <h2
              className="text-[34px] sm:text-[44px] font-bold text-white tracking-tight leading-[1.1]"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Drones Built for{' '}
              <span style={{ color: '#00f0ff', textShadow: '0 0 35px rgba(0,240,255,0.35)' }}>
                Every Mission
              </span>
            </h2>
            <p className="text-[14px] text-white/50 mt-3 leading-relaxed max-w-lg">
              Engineered for endurance, cinematic optics, and industrial payload. Certified and ready for deployment.
            </p>
          </div>

          {/* Middle & Right: Key Capabilities + Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6">
            {/* Quick feature highlights */}
            <div className="hidden xl:flex flex-col gap-1.5 text-[11px] text-white/60" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]" />
                <span>6K Cinema & Thermal Imaging</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ae176]" />
                <span>Up to 50 Min Extended Flight</span>
              </div>
            </div>

            {/* Actions: View All Button + Arrow Controls */}
            <div className="flex items-center gap-3">
              <Link
                to="/drones"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/15 hover:border-[#00f0ff]/40 bg-white/[0.04] hover:bg-[#00f0ff]/10 text-white hover:text-[#00f0ff] text-[12px] font-medium transition-all"
              >
                <span>View All Fleet</span>
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>arrow_forward</span>
              </Link>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => scrollBy(-1)}
                  disabled={!canScrollLeft}
                  className="w-9 h-9 rounded-full border border-white/15 bg-white/[0.03] flex items-center justify-center text-white/60 hover:text-white hover:border-[#00f0ff]/50 hover:bg-[#00f0ff]/10 disabled:opacity-20 disabled:hover:border-white/15 disabled:hover:bg-transparent transition-all cursor-pointer"
                  aria-label="Previous"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_left</span>
                </button>
                <button
                  onClick={() => scrollBy(1)}
                  disabled={!canScrollRight}
                  className="w-9 h-9 rounded-full border border-white/15 bg-white/[0.03] flex items-center justify-center text-white/60 hover:text-white hover:border-[#00f0ff]/50 hover:bg-[#00f0ff]/10 disabled:opacity-20 disabled:hover:border-white/15 disabled:hover:bg-transparent transition-all cursor-pointer"
                  aria-label="Next"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal scroll cards */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto scrollbar-hide pl-6 sm:pl-10 lg:pl-16 pr-6"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {productShowcase.map((p) => (
          <div
            key={p.id}
            className="shrink-0 relative rounded-2xl overflow-hidden group cursor-pointer"
            style={{
              width: 'clamp(300px, 38vw, 420px)',
              minHeight: '520px',
              background: `linear-gradient(160deg, ${p.bgFrom} 0%, ${p.bgTo} 100%)`,
              scrollSnapAlign: 'start',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            {/* Badge */}
            <div className="absolute top-5 left-5 z-10">
              <span
                className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{
                  color: p.accent,
                  background: `${p.accent}18`,
                  border: `1px solid ${p.accent}40`,
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              >
                {p.badge}
              </span>
            </div>

            {/* Drone Image — large, centered */}
            <div className="w-full h-64 flex items-center justify-center pt-8 px-6">
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                style={{ filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.8))' }}
              />
            </div>

            {/* Content */}
            <div className="p-6 mt-2">
              <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: p.accent, fontFamily: 'JetBrains Mono, monospace' }}>
                DroneHub Series
              </p>
              <h3
                className="text-[24px] font-bold text-white tracking-tight mb-1"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {p.name}
              </h3>
              <p className="text-[14px] text-white/50 mb-5">{p.tagline}</p>

              {/* Specs row */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                {p.specs.map((spec, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 text-[11px] text-white/60"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    <span
                      className="w-1 h-1 rounded-full shrink-0"
                      style={{ backgroundColor: p.accent }}
                    />
                    {spec}
                  </div>
                ))}
              </div>

              {/* Price + CTA */}
              <div className="flex items-center justify-between">
                <span
                  className="text-[20px] font-bold"
                  style={{ color: p.accent, fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {p.price}
                </span>
                <Link
                  to={p.ctaLink}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-[12px] font-semibold transition-all hover:scale-105 active:scale-95"
                  style={{
                    color: p.accent,
                    border: `1px solid ${p.accent}50`,
                    background: `${p.accent}10`,
                  }}
                >
                  Rent Now
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Accent glow */}
            <div
              className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
              style={{ background: `linear-gradient(to top, ${p.accent}08, transparent)` }}
            />
          </div>
        ))}

        {/* "See all" card */}
        <Link
          to="/drones"
          className="shrink-0 rounded-2xl border border-white/8 bg-white/3 hover:bg-white/6 flex flex-col items-center justify-center gap-4 transition-all group"
          style={{ width: 'clamp(200px, 20vw, 260px)', minHeight: '520px', scrollSnapAlign: 'start' }}
        >
          <div className="w-14 h-14 rounded-full border border-white/15 flex items-center justify-center group-hover:border-[#00f0ff]/40 transition-colors">
            <span className="material-symbols-outlined text-white/40 group-hover:text-[#00f0ff] transition-colors" style={{ fontSize: '24px' }}>
              arrow_forward
            </span>
          </div>
          <span className="text-[14px] font-semibold text-white/50 group-hover:text-white/80 transition-colors text-center px-6">
            View All Drones
          </span>
        </Link>
      </div>
    </section>
  )
}

// ── Use Cases Section ─────────────────────────────────────────────────────
function UseCasesSection() {
  return (
    <section className="bg-[#030508] py-12">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="text-center mb-8">
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#4ae176]"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            Applications
          </span>
          <h2
            className="text-[36px] sm:text-[44px] font-bold text-white mt-3 tracking-tight"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            One Platform. Every Use Case.
          </h2>
          <p className="text-[15px] text-white/40 mt-3 max-w-xl mx-auto">
            From crop spraying to cinematic aerial photography — DroneHub covers every professional mission.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {useCases.map((uc) => (
            <Link
              to="/drones"
              key={uc.id}
              className="group relative rounded-2xl overflow-hidden cursor-pointer"
              style={{ minHeight: '340px' }}
            >
              {/* Background image */}
              <img
                src={uc.img}
                alt={uc.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(to top, ${uc.color}18, transparent)` }}
              />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div
                  className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center"
                  style={{ background: `${uc.color}20`, border: `1px solid ${uc.color}40` }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px', color: uc.color }}>
                    {uc.icon}
                  </span>
                </div>
                <span
                  className="text-[10px] font-bold uppercase tracking-widest mb-1"
                  style={{ color: uc.color, fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {uc.label}
                </span>
                <h3
                  className="text-[18px] font-bold text-white mb-2 leading-tight"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {uc.title}
                </h3>
                <p className="text-[12px] text-white/50 leading-relaxed line-clamp-2">
                  {uc.desc}
                </p>
                <div
                  className="flex items-center gap-1 mt-4 text-[12px] font-semibold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                  style={{ color: uc.color }}
                >
                  Explore drones
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Main Home ─────────────────────────────────────────────────────────────
function Home() {
  return (
    <div className="bg-[#050508] overflow-hidden">

      {/* ── HERO SLIDER ─────────────────────────────────────────────────── */}
      <HeroSlider />

      {/* ── DRONE VIDEO ─────────────────────────────────────────────────── */}
      <DroneVideoSection />

      {/* ── PRODUCT SHOWCASE (DJI-style horizontal cards) ───────────────── */}
      <ProductShowcase />

      {/* ── USE CASES ───────────────────────────────────────────────────── */}
      <UseCasesSection />

      {/* ── CATEGORIES ──────────────────────────────────────────────────── */}
      <section className="bg-[#07090e] py-10">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center mb-6">
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#00f0ff]"
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
            <p className="text-[14px] text-white/35 mt-2">Find the perfect drone for your mission.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {categoriesData.map((cat, i) => (
              <Link
                key={i}
                to="/drones"
                className="group flex flex-col items-center gap-3 p-6 bg-white/3 border border-white/5 hover:border-[#00f0ff]/30 rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:bg-white/6"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 group-hover:bg-[#00f0ff]/10 border border-white/8 group-hover:border-[#00f0ff]/30 flex items-center justify-center transition-all">
                  <span
                    className="material-symbols-outlined text-white/40 group-hover:text-[#00f0ff] transition-colors"
                    style={{ fontSize: '22px' }}
                  >
                    {categoryIcons[cat.iconName] || 'flight'}
                  </span>
                </div>
                <span className="text-[12px] font-medium text-white/50 group-hover:text-white/90 text-center transition-colors leading-tight">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED DRONES ─────────────────────────────────────────────── */}
      <section className="bg-[#050508] py-10">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <span
                className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#00f0ff]"
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
              <p className="text-[13px] text-white/35 mt-1">Popular rental drones ready for dispatch.</p>
            </div>
            <Link
              to="/drones"
              className="flex items-center gap-1.5 text-[13px] text-white/40 hover:text-white font-medium transition-colors whitespace-nowrap border border-white/10 hover:border-white/25 px-4 py-2 rounded-full"
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

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section className="bg-[#07090e] py-10">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center mb-6">
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#00f0ff]"
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
            <p className="text-[14px] text-white/35 mt-2">Get in the air in four easy steps.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stepsData.map((step, i) => (
              <div
                key={i}
                className="relative p-6 bg-white/3 border border-white/5 hover:border-[#00f0ff]/20 rounded-2xl transition-all duration-300 hover:-translate-y-1.5 group"
              >
                <div
                  className="absolute top-5 right-5 font-black text-[40px] text-white/5 leading-none select-none"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="w-11 h-11 rounded-xl bg-[#00f0ff]/8 border border-[#00f0ff]/15 flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined text-[#00f0ff]" style={{ fontSize: '20px' }}>
                    {stepIcons[step.iconName] || 'flight'}
                  </span>
                </div>
                <h3
                  className="text-[16px] font-semibold text-white mb-2"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {step.title}
                </h3>
                <p className="text-[13px] text-white/40 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BANNER ────────────────────────────────────────────────── */}
      <section className="border-y border-white/5 py-8" style={{ background: 'linear-gradient(135deg, #07090e 0%, #0a0d15 100%)' }}>
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {statsData.map((stat, i) => (
              <div key={i} className="space-y-2">
                <div
                  className="text-[48px] sm:text-[56px] font-bold text-[#00f0ff] leading-none"
                  style={{ fontFamily: 'Space Grotesk, sans-serif', textShadow: '0 0 40px rgba(0,240,255,0.3)' }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-[11px] text-white/35 uppercase tracking-widest"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ───────────────────────────────────────────────── */}
      <section className="bg-[#050508] py-10">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center mb-6">
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#4ae176]"
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
                className="p-6 bg-white/3 border border-white/5 hover:border-[#4ae176]/25 rounded-2xl transition-all duration-300 hover:-translate-y-1.5 group"
              >
                <div className="w-11 h-11 rounded-xl bg-[#4ae176]/8 border border-[#4ae176]/15 flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined text-[#4ae176]" style={{ fontSize: '20px' }}>
                    {featureIcons[item.iconName] || 'star'}
                  </span>
                </div>
                <h3
                  className="text-[16px] font-semibold text-white mb-2"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {item.title}
                </h3>
                <p className="text-[13px] text-white/40 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED SHOPS ──────────────────────────────────────────────── */}
      <section id="shops" className="bg-[#07090e] py-10">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <span
                className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#aac7ff]"
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
              <p className="text-[13px] text-white/35 mt-1">Rent from verified local store owners.</p>
            </div>
            <Link
              to="/drones"
              className="flex items-center gap-1.5 text-[13px] text-white/40 hover:text-white font-medium transition-colors whitespace-nowrap border border-white/10 hover:border-white/25 px-4 py-2 rounded-full"
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

      {/* ── CTA SECTION ─────────────────────────────────────────────────── */}
      <section className="relative py-14 overflow-hidden bg-[#050508]">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full blur-[150px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(0,240,255,0.08) 0%, transparent 70%)' }}
        />
        <div className="relative max-w-4xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
          <span
            className="inline-flex items-center gap-2 border border-white/10 text-white/50 px-4 py-1.5 rounded-full text-[11px] font-semibold mb-6"
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
            <span style={{ color: '#00f0ff', textShadow: '0 0 40px rgba(0,240,255,0.4)' }}>
              Flight
            </span>{' '}
            Today
          </h2>
          <p className="text-[16px] text-white/35 leading-relaxed mb-5 max-w-2xl mx-auto">
            Join thousands of pilots and businesses discovering top drone technology through DroneHub.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/drones"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-[#001a2e] font-bold text-[14px] transition-all hover:opacity-90 active:scale-95"
              style={{ background: 'linear-gradient(90deg, #00f0ff, #0066ff)', boxShadow: '0 0 40px rgba(0,240,255,0.2)' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>flight_takeoff</span>
              Explore Drones
            </Link>
            <Link
              to="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-white/15 hover:border-white/30 bg-white/3 hover:bg-white/8 text-white font-semibold text-[14px] transition-all active:scale-95"
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
