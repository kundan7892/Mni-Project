import React, { useState, useMemo, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  ChevronRight, Heart, Star, Camera, Clock, Zap, Weight, Compass, Radio, 
  Battery, Package, CheckCircle2, ShieldAlert, ArrowRight, ChevronLeft, 
  Calendar, FileText, AlertCircle, Info, Store, MapPin, Sparkles
} from 'lucide-react'

import { dronesData } from '../data/drones'
import droneService from '../services/droneService'
import { getEnrichedDroneDetails } from '../data/droneDetailsHelper'
import DroneCard from '../components/DroneCard'
import ShopInfoCard from '../components/ShopInfoCard'
import Toast from '../components/Toast'

// Icon mapper for specifications
const getSpecIcon = (iconName) => {
  switch (iconName) {
    case 'Camera': return <Camera className="w-5 h-5 text-blue-600" />
    case 'Clock': return <Clock className="w-5 h-5 text-indigo-600" />
    case 'Zap': return <Zap className="w-5 h-5 text-amber-600" />
    case 'Weight': return <Weight className="w-5 h-5 text-purple-600" />
    case 'Compass': return <Compass className="w-5 h-5 text-emerald-600" />
    case 'Radio': return <Radio className="w-5 h-5 text-cyan-600" />
    case 'Battery': return <Battery className="w-5 h-5 text-rose-600" />
    case 'Package': return <Package className="w-5 h-5 text-teal-600" />
    default: return <Info className="w-5 h-5 text-blue-600" />
  }
}

