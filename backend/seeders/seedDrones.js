import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Drone from '../models/Drone.js';
import User from '../models/User.js';
import catalogue from './catalogue.js';

dotenv.config();

/** Which demo account owns each shop's drones. Shops not listed belong to the admin. */
const SHOP_OWNERS = {
  'SkyRent Bengaluru': 'owner@dronehub.com',
  'AeroTech Mumbai': 'owner2@dronehub.com'
};
const DEFAULT_OWNER = 'admin@dronehub.com';

export const seedDrones = async () => {
  try {
    const emails = [...new Set([...Object.values(SHOP_OWNERS), DEFAULT_OWNER])];
    const users = await User.find({ email: { $in: emails } });
    const byEmail = Object.fromEntries(users.map((u) => [u.email, u]));
    const fallback = byEmail[DEFAULT_OWNER] || users[0] || (await User.findOne({}));

    if (!fallback) {
      console.warn('No users found. Run npm run seed:users first.');
      return;
    }

    let seededCount = 0;
    for (const droneData of catalogue) {
      const existing = await Drone.findOne({ name: droneData.name });
      if (existing) continue;
      const owner = byEmail[SHOP_OWNERS[droneData.shopName]] || byEmail[DEFAULT_OWNER] || fallback;
      await Drone.create({ ...droneData, ownerId: owner._id });
      seededCount++;
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
      await seedDrones();
      process.exit(0);
    })
    .catch((err) => {
      console.error('Connection failed:', err.message);
      process.exit(1);
    });
}

export default seedDrones;
