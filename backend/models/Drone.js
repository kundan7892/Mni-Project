import mongoose from 'mongoose';

const specificationsSchema = new mongoose.Schema(
  {
    camera: {
      type: String,
      default: '4K Ultra HD'
    },
    flightTime: {
      type: Number,
      default: 30, // in minutes
      min: [1, 'Flight time must be at least 1 minute.']
    },
    maxSpeed: {
      type: Number, // in km/h
      default: 45
    },
    speed: {
      type: String, // String representation e.g. "75 km/h"
      default: '75 km/h'
    },
    maxRange: {
      type: Number, // in km
      default: 10
    },
    weight: {
      type: String, // String or Number
      default: '958 g'
    },
    payloadCapacity: {
      type: Number, // in kg
      default: 1.5
    },
    hasGps: {
      type: Boolean,
      default: true
    },
    gps: {
      type: Boolean,
      default: true
    },
    sensors: {
      type: [String],
      default: ['Obstacle Sensing', 'Thermal Vision', 'RTK Positioning']
    }
  },
  { _id: false }
);

const droneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Drone name is required.'],
      trim: true,
      minlength: [2, 'Drone name must be at least 2 characters.'],
      maxlength: [100, 'Drone name cannot exceed 100 characters.'],
      index: true
    },
    model: {
      type: String,
      required: [true, 'Drone model identifier is required.'],
      trim: true
    },
    brand: {
      type: String,
      required: [true, 'Manufacturer/Brand name is required.'],
      trim: true,
      index: true
    },
    category: {
      type: String,
      default: 'Photography',
      index: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    image: {
      type: String,
      required: [true, 'Drone image URL is required.'],
      default:
        'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80'
    },
    images: {
      type: [String],
      default: []
    },
    isListed: {
      type: Boolean,
      default: true,
      index: true
    },
    pricePerHour: {
      type: Number,
      default: function () {
        return this.pricePerDay ? Math.round(this.pricePerDay / 8) : 300;
      },
      min: [0, 'Price per hour cannot be negative.']
    },
    pricePerDay: {
      type: Number,
      default: function () {
        return this.pricePerHour ? this.pricePerHour * 8 : 2400;
      },
      min: [0, 'Price per day cannot be negative.']
    },
    securityDeposit: {
      type: Number,
      default: 5000,
      min: [0, 'Security deposit cannot be negative.']
    },
    batteryLevel: {
      type: Number,
      required: [true, 'Battery level percentage is required.'],
      default: 100,
      min: [0, 'Battery level cannot be less than 0%.'],
      max: [100, 'Battery level cannot exceed 100%.']
    },
    status: {
      type: String,
      enum: {
        values: ['available', 'rented', 'maintenance', 'offline'],
        message: '{VALUE} is not a valid drone operational status.'
      },
      default: 'available',
      lowercase: true,
      index: true
    },
    availability: {
      type: String,
      default: 'Available'
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner ID reference is required.'],
      index: true
    },
    shopName: {
      type: String,
      default: 'SkyRent Hub'
    },
    location: {
      type: String,
      default: 'Bengaluru'
    },
    rating: {
      type: Number,
      default: 4.9,
      min: 0,
      max: 5
    },
    reviews: {
      type: Number,
      default: 0,
      min: 0
    },
    popular: {
      type: Boolean,
      default: false
    },
    recommended: {
      type: Boolean,
      default: false
    },
    specifications: {
      type: specificationsSchema,
      default: () => ({})
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual field: 'id' for clean frontend compatibility
droneSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Synchronize availability and status before saving
droneSchema.pre('save', function (next) {
  if (this.status) {
    this.status = this.status.toLowerCase();
    this.availability =
      this.status.charAt(0).toUpperCase() + this.status.slice(1);
  } else if (this.availability) {
    this.status = this.availability.toLowerCase();
  }
  next();
});

// Compound indexes for optimal queries
droneSchema.index({ ownerId: 1, status: 1 });
droneSchema.index({ brand: 1, status: 1 });
droneSchema.index({ category: 1, status: 1 });
droneSchema.index({ name: 'text', model: 'text', brand: 'text' });

const Drone = mongoose.model('Drone', droneSchema);

export default Drone;