// Drone Details Page Component
function DroneDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  // State: API fetched drone document
  const [apiDrone, setApiDrone] = useState(null)
  const [isLoadingApi, setIsLoadingApi] = useState(false)

  // Fetch drone from backend API
  useEffect(() => {
    let isMounted = true
    setIsLoadingApi(true)

    droneService
      .getDroneById(id)
      .then((data) => {
        if (isMounted && data) {
          setApiDrone(data)
        }
      })
      .catch((err) => {
        console.warn('API fetch failed, utilizing enriched catalog specification:', err.message)
      })
      .finally(() => {
        if (isMounted) setIsLoadingApi(false)
      })

    return () => {
      isMounted = false
    }
  }, [id])

  // 1. Fetch raw drone by route parameter ID (API first, fallback to mock dataset)
  const rawDrone = useMemo(() => {
    if (apiDrone) {
      return {
        id: apiDrone._id || apiDrone.id,
        name: apiDrone.name,
        brand: apiDrone.brand,
        model: apiDrone.model,
        category: apiDrone.category || 'Photography',
        pricePerDay: apiDrone.pricePerDay || (apiDrone.pricePerHour ? apiDrone.pricePerHour * 8 : 2500),
        pricePerHour: apiDrone.pricePerHour,
        securityDeposit: apiDrone.securityDeposit || 10000,
        rating: apiDrone.rating || 4.9,
        reviews: apiDrone.reviews || 0,
        camera: apiDrone.specifications?.camera || apiDrone.camera || '4K',
        flightTime: Number(apiDrone.specifications?.flightTime || apiDrone.flightTime || 35),
        gps: apiDrone.specifications?.gps ?? apiDrone.gps ?? true,
        availability:
          apiDrone.availability ||
          (apiDrone.status
            ? apiDrone.status.charAt(0).toUpperCase() + apiDrone.status.slice(1)
            : 'Available'),
        status: apiDrone.status || 'available',
        shopName: apiDrone.shopName || 'SkyRent Bengaluru',
        location: apiDrone.location || 'Bengaluru',
        image: apiDrone.image,
        popular: apiDrone.popular ?? true,
        recommended: apiDrone.recommended ?? true
      }
    }

    // Fallback: match by numeric ID or model
    return (
      dronesData.find((d) => String(d.id) === String(id)) ||
      dronesData.find((d) => d.model?.toLowerCase() === String(id).toLowerCase()) ||
      dronesData[0]
    )
  }, [id, apiDrone])

  // 2. Enrich drone data with extended specs, gallery, policies, reviews
  const drone = useMemo(() => {
    return getEnrichedDroneDetails(rawDrone)
  }, [rawDrone])

  // State: Active gallery image index
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  // State: Wishlisted state
  const [isWishlisted, setIsWishlisted] = useState(false)

  // State: Toast notification message
  const [toastMessage, setToastMessage] = useState(null)

  // State: Show all reviews toggle
  const [showAllReviews, setShowAllReviews] = useState(false)

  // Get 4 related drones (excluding current drone)
  const relatedDrones = useMemo(() => {
    if (!drone) return []
    const categoryMatches = dronesData.filter(
      (d) => d.id !== drone.id && d.category === drone.category
    )
    if (categoryMatches.length >= 4) {
      return categoryMatches.slice(0, 4)
    }
    // Fallback: pick any 4 drones
    const remaining = dronesData.filter((d) => d.id !== drone.id)
    return remaining.slice(0, 4)
  }, [drone])

  // Wishlist handler
  const handleToggleWishlist = () => {
    if (isWishlisted) {
      setIsWishlisted(false)
      setToastMessage({ text: `${drone.name} removed from wishlist`, type: 'info' })
    } else {
      setIsWishlisted(true)
      setToastMessage({ text: `${drone.name} added to your wishlist!`, type: 'wishlist' })
    }
    setTimeout(() => setToastMessage(null), 4000)
  }

  // State: Zoom modal open
  const [isZoomed, setIsZoomed] = useState(false)

  // Previous image handler
  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? drone.galleryImages.length - 1 : prev - 1))
  }

  // Next image handler
  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === drone.galleryImages.length - 1 ? 0 : prev + 1))
  }

  // NOT FOUND STATE
  if (!drone) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center px-4">
        <div className="text-center space-y-5">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-3xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Drone Not Found</h2>
          <p className="text-white/40 max-w-md mx-auto text-sm">The drone you're looking for may no longer be available.</p>
          <Link to="/drones" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[#001a2e] font-bold text-sm"
            style={{ background: 'linear-gradient(90deg, #00f0ff, #0066ff)' }}>
            <ChevronLeft className="w-4 h-4" /> Back to Drones
          </Link>
        </div>
      </div>
    )
  }

  const getBadgeStyle = (availability) => {
    switch (availability) {
      case 'Available': return 'bg-[#4ae176]/15 text-[#4ae176] border border-[#4ae176]/30'
      case 'Currently Rented': return 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
      case 'Maintenance': return 'bg-red-500/15 text-red-400 border border-red-500/30'
      default: return 'bg-white/10 text-white/60 border border-white/15'
    }
  }

  const displayedReviews = showAllReviews ? drone.reviewsList : drone.reviewsList.slice(0, 3)

  return (
    <div className="min-h-screen bg-[#050508] pb-20">

      {/* ── ZOOM MODAL ──────────────────────────────────────────────────── */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <button
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-all"
            onClick={() => setIsZoomed(false)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
          </button>
          <img
            src={drone.galleryImages[activeImageIndex]}
            alt={drone.name}
            className="max-w-[90vw] max-h-[88vh] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          {/* Zoom nav arrows */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-all"
            onClick={(e) => { e.stopPropagation(); handlePrevImage() }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-all"
            onClick={(e) => { e.stopPropagation(); handleNextImage() }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/40 text-xs"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {activeImageIndex + 1} / {drone.galleryImages.length} · Click outside to close
          </div>
        </div>
      )}

      {/* ── BREADCRUMB ──────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
        <nav className="flex items-center gap-2 text-xs text-white/35">
          <Link to="/" className="hover:text-white/70 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/drones" className="hover:text-white/70 transition-colors">Drones</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white/60 truncate max-w-[180px] sm:max-w-none">{drone.brand} {drone.name}</span>
        </nav>
      </div>

      {/* ── MAIN HERO: GALLERY + INFO ────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT: IMAGE GALLERY */}
          <div className="lg:col-span-7 space-y-3">

            {/* Main Image */}
            <div
              className="relative h-80 sm:h-96 md:h-[480px] rounded-2xl overflow-hidden cursor-zoom-in group"
              style={{ background: 'linear-gradient(135deg, #0d1117 0%, #090c12 100%)', border: '1px solid rgba(255,255,255,0.06)' }}
              onClick={() => setIsZoomed(true)}
              title="Click to zoom"
            >
              <img
                src={drone.galleryImages[activeImageIndex]}
                alt={drone.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Zoom hint */}
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm border border-white/15 text-white/70 text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>zoom_in</span>
                Click to zoom
              </div>

              {/* Top Badges */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white/80 border border-white/15">
                  {drone.brand}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${getBadgeStyle(drone.availability)}`}>
                  {drone.availability}
                </span>
              </div>

              {/* Prev / Next */}
              <button onClick={(e) => { e.stopPropagation(); handlePrevImage() }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 border border-white/15 text-white flex items-center justify-center transition-all backdrop-blur-sm cursor-pointer opacity-0 group-hover:opacity-100">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); handleNextImage() }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 border border-white/15 text-white flex items-center justify-center transition-all backdrop-blur-sm cursor-pointer opacity-0 group-hover:opacity-100">
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Counter */}
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white/60 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/10"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                {activeImageIndex + 1} / {drone.galleryImages.length}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-5 gap-2">
              {drone.galleryImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative h-16 sm:h-20 rounded-xl overflow-hidden transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'ring-2 ring-[#00f0ff] ring-offset-2 ring-offset-[#050508] scale-95'
                      : 'opacity-50 hover:opacity-80 hover:scale-105'
                  }`}
                  style={{ background: '#0d1117', border: activeImageIndex === idx ? '1px solid rgba(0,240,255,0.4)' : '1px solid rgba(255,255,255,0.05)' }}
                >
                  <img src={imgUrl} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

          </div>

          {/* RIGHT: DRONE INFO CARD */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl p-6 sm:p-8 space-y-6 sticky top-20"
              style={{ background: 'linear-gradient(145deg, #0d1117 0%, #090c12 100%)', border: '1px solid rgba(255,255,255,0.07)' }}>

              {/* Category + Model */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#00f0ff]"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}>{drone.category}</span>
                <span className="text-[11px] text-white/30" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  Model: {drone.model}
                </span>
              </div>

              {/* Name + Rating */}
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {drone.name}
                </h1>
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-white">{drone.rating}</span>
                  </div>
                  <span className="text-white/20">·</span>
                  <span className="text-white/40 text-xs">{drone.reviews} Verified Reviews</span>
                </div>
              </div>

              {/* Price Box */}
              <div className="rounded-xl p-4 space-y-1"
                style={{ background: 'rgba(0,240,255,0.04)', border: '1px solid rgba(0,240,255,0.12)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">Rental Price</span>
                  <span className="text-[10px] font-bold text-[#4ae176] bg-[#4ae176]/10 px-2 py-0.5 rounded-full border border-[#4ae176]/20"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}>Instant Approval</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    ₹{drone.pricePerDay.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-white/40">/ day</span>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-white/5 mt-1">
                  <span className="text-[11px] text-white/35">Security Deposit</span>
                  <span className="text-[12px] font-semibold text-white/60">₹{drone.securityDeposit.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Shop + Location */}
              <div className="flex items-center gap-4 text-xs text-white/40">
                <div className="flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-[#00f0ff]/60 shrink-0" />
                  <span className="text-white/60">{drone.shopName}</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{drone.location}</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3 pt-1">
                <button
                  onClick={() => navigate(`/booking/${drone.id}`)}
                  disabled={drone.availability !== 'Available'}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    drone.availability === 'Available'
                      ? 'text-[#001a2e] hover:opacity-90 active:scale-95'
                      : 'bg-white/5 text-white/25 cursor-not-allowed border border-white/8'
                  }`}
                  style={drone.availability === 'Available' ? {
                    background: 'linear-gradient(90deg, #00f0ff, #0066ff)',
                    boxShadow: '0 0 30px rgba(0,240,255,0.2)'
                  } : {}}
                >
                  <span>Rent This Drone</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleToggleWishlist}
                  className={`w-full py-3 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                    isWishlisted
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/25 hover:bg-rose-500/15'
                      : 'bg-white/3 text-white/50 border-white/10 hover:bg-white/8 hover:text-white/70'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-400 text-rose-400' : ''}`} />
                  <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-[11px] text-white/35">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4ae176] shrink-0" />
                  <span>100% Calibrated Gear</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-white/35">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4ae176] shrink-0" />
                  <span>Verified Shop Host</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── SPECIFICATIONS ──────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="rounded-2xl p-6 sm:p-8 space-y-6"
          style={{ background: 'linear-gradient(135deg, #0d1117 0%, #090c12 100%)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#00f0ff]"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}>Hardware</span>
            <h2 className="text-xl font-bold text-white mt-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Technical Specifications
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {drone.specifications.map((spec, idx) => (
              <div key={idx} className="p-4 rounded-xl flex items-start gap-3"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="p-2 rounded-lg shrink-0" style={{ background: 'rgba(0,240,255,0.08)', border: '1px solid rgba(0,240,255,0.15)' }}>
                  {getSpecIcon(spec.icon)}
                </div>
                <div>
                  <div className="text-[11px] text-white/35 mb-0.5">{spec.label}</div>
                  <div className="text-sm font-semibold text-white/90">{spec.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DESCRIPTION + WHAT'S INCLUDED ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          <div className="lg:col-span-8 rounded-2xl p-6 sm:p-8 space-y-5"
            style={{ background: 'linear-gradient(135deg, #0d1117 0%, #090c12 100%)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#4ae176]"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}>Overview</span>
              <h2 className="text-xl font-bold text-white mt-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Drone Overview & Description
              </h2>
              <p className="text-white/45 text-sm leading-relaxed mt-3">{drone.description}</p>
            </div>
            <div className="pt-4 border-t border-white/5 space-y-3">
              <h3 className="text-sm font-semibold text-white/70">Recommended Use Cases</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {drone.useCases.map((useCase, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl text-xs text-white/50"
                    style={{ background: 'rgba(0,240,255,0.04)', border: '1px solid rgba(0,240,255,0.08)' }}>
                    <Sparkles className="w-3.5 h-3.5 text-[#00f0ff]/60 shrink-0" />
                    <span>{useCase}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 rounded-2xl p-6 space-y-4"
            style={{ background: 'linear-gradient(135deg, #0d1117 0%, #090c12 100%)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#aac7ff]"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}>Kit Contents</span>
              <h2 className="text-xl font-bold text-white mt-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                What's Included
              </h2>
            </div>
            <div className="space-y-3">
              {drone.whatsIncluded.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#4ae176] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white/80">{item.title}</div>
                    <div className="text-white/35 text-[11px] mt-0.5">{item.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── RENTAL POLICIES ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="rounded-2xl p-6 sm:p-8 space-y-5"
          style={{ background: 'linear-gradient(135deg, #0d1117 0%, #090c12 100%)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#aac7ff]"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}>Policies</span>
            <h2 className="text-xl font-bold text-white mt-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Rental Rules & Terms
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: <FileText className="w-4 h-4 text-[#aac7ff]" />, title: 'Security Deposit', text: drone.rentalPolicies.securityDeposit },
              { icon: <Calendar className="w-4 h-4 text-[#4ae176]" />, title: 'Cancellation Policy', text: drone.rentalPolicies.cancellationPolicy },
              { icon: <Clock className="w-4 h-4 text-amber-400" />, title: 'Late Return & Minimum', text: `${drone.rentalPolicies.lateReturnPolicy} Min: ${drone.rentalPolicies.minRentalPeriod}.` },
            ].map((p, i) => (
              <div key={i} className="p-4 rounded-xl space-y-2"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex items-center gap-2 text-sm font-semibold text-white/80">{p.icon}{p.title}</div>
                <p className="text-xs text-white/35 leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-xl"
            style={{ background: 'rgba(255,180,0,0.05)', border: '1px solid rgba(255,180,0,0.15)' }}>
            <div className="flex items-center gap-2 font-semibold text-amber-400 text-xs mb-2">
              <ShieldAlert className="w-4 h-4" /> Operating Guidelines
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs text-white/35 pl-1">
              {drone.rentalPolicies.rules.map((rule, idx) => <li key={idx}>{rule}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* ── SHOP + REVIEWS ──────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-4">
            <ShopInfoCard shopInfo={drone.shopInfo} />
          </div>
          <div className="lg:col-span-8 rounded-2xl p-6 sm:p-8 space-y-5"
            style={{ background: 'linear-gradient(135deg, #0d1117 0%, #090c12 100%)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[#00f0ff]"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}>Feedback</span>
                <h2 className="text-xl font-bold text-white mt-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Customer Reviews</h2>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-bold text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />{drone.rating} / 5.0
              </div>
            </div>
            <div className="space-y-3">
              {displayedReviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-xl space-y-2"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={rev.avatar} alt={rev.name} className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10" />
                      <div>
                        <div className="text-xs font-semibold text-white/80">{rev.name}</div>
                        <div className="text-[11px] text-white/30">{rev.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-white/15'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed italic">"{rev.comment}"</p>
                </div>
              ))}
            </div>
            {drone.reviewsList.length > 3 && (
              <div className="text-center pt-1">
                <button onClick={() => setShowAllReviews(!showAllReviews)}
                  className="text-xs font-semibold text-[#00f0ff] bg-[#00f0ff]/8 hover:bg-[#00f0ff]/15 border border-[#00f0ff]/20 px-5 py-2 rounded-full transition-all cursor-pointer">
                  {showAllReviews ? 'Show Fewer' : `See All Reviews (${drone.reviewsList.length})`}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── RELATED DRONES ──────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#00f0ff]"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}>Similar Models</span>
            <h2 className="text-xl font-bold text-white mt-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Related Drones
            </h2>
          </div>
          <Link to="/drones" className="text-xs font-semibold text-white/40 hover:text-white flex items-center gap-1 transition-colors border border-white/10 hover:border-white/25 px-4 py-2 rounded-full">
            View All <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedDrones.map((item) => (
            <DroneCard key={item.id} drone={item} isWishlisted={false}
              onToggleWishlist={() => setToastMessage({ text: `${item.name} added to wishlist!`, type: 'wishlist' })} />
          ))}
        </div>
      </section>

      {/* Toast */}
      {toastMessage && (
        <Toast message={toastMessage.text} type={toastMessage.type} onClose={() => setToastMessage(null)} />
      )}

    </div>
  )
}

export default DroneDetails

