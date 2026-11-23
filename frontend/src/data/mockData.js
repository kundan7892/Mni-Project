// DroneHub Centralized Mock Data
// Pure JavaScript data objects for landing page, categories, drones, shops, and FAQs

export const categoriesData = [
  {
    id: 'photo',
    name: 'Photography',
    iconName: 'Camera',
    description: 'High-resolution sensor drones designed for breathtaking landscapes and architectural imagery.',
    droneCount: '120+ Models',
    bgGradient: 'from-blue-500/10 to-indigo-500/10',
    iconColor: 'text-blue-600'
  },
  {
    id: 'video',
    name: 'Videography',
    iconName: 'Video',
    description: 'Cinematic FPV and gimbal-stabilized rigs equipped with 4K/8K ProRes recording support.',
    droneCount: '95+ Models',
    bgGradient: 'from-purple-500/10 to-pink-500/10',
    iconColor: 'text-purple-600'
  },
  {
    id: 'agri',
    name: 'Agriculture',
    iconName: 'Sprout',
    description: 'Multispectral payload drones for crop health analysis, multispectral scanning, and field spraying.',
    droneCount: '45+ Models',
    bgGradient: 'from-emerald-500/10 to-teal-500/10',
    iconColor: 'text-emerald-600'
  },
  {
    id: 'survey',
    name: 'Surveying',
    iconName: 'Map',
    description: 'High-accuracy RTK/PPK surveying drones for boundary mapping, land development, and GIS integration.',
    droneCount: '60+ Models',
    bgGradient: 'from-amber-500/10 to-orange-500/10',
    iconColor: 'text-amber-600'
  },
  {
    id: 'mapping',
    name: 'Mapping',
    iconName: 'Layers',
    description: '3D photogrammetry and topographic mapping systems producing millimeter-precise spatial models.',
    droneCount: '50+ Models',
    bgGradient: 'from-cyan-500/10 to-blue-500/10',
    iconColor: 'text-cyan-600'
  },
  {
    id: 'inspect',
    name: 'Industrial Inspection',
    iconName: 'ShieldAlert',
    description: 'Thermal and LiDAR inspection drones built for power lines, wind turbines, and infrastructure checks.',
    droneCount: '40+ Models',
    bgGradient: 'from-rose-500/10 to-red-500/10',
    iconColor: 'text-rose-600'
  }
]

export const stepsData = [
  {
    stepNumber: '01',
    title: 'Explore',
    description: 'Browse verified drones from certified rental shops near your location or destination.',
    iconName: 'Search'
  },
  {
    stepNumber: '02',
    title: 'Choose',
    description: 'Filter by payload specs, flight time, battery count, and rental pricing to match your mission.',
    iconName: 'Sliders'
  },
  {
    stepNumber: '03',
    title: 'Book',
    description: 'Select custom rental dates, submit instant requests, and secure seamless digital protection.',
    iconName: 'CalendarCheck'
  },
  {
    stepNumber: '04',
    title: 'Fly',
    description: 'Pick up your ready-to-fly kit or receive direct delivery, then enjoy your aerial mission.',
    iconName: 'Send'
  }
]

export const whyChooseData = [
  {
    id: 1,
    title: 'Wide Drone Selection',
    description: 'From compact FPV quadcopters to heavy-lift thermal mappers, access top industry brands instantly.',
    iconName: 'Grid'
  },
  {
    id: 2,
    title: 'Trusted Rental Shops',
    description: 'Every shop on DroneHub undergoes strict identity, equipment health, and safety verification.',
    iconName: 'ShieldCheck'
  },
  {
    id: 3,
    title: 'Easy Booking Process',
    description: 'Transparent scheduling, automated availability check, and instant digital confirmation.',
    iconName: 'Zap'
  },
  {
    id: 4,
    title: 'Transparent Pricing',
    description: 'No hidden maintenance fees or deposit surprises. Pay clear daily or weekly fixed rates.',
    iconName: 'DollarSign'
  },
  {
    id: 5,
    title: 'Rental Management',
    description: 'Track ongoing active rentals, extend booking slots, and download compliance invoices in 1-click.',
    iconName: 'Clock'
  },
  {
    id: 6,
    title: 'Future-Ready Tracking',
    description: 'Built-in real-time flight telemetry logging, maintenance scheduling, and location tracking.',
    iconName: 'Compass'
  }
]

