import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { initSocket } from './config/socket.js';
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import droneRoutes from './routes/droneRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import telemetryRoutes from './routes/telemetryRoutes.js';
import flightRoutes from './routes/flightRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import uploadRoutes, { UPLOAD_DIR } from './routes/uploadRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';
import { sendSuccess } from './utils/apiResponse.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Load environment variables from backend/.env
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// 2. CORS Configuration for Vite Frontend
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy violation: Origin '${origin}' is not allowed.`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

// 3. Request Parsing & HTTP Logging Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Uploaded catalogue images and customer documents
app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '7d' }));

// 4. Base API Welcome Route
app.get('/', (req, res) => {
  return sendSuccess(res, {
    message: 'Welcome to DRONEHUB REST API Engine',
    data: {
      version: '1.0.0',
      description: 'Multi-Tenant Drone Rental & Tracking Management System API',
      healthCheck: '/api/health',
      docs: '/api/docs',
      supportedRoles: ['customer', 'shop-owner', 'super-admin']
    }
  });
});

// 5. Mount API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/drones', droneRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/admin', adminRoutes);

// 6. Centralized Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

// 7. Start Express Server & Initialize Database
const startServer = async () => {
  // Connect to MongoDB Atlas
  await connectDB();

  const listenWithFallback = (portToTry) => {
    const httpServer = http.createServer(app);

    // Initialize Socket.IO with HTTP Server
    initSocket(httpServer);

    httpServer.listen(portToTry, () => {
      console.log(`\n======================================================`);
      console.log(`🛸 DRONEHUB Backend Engine & Socket.IO Started`);
      console.log(`🌐 Server Port     : ${portToTry}`);
      console.log(`🌍 Environment     : ${NODE_ENV}`);
      console.log(`🔗 Root Endpoint   : http://localhost:${portToTry}/`);
      console.log(`🩺 Health Check    : http://localhost:${portToTry}/api/health`);
      console.log(`📡 Telemetry Feed  : http://localhost:${portToTry}/api/telemetry`);
      console.log(`🛫 Flight History  : http://localhost:${portToTry}/api/flights`);
      console.log(`🚨 Alert Manager   : http://localhost:${portToTry}/api/alerts`);
      console.log(`======================================================\n`);
    });

    httpServer.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        const nextPort = Number(portToTry) + 1;
        console.warn(`\n⚠️  Port ${portToTry} is already in use (frequently occupied by macOS AirPlay Receiver on port 5000).`);
        console.log(`🔄 Automatically falling back to available port ${nextPort}...`);
        listenWithFallback(nextPort);
      } else {
        console.error('❌ Server startup error:', err.message);
      }
    });

    // Graceful Process Termination Handlers
    const handleShutdown = (signal) => {
      console.log(`\n🛑 Received ${signal}. Shutting down DRONEHUB API gracefully...`);
      httpServer.close(() => {
        console.log('💤 HTTP & Socket.IO server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));
  };

  listenWithFallback(PORT);
};

startServer();

export default app;
