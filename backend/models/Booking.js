import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      unique: true,
      index: true,
      default: function () {
        const stamp = Date.now().toString(36).slice(-4).toUpperCase();
        const rand = Math.floor(Math.random() * 36 * 36).toString(36).padStart(2, '0').toUpperCase();
        return `DRN-${stamp}${rand}`;
      }
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer ID reference is required.'],
      index: true
    },
    customerName: {
      type: String
    },
    customerEmail: {
      type: String
    },
    customerPhone: {
      type: String
    },
    droneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Drone',
      required: [true, 'Drone ID reference is required.'],
      index: true
    },
    droneName: {
      type: String
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
    startDate: {
      type: Date,
      required: [true, 'Rental start date is required.']
    },
    endDate: {
      type: Date,
      required: [true, 'Rental end date is required.'],
      validate: {
        validator: function (value) {
          if (!this.startDate) return true;
          return new Date(value) > new Date(this.startDate);
        },
        message: 'End date and time must be strictly after the start date and time.'
      }
    },
    durationHours: {
      type: Number,
      min: [1, 'Booking duration must be at least 1 hour.']
    },
    durationDays: {
      type: Number,
      default: 1
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total rental price is required.'],
      min: [0, 'Total price cannot be negative.']
    },
    securityDeposit: {
      type: Number,
      default: 0,
      min: [0, 'Security deposit cannot be negative.']
    },
    selectedAddons: {
      type: [String],
      default: []
    },
    customerInfo: {
      fullName: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      pinCode: String,
      purpose: String,
      experience: String
    },
    bookingStatus: {
      type: String,
      enum: {
        values: [
          'pending',
          'approved',
          'rejected',
          'cancelled',
          'completed',
          'active',
          'confirmed'
        ],
        message: '{VALUE} is not a valid booking status.'
      },
      default: 'pending',
      lowercase: true,
      index: true
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['pending', 'paid', 'refunded', 'failed'],
        message: '{VALUE} is not a valid payment status.'
      },
      default: 'pending',
      lowercase: true,
      index: true
    },
    addonsTotal: {
      type: Number,
      default: 0
    },
    documents: {
      type: [
        {
          _id: false,
          type: { type: String },
          name: String,
          url: String
        }
      ],
      default: []
    },
    statusHistory: {
      type: [
        {
          _id: false,
          status: String,
          at: { type: Date, default: Date.now },
          by: String,
          note: String
        }
      ],
      default: []
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: ''
    },
    cancellationReason: {
      type: String,
      trim: true,
      default: ''
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual field: 'id' and 'bookingId' for seamless frontend compatibility
bookingSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

bookingSchema.virtual('bookingId').get(function () {
  return this.bookingNumber;
});

bookingSchema.virtual('amount').get(function () {
  return this.totalPrice;
});

bookingSchema.virtual('status').get(function () {
  // Format to Title Case for UI badges e.g. "Pending", "Approved", "Active"
  if (!this.bookingStatus) return 'Pending';
  return (
    this.bookingStatus.charAt(0).toUpperCase() + this.bookingStatus.slice(1)
  );
});

bookingSchema.virtual('bookingDate').get(function () {
  if (!this.createdAt) return new Date().toISOString().split('T')[0];
  return new Date(this.createdAt).toISOString().split('T')[0];
});

// Auto-calculate durations and validate dates before validation
bookingSchema.pre('validate', function (next) {
  if (this.startDate && this.endDate) {
    if (new Date(this.endDate) <= new Date(this.startDate)) {
      this.invalidate(
        'endDate',
        'End date and time must be strictly after the start date and time.'
      );
    } else {
      const diffMs = new Date(this.endDate) - new Date(this.startDate);
      const hours = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60)));
      const days = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
      this.durationHours = hours;
      this.durationDays = days;
    }
  }
  next();
});

// Performance compound indexes
bookingSchema.index({ customerId: 1, bookingStatus: 1 });
bookingSchema.index({ ownerId: 1, bookingStatus: 1 });
bookingSchema.index({ droneId: 1, startDate: 1, endDate: 1 });
bookingSchema.index({ droneId: 1, bookingStatus: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