export const featuredDrones = [
  {
    id: 'd1',
    name: 'Mavic 3 Enterprise Thermal',
    brand: 'DJI',
    category: 'Industrial Inspection',
    camera: '640x512 Thermal + 48MP Visual',
    flightTime: '45 Mins',
    pricePerDay: 120,
    rating: 4.9,
    reviewsCount: 48,
    image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80',
    badge: 'Popular'
  },
  {
    id: 'd2',
    name: 'Inspire 3 Pro Cinema 8K',
    brand: 'DJI',
    category: 'Videography',
    camera: 'Full-Frame 8K ProRes RAW',
    flightTime: '28 Mins',
    pricePerDay: 250,
    rating: 5.0,
    reviewsCount: 32,
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
    badge: 'Pro Choice'
  },
  {
    id: 'd3',
    name: 'Agras T40 Multispectral',
    brand: 'DJI',
    category: 'Agriculture',
    camera: 'Multispectral + 40L Spray Payload',
    flightTime: '30 Mins',
    pricePerDay: 180,
    rating: 4.8,
    reviewsCount: 19,
    image: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=800&q=80',
    badge: 'Heavy Lift'
  },
  {
    id: 'd4',
    name: 'Evo II Dual 640T V3',
    brand: 'Autel Robotics',
    category: 'Surveying & Mapping',
    camera: '8K Ultra HD + 640 Thermal',
    flightTime: '38 Mins',
    pricePerDay: 95,
    rating: 4.7,
    reviewsCount: 27,
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=800&q=80',
    badge: 'Top Rated'
  },
  {
    id: 'd5',
    name: 'Phantom 4 RTK Precision Mapper',
    brand: 'DJI',
    category: 'Mapping',
    camera: '20MP 1-inch CMOS Sensor',
    flightTime: '30 Mins',
    pricePerDay: 110,
    rating: 4.9,
    reviewsCount: 56,
    image: 'https://images.unsplash.com/photo-1521405924368-64c5b84bec60?auto=format&fit=crop&w=800&q=80',
    badge: 'High Accuracy'
  },
  {
    id: 'd6',
    name: 'Avata FPV Explorer Kit',
    brand: 'AeroVision',
    category: 'Videography',
    camera: '4K/60fps 155° Super-Wide',
    flightTime: '18 Mins',
    pricePerDay: 65,
    rating: 4.9,
    reviewsCount: 84,
    image: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=800&q=80',
    badge: 'Trending'
  },
  {
    id: 'd7',
    name: 'Aero X4 Pro',
    brand: 'AeroHub',
    category: 'Photography',
    camera: '4K 60FPS Stabilised Camera',
    flightTime: '35 Mins',
    pricePerDay: 85,
    rating: 4.8,
    reviewsCount: 42,
    image: '/drone-aero-x4-front.png',
    badge: 'New Arrival'
  },
  {
    id: 'd8',
    name: 'Aero X4 Rear Edition',
    brand: 'AeroHub',
    category: 'Videography',
    camera: '4K HDR + Dual Rear Sensors',
    flightTime: '35 Mins',
    pricePerDay: 85,
    rating: 4.7,
    reviewsCount: 31,
    image: '/drone-aero-x4-rear.png',
    badge: 'Popular'
  },
  {
    id: 'd9',
    name: 'Phantom Air Pro',
    brand: 'AeroHub',
    category: 'Mapping',
    camera: '20MP 1-inch CMOS + RTK',
    flightTime: '32 Mins',
    pricePerDay: 110,
    rating: 4.9,
    reviewsCount: 58,
    image: '/drone-phantom-top.png',
    badge: 'High Accuracy'
  },
  {
    id: 'd10',
    name: 'Mini Scout Pro',
    brand: 'AeroHub',
    category: 'Photography',
    camera: '4K 60FPS Ultra-Compact',
    flightTime: '28 Mins',
    pricePerDay: 45,
    rating: 4.8,
    reviewsCount: 97,
    image: '/drone-mini-scout.png',
    badge: 'Best Value'
  },
  {
    id: 'd11',
    name: 'Raptor X Industrial',
    brand: 'AeroHub',
    category: 'Industrial Inspection',
    camera: '6K Wide-Angle + Thermal',
    flightTime: '50 Mins',
    pricePerDay: 150,
    rating: 4.9,
    reviewsCount: 23,
    image: '/drone-red-top.jpg',
    badge: 'Heavy Duty'
  },
  {
    id: 'd12',
    name: 'Raptor X Tactical',
    brand: 'AeroHub',
    category: 'Industrial Inspection',
    camera: 'AI Target Tracking + 6K',
    flightTime: '50 Mins',
    pricePerDay: 160,
    rating: 4.8,
    reviewsCount: 17,
    image: '/drone-red-side.jpg',
    badge: 'Pro Grade'
  },
  {
    id: 'd13',
    name: 'Raptor X Stealth',
    brand: 'AeroHub',
    category: 'Industrial Inspection',
    camera: '6K Low-Profile Camera',
    flightTime: '48 Mins',
    pricePerDay: 155,
    rating: 4.7,
    reviewsCount: 12,
    image: '/drone-red-front.jpg',
    badge: 'New Arrival'
  }
]

