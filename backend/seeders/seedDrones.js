import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Drone from '../models/Drone.js';
import User from '../models/User.js';

dotenv.config();

const initialDrones = [
  {
    name: 'Mavic 3 Pro',
    brand: 'DJI',
    model: 'Mavic 3 Pro Hasselblad',
    category: 'Photography',
    pricePerDay: 2500,
    pricePerHour: 320,
    securityDeposit: 10000,
    rating: 4.9,
    reviews: 124,
    batteryLevel: 98,
    status: 'available',
    shopName: 'SkyRent Bengaluru',
    location: 'Bengaluru',
    image:
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80',
    popular: true,
    recommended: true,
    specifications: {
      camera: '5.1K',
      flightTime: 43,
      speed: '75 km/h',
      weight: '958 g',
      gps: true,
      sensors: ['Omnidirectional Obstacle Sensing', 'Hasselblad Color Solution']
    }
  },
  {
    name: 'Inspire 3 Cinema 8K',
    brand: 'DJI',
    category: 'Videography',
    model: 'Inspire 3 X9-8K Air',
    pricePerDay: 8500,
    pricePerHour: 1100,
    securityDeposit: 35000,
    rating: 5.0,
    reviews: 68,
    batteryLevel: 94,
    status: 'available',
    shopName: 'AeroTech Mumbai',
    location: 'Mumbai',
    image:
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
    popular: true,
    recommended: true,
    specifications: {
      camera: '8K',
      flightTime: 28,
      speed: '94 km/h',
      weight: '3995 g',
      gps: true,
      sensors: ['RTK High-Precision Positioning', 'Dual Antenna Radar']
    }
  },
  {
    name: 'Agras T40 Heavy Sprayer',
    brand: 'DJI',
    category: 'Agriculture',
    model: 'Agras T40 Spray System',
    pricePerDay: 6000,
    pricePerHour: 750,
    securityDeposit: 25000,
    rating: 4.8,
    reviews: 42,
    batteryLevel: 90,
    status: 'available',
    shopName: 'GreenField Drones Hyderabad',
    location: 'Hyderabad',
    image:
      'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=800&q=80',
    popular: false,
    recommended: true,
    specifications: {
      camera: '4K',
      flightTime: 30,
      speed: '45 km/h',
      weight: '50 kg',
      gps: true,
      sensors: ['Active Phased Array Radar', 'Binocular Vision']
    }
  },
  {
    name: 'Evo II Dual 640T V3',
    brand: 'Autel',
    category: 'Industrial Inspection',
    model: 'Evo II Dual 640T',
    pricePerDay: 4800,
    pricePerHour: 600,
    securityDeposit: 20000,
    rating: 4.7,
    reviews: 35,
    batteryLevel: 88,
    status: 'available',
    shopName: 'SkyRent Bengaluru',
    location: 'Bengaluru',
    image:
      'https://images.unsplash.com/photo-1521405924368-64c5b84bec60?auto=format&fit=crop&w=800&q=80',
    popular: false,
    recommended: false,
    specifications: {
      camera: '8K + Thermal 640x512',
      flightTime: 38,
      speed: '68 km/h',
      weight: '1150 g',
      gps: true,
      sensors: ['Thermal Infrared Core', '360 Obstacle Avoidance']
    }
  },
  {
    name: 'Skydio 2+ Autonomous Cinema',
    brand: 'Skydio',
    category: 'Videography',
    model: 'Skydio 2+ Pro Kit',
    pricePerDay: 3200,
    pricePerHour: 400,
    securityDeposit: 12000,
    rating: 4.9,
    reviews: 89,
    batteryLevel: 100,
    status: 'available',
    shopName: 'SkyRent Bengaluru',
    location: 'Bengaluru',
    image:
      'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=800&q=80',
    popular: true,
    recommended: true,
    specifications: {
      camera: '4K60 HDR',
      flightTime: 27,
      speed: '58 km/h',
      weight: '800 g',
      gps: true,
      sensors: ['6 Navigation Cameras', 'Autonomous AI Tracking']
    }
  },
  {
    name: 'Phantom 4 RTK Surveyor',
    brand: 'DJI',
    category: 'Surveying',
    model: 'Phantom 4 RTK Centimeter',
    pricePerDay: 5500,
    pricePerHour: 700,
    securityDeposit: 22000,
    rating: 4.8,
    reviews: 51,
    batteryLevel: 92,
    status: 'available',
    shopName: 'AeroTech Mumbai',
    location: 'Mumbai',
    image:
      'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?auto=format&fit=crop&w=800&q=80',
    popular: false,
    recommended: true,
    specifications: {
      camera: '20MP 1-inch CMOS',
      flightTime: 30,
      speed: '50 km/h',
      weight: '1391 g',
      gps: true,
      sensors: ['Integrated RTK Module', 'TimeSync System']
    }
  },
  {
    name: 'Matrice 350 RTK Enterprise',
    brand: 'DJI',
    category: 'Industrial Inspection',
    model: 'M350 RTK Flir Combo',
    pricePerDay: 12000,
    pricePerHour: 1500,
    securityDeposit: 50000,
    rating: 5.0,
    reviews: 29,
    batteryLevel: 100,
    status: 'available',
    shopName: 'AeroTech Mumbai',
    location: 'Mumbai',
    image:
      'https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=800&q=80',
    popular: false,
    recommended: true,
    specifications: {
      camera: 'Zenmuse H20T Triple',
      flightTime: 55,
      speed: '82 km/h',
      weight: '6470 g',
      gps: true,
      sensors: ['Six-directional Sensing', 'CSM Radar Compatible']
    }
  },
  {
    name: 'DJI Mini 4 Pro Fly More',
    brand: 'DJI',
    category: 'Beginner',
    model: 'Mini 4 Pro RC 2 Kit',
    pricePerDay: 1500,
    pricePerHour: 190,
    securityDeposit: 6000,
    rating: 4.8,
    reviews: 210,
    batteryLevel: 100,
    status: 'available',
    shopName: 'SkyRent Bengaluru',
    location: 'Bengaluru',
    image:
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80',
    popular: true,
    recommended: true,
    specifications: {
      camera: '4K60 HDR Vertical',
      flightTime: 34,
      speed: '57 km/h',
      weight: '249 g',
      gps: true,
      sensors: ['Omnidirectional Vision Sensing', 'APAS 5.0']
    }
  }
];

