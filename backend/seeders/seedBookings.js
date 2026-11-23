import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Drone from '../models/Drone.js';
import Booking from '../models/Booking.js';
import { calculateQuote } from '../utils/pricing.js';

dotenv.config();

const DAY = 24 * 60 * 60 * 1000;

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const demoCustomers = [
  { name: 'Aarav Mehta', email: 'aarav@example.com', phone: '9876500011' },
  { name: 'Priya Nair', email: 'priya@example.com', phone: '9876500022' },
  { name: 'Rohan Kapoor', email: 'rohan@example.com', phone: '9876500033' }
];

/**
 * Each entry: [customerIndex, droneIndex, startOffsetDays, lengthDays, status, payment, addons]
 * Negative offsets are in the past. customerIndex 0 is the main demo customer.
 */
const plan = [
  [1, 0, -150, 3, 'completed', 'paid', ['addon-battery']],
  [2, 1, -128, 2, 'completed', 'paid', []],
  [0, 2, -110, 4, 'completed', 'paid', ['addon-insurance']],
  [3, 3, -95, 1, 'completed', 'paid', []],
  [1, 4, -80, 5, 'completed', 'paid', ['addon-battery', 'addon-case']],
  [2, 0, -66, 2, 'rejected', 'pending', []],
  [0, 5, -52, 3, 'completed', 'paid', ['addon-memory']],
  [3, 1, -40, 2, 'cancelled', 'refunded', []],
  [1, 6, -30, 4, 'completed', 'paid', ['addon-insurance']],
  [0, 0, -18, 3, 'completed', 'paid', ['addon-battery']],
  [2, 7, -9, 2, 'completed', 'paid', []],
  [3, 2, -1, 4, 'active', 'paid', ['addon-propellers']],
  [0, 1, 3, 3, 'approved', 'pending', ['addon-battery', 'addon-insurance']],
  [1, 3, 6, 2, 'pending', 'pending', []],
  [2, 4, 9, 5, 'pending', 'pending', ['addon-case']],
  [0, 6, 14, 2, 'pending', 'pending', []]
];

export const seedBookings = async () => {
  try {
    if ((await Booking.estimatedDocumentCount()) > 0) {
      console.log('Bookings already present, skipping booking seed.');
      return;
    }

    const mainCustomer = await User.findOne({ email: 'user@dronehub.com' });
    const drones = await Drone.find({}).sort({ createdAt: 1 });
    if (!mainCustomer || drones.length === 0) {
      console.warn('Cannot seed bookings: need the demo customer and at least one drone.');
      return;
    }

    const customers = [mainCustomer];
    for (const c of demoCustomers) {
      const existing = await User.findOne({ email: c.email });
      customers.push(existing || (await User.create({ ...c, password: 'customer123', role: 'customer' })));
    }

    const today = startOfToday();
    let count = 0;

    for (const [ci, di, offset, length, status, payment, addons] of plan) {
      const customer = customers[ci];
      const drone = drones[di % drones.length];
      const start = new Date(today.getTime() + offset * DAY);
      const end = new Date(start.getTime() + length * DAY);
      const quote = calculateQuote(drone, start, end, addons);
      // Past rentals were requested a few days before they started; upcoming ones within the last few days
      const createdAt =
        offset < 0
          ? new Date(start.getTime() - Math.min(7, -offset) * DAY)
          : new Date(Date.now() - (offset * 7 + 2) * 60 * 60 * 1000);

      const history = [{ status: 'pending', at: createdAt, by: customer.name, note: 'Request submitted' }];
      if (status !== 'pending') history.push({ status, at: new Date(createdAt.getTime() + DAY), by: 'Shop' });

      const booking = await Booking.create({
        customerId: customer._id,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        droneId: drone._id,
        droneName: drone.name,
        ownerId: drone.ownerId,
        shopName: drone.shopName,
        startDate: start,
        endDate: end,
        durationDays: quote.durationDays,
        durationHours: quote.durationHours,
        totalPrice: quote.totalPrice,
        addonsTotal: quote.addonsTotal,
        securityDeposit: quote.securityDeposit,
        selectedAddons: quote.selectedAddons,
        customerInfo: {
          fullName: customer.name,
          email: customer.email,
          phone: customer.phone,
          city: 'Bengaluru',
          purpose: 'Aerial photography'
        },
        bookingStatus: status,
        paymentStatus: payment,
        rejectionReason: status === 'rejected' ? 'Drone reserved for servicing on those dates.' : '',
        cancellationReason: status === 'cancelled' ? 'Plans changed' : '',
        statusHistory: history
      });

      // createdAt is immutable through Mongoose, so backdate it with the raw driver
      await Booking.collection.updateOne(
        { _id: booking._id },
        { $set: { createdAt, updatedAt: createdAt } }
      );

      if (status === 'active') {
        await Drone.updateOne({ _id: drone._id }, { status: 'rented', availability: 'Rented' });
      }
      count++;
    }

    console.log(`Seeded ${count} demo bookings.`);
  } catch (err) {
    console.error('Error seeding bookings:', err.message);
  }
};

// Standalone execution: node seeders/seedBookings.js
if (process.argv[1]?.endsWith('seedBookings.js')) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
      await seedBookings();
      process.exit(0);
    })
    .catch((err) => {
      console.error('Connection failed:', err.message);
      process.exit(1);
    });
}

export default seedBookings;