export const featuredShops = [
  {
    id: 's1',
    name: 'SkyHigh Aerial Solutions',
    location: 'San Francisco, CA',
    rating: 4.9,
    reviewsCount: 124,
    availableDrones: 28,
    description: 'Premier camera drone rentals and licensed pilot assistance for film, real estate, and events.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    verified: true
  },
  {
    id: 's2',
    name: 'AeroTech Industrial Rentals',
    location: 'Austin, TX',
    rating: 4.8,
    reviewsCount: 92,
    availableDrones: 45,
    description: 'Specialized thermal inspection, agriculture payload rigs, and RTK surveying equipment.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    verified: true
  },
  {
    id: 's3',
    name: 'Pacific Coast Drone Hub',
    location: 'Seattle, WA',
    rating: 5.0,
    reviewsCount: 64,
    availableDrones: 32,
    description: 'High-end cinema gear, extra flight batteries, and quick 24-hour delivery across the Bay Area.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    verified: true
  },
  {
    id: 's4',
    name: 'Horizon Flight Fleet',
    location: 'Miami, FL',
    rating: 4.7,
    reviewsCount: 51,
    availableDrones: 19,
    description: 'Flexible weekend rentals, FPV freestyle kits, and customized enterprise drone fleet rentals.',
    image: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=800&q=80',
    verified: true
  }
]

export const statsData = [
  { label: 'Available Drones', value: '500+', iconName: 'Navigation' },
  { label: 'Trusted Rental Shops', value: '50+', iconName: 'Store' },
  { label: 'Happy Customers', value: '2,500+', iconName: 'Users' },
  { label: 'Successful Rentals', value: '10,000+', iconName: 'CheckCircle2' }
]

export const faqData = [
  {
    id: 'faq-1',
    question: 'What is DroneHub?',
    answer: 'DroneHub is a multi-tenant rental and fleet management platform connecting individual pilots, businesses, and enterprise teams with verified drone rental providers.'
  },
  {
    id: 'faq-2',
    question: 'How can I rent a drone on DroneHub?',
    answer: 'Simply browse our catalog of available drones, select the dates you need, choose any optional accessories (like extra batteries or memory cards), and submit a booking request directly to the host shop.'
  },
  {
    id: 'faq-3',
    question: 'What documents are required to complete a rental?',
    answer: 'You will need a valid government photo ID (Driver License or Passport) and, depending on the drone weight class and commercial use, FAA Part 107 certification or equivalent country flight registration.'
  },
  {
    id: 'faq-4',
    question: 'How does the booking process work?',
    answer: 'Once you select a drone and date range, your request is sent to the verified shop owner. After they approve the request, you receive confirmation details along with pickup or shipping instructions.'
  },
  {
    id: 'faq-5',
    question: 'Can I cancel or modify a booking?',
    answer: 'Yes, bookings can be cancelled or rescheduled directly from your rental dashboard according to the specific rental shop’s cancellation window policy.'
  },
  {
    id: 'faq-6',
    question: 'How are rental prices calculated?',
    answer: 'Rental prices are set transparently per day by the drone owner shop. Discounts are automatically applied for multi-day, weekly, or monthly enterprise hires.'
  },
  {
    id: 'faq-7',
    question: 'What happens if a drone is damaged during flight?',
    answer: 'All rentals include optional basic hull insurance coverage. In case of an incident, report it immediately through the dashboard to trigger seamless claims processing.'
  },
  {
    id: 'faq-8',
    question: 'Can drone shop owners list their fleet on DroneHub?',
    answer: 'Absolutely! Commercial drone shops and certified rental businesses can apply for a Shop Owner account to list inventory, manage customer requests, and track fleet maintenance.'
  }
]

export const roleBenefitsData = {
  customers: {
    title: 'For Renters & Pilots',
    subtitle: 'Access top-tier UAV equipment on demand without heavy upfront capital investments.',
    items: [
      'Access 500+ top-rated drones across photography, survey, and industrial specs.',
      'Flexible daily, weekly, or project-based rental durations.',
      'Includes calibrated sensors, protective travel cases, and fully charged batteries.',
      'Instant digital reservation confirmation with verified shop protection.'
    ]
  },
  shopOwners: {
    title: 'For Drone Shop Owners',
    subtitle: 'Turn idle aerial equipment into a steady stream of recurring rental revenue.',
    items: [
      'Dedicated shop dashboard to manage inventory, pricing, and availability calendars.',
      'Automated customer ID verification and equipment check-in/check-out logs.',
      'Streamlined booking approvals and direct payout payouts.',
      'Expand regional market reach with built-in store exposure.'
    ]
  },
  administrators: {
    title: 'For Platform Administrators',
    subtitle: 'Maintain complete operational oversight over multi-tenant shop ecosystems.',
    items: [
      'Comprehensive compliance monitoring and shop owner onboarding verification.',
      'Real-time platform analytics, commission tracking, and rental performance stats.',
      'Global user management, dispute resolution tools, and audit reporting.',
      'Scalable multi-tenant architecture supporting nationwide growth.'
    ]
  }
}