export const seedDrones = async () => {
  try {
    // Find or create default shop owner to associate drones with
    let owner = await User.findOne({ email: 'owner@dronehub.com' });
    if (!owner) {
      owner = await User.findOne({ role: { $in: ['owner', 'shop-owner'] } });
    }
    if (!owner) {
      owner = await User.findOne({});
    }

    if (!owner) {
      console.warn('⚠️  No user found in database. Please run npm run seed:users first.');
      return;
    }

    // Drones listed under AeroTech belong to the second demo shop owner
    const secondOwner = (await User.findOne({ email: 'owner2@dronehub.com' })) || owner;

    let seededCount = 0;
    for (const droneData of initialDrones) {
      const existing = await Drone.findOne({ model: droneData.model });
      if (!existing) {
        await Drone.create({
          ...droneData,
          ownerId: droneData.shopName?.startsWith('AeroTech') ? secondOwner._id : owner._id
        });
        seededCount++;
        console.log(`🚁 Seeded drone: ${droneData.name} (${droneData.brand})`);
      }
    }

    console.log(`Seeded ${seededCount} drones into MongoDB.`);
  } catch (error) {
    console.error('Error seeding drones:', error.message);
  }
};

// Standalone execution: node seeders/seedDrones.js
if (process.argv[1]?.endsWith('seedDrones.js')) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
      console.log('Connected to MongoDB Atlas for seeding drones...');
      await seedDrones();
      process.exit(0);
    })
    .catch((err) => {
      console.error('Connection failed:', err.message);
      process.exit(1);
    });
}

export default seedDrones;

