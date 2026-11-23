import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import User from '../models/User.js';
import seedDemoUsers from '../seeders/seedDemoUsers.js';
import seedDrones from '../seeders/seedDrones.js';
import seedBookings from '../seeders/seedBookings.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_DB_PATH = path.resolve(__dirname, '..', '.data', 'mongo');

let localServer = null;

const isUsableUri = (uri) => Boolean(uri) && !uri.includes('<db_password>');

/**
 * Starts a MongoDB instance on this machine (development only) whose data is
 * stored in backend/.data/mongo, so it survives restarts.
 * The mongod binary is downloaded once by mongodb-memory-server.
 */
const startLocalMongo = async () => {
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  fs.mkdirSync(LOCAL_DB_PATH, { recursive: true });
  localServer = await MongoMemoryServer.create({
    instance: { dbPath: LOCAL_DB_PATH, storageEngine: 'wiredTiger', dbName: 'dronehub' }
  });
  return localServer.getUri('dronehub');
};

/**
 * Seeds demo accounts, catalogue and bookings into an empty database.
 */
const seedIfEmpty = async () => {
  const userCount = await User.estimatedDocumentCount();
  if (userCount > 0) return;
  console.log('Empty database detected, seeding demo data...');
  await seedDemoUsers();
  await seedDrones();
  await seedBookings();
};

export const connectDB = async () => {
  let uri = process.env.MONGO_URI;
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isUsableUri(uri)) {
    if (isProduction) {
      console.error('MongoDB: MONGO_URI is missing or still contains <db_password>.');
      return;
    }
    console.log('MongoDB: no MONGO_URI configured, starting local development database...');
    try {
      uri = await startLocalMongo();
    } catch (error) {
      console.error(`MongoDB: could not start local database: ${error.message}`);
      return;
    }
  }

  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    if (localServer || process.env.SEED_IF_EMPTY === 'true') {
      await seedIfEmpty();
    }
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (localServer) await localServer.stop({ doCleanup: false });
};

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB connection disconnected.');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB connection re-established.');
});

export default connectDB;
