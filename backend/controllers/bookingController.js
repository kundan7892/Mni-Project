import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Drone from '../models/Drone.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { calculateQuote } from '../utils/pricing.js';

const BLOCKING_STATUSES = ['approved', 'confirmed', 'active'];

const isAdminRole = (role) => role === 'admin' || role === 'super-admin';
const isOwnerRole = (role) => role === 'owner' || role === 'shop-owner';

/**
 * Allowed booking lifecycle transitions:
 * pending -> approved | rejected | cancelled
 * approved -> active (handed over) | cancelled
 * active -> completed (returned)
 */
const TRANSITIONS = {
  pending: ['approved', 'rejected', 'cancelled'],
  approved: ['active', 'cancelled'],
  confirmed: ['active', 'cancelled'],
  active: ['completed'],
  completed: [],
  rejected: [],
  cancelled: []
};

const findBooking = (id) =>
  mongoose.Types.ObjectId.isValid(id)
    ? Booking.findById(id)
    : Booking.findOne({ bookingNumber: id });

const populateBooking = (query) =>
  query
    .populate('customerId', 'name email phone profileImage')
    .populate(
      'droneId',
      'name brand model image images pricePerHour pricePerDay category specifications status batteryLevel location'
    )
    .populate('ownerId', 'name email phone');

const findConflict = (droneId, start, end, excludeId) =>
  Booking.findOne({
    ...(excludeId && { _id: { $ne: excludeId } }),
    droneId,
    bookingStatus: { $in: BLOCKING_STATUSES },
    startDate: { $lt: end },
    endDate: { $gt: start }
  });

const formatDay = (date) => new Date(date).toISOString().split('T')[0];

const parseRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { error: 'Invalid start or end date format.' };
  }
  if (end <= start) {
    return { error: 'Rental end date must be after the start date.' };
  }
  // Allow bookings that start "today" in any timezone
  if (start < new Date(Date.now() - 24 * 60 * 60 * 1000)) {
    return { error: 'Booking start date cannot be in the past.' };
  }
  return { start, end };
};

/**
 * @route   POST /api/bookings/quote
 * @desc    Price a rental and check availability without creating it
 * @access  Private
 */
export const quoteBooking = async (req, res, next) => {
  try {
    const { droneId, startDate, endDate, selectedAddons = [] } = req.body;
    const range = parseRange(startDate, endDate);
    if (range.error) return sendError(res, { statusCode: 400, message: range.error });

    const drone = await Drone.findById(droneId);
    if (!drone) return sendError(res, { statusCode: 404, message: 'Drone not found.' });

    const conflict = await findConflict(drone._id, range.start, range.end);
    return sendSuccess(res, {
      message: 'Quote calculated.',
      data: {
        quote: calculateQuote(drone, range.start, range.end, selectedAddons),
        available: !conflict,
        conflict: conflict
          ? { startDate: conflict.startDate, endDate: conflict.endDate }
          : null
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/bookings
 * @desc    Submit a rental request (starts as "pending" until approved)
 * @access  Private
 */
export const createBooking = async (req, res, next) => {
  try {
    const {
      droneId,
      startDate,
      endDate,
      selectedAddons = [],
      customerInfo = {},
      documents = [],
      notes = ''
    } = req.body;

    const range = parseRange(startDate, endDate);
    if (range.error) return sendError(res, { statusCode: 400, message: range.error });
    const { start, end } = range;

    const drone = await Drone.findById(droneId);
    if (!drone || drone.isListed === false) {
      return sendError(res, { statusCode: 404, message: 'The requested drone was not found.' });
    }
    if (drone.status === 'maintenance' || drone.status === 'offline') {
      return sendError(res, {
        statusCode: 400,
        message: `${drone.name} is currently ${drone.status} and cannot be reserved.`
      });
    }

    const conflict = await findConflict(drone._id, start, end);
    if (conflict) {
      return sendError(res, {
        statusCode: 409,
        message: `${drone.name} is already booked from ${formatDay(conflict.startDate)} to ${formatDay(conflict.endDate)}. Please choose other dates.`
      });
    }

    const quote = calculateQuote(drone, start, end, selectedAddons);

    const cleanDocuments = (Array.isArray(documents) ? documents : [])
      .filter((d) => d && typeof d.url === 'string')
      .slice(0, 8)
      .map((d) => ({ type: String(d.type || 'document'), name: String(d.name || ''), url: d.url }));

    const info = {
      fullName: customerInfo.fullName || req.user.name,
      email: customerInfo.email || req.user.email,
      phone: customerInfo.phone || req.user.phone || '',
      address: customerInfo.address || '',
      city: customerInfo.city || '',
      state: customerInfo.state || '',
      pinCode: customerInfo.pinCode || '',
      purpose: customerInfo.purpose || '',
      experience: customerInfo.experience || ''
    };

    const booking = await Booking.create({
      customerId: req.user._id,
      customerName: info.fullName,
      customerEmail: info.email,
      customerPhone: info.phone,
      droneId: drone._id,
      droneName: drone.name,
      ownerId: drone.ownerId,
      shopName: drone.shopName,
      startDate: start,
      endDate: end,
      durationHours: quote.durationHours,
      durationDays: quote.durationDays,
      totalPrice: quote.totalPrice,
      addonsTotal: quote.addonsTotal,
      securityDeposit: quote.securityDeposit,
      selectedAddons: quote.selectedAddons,
      customerInfo: info,
      documents: cleanDocuments,
      bookingStatus: 'pending',
      paymentStatus: 'pending',
      notes,
      statusHistory: [{ status: 'pending', by: req.user.name, note: 'Request submitted' }]
    });

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Rental request submitted. You will be notified once it is approved.',
      data: { booking }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/bookings
 * @desc    Bookings scoped by role (customer: own, owner: own fleet, admin: all)
 * @access  Private
 */
export const getBookings = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20, droneId, paymentStatus } = req.query;
    const userRole = req.user.role;
    const query = {};

    if (userRole === 'customer') {
      query.customerId = req.user._id;
    } else if (isOwnerRole(userRole)) {
      query.ownerId = req.user._id;
    } else if (isAdminRole(userRole)) {
      if (mongoose.Types.ObjectId.isValid(req.query.customerId)) {
        query.customerId = new mongoose.Types.ObjectId(req.query.customerId);
      }
      if (mongoose.Types.ObjectId.isValid(req.query.ownerId)) {
        query.ownerId = new mongoose.Types.ObjectId(req.query.ownerId);
      }
    }

    if (droneId && mongoose.Types.ObjectId.isValid(droneId)) {
      query.droneId = new mongoose.Types.ObjectId(droneId);
    }

    // Status tab counts ignore the status filter itself
    const countQuery = { ...query };

    if (status && status !== 'All' && status !== 'all') {
      const statuses = String(status)
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
      query.bookingStatus = statuses.length > 1 ? { $in: statuses } : statuses[0];
    }

    if (paymentStatus && paymentStatus !== 'all') query.paymentStatus = paymentStatus.toLowerCase();

    if (search && search.trim()) {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(escaped, 'i');
      query.$or = [
        { bookingNumber: searchRegex },
        { customerName: searchRegex },
        { customerEmail: searchRegex },
        { droneName: searchRegex },
        { shopName: searchRegex }
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(200, Math.max(1, parseInt(limit, 10) || 20));

    const [total, bookings, statusCounts] = await Promise.all([
      Booking.countDocuments(query),
      populateBooking(
        Booking.find(query)
          .sort({ createdAt: -1 })
          .skip((pageNum - 1) * limitNum)
          .limit(limitNum)
      ),
      Booking.aggregate([
        { $match: countQuery },
        { $group: { _id: '$bookingStatus', count: { $sum: 1 } } }
      ])
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return sendSuccess(res, {
      message: 'Bookings retrieved successfully.',
      data: {
        bookings,
        counts: Object.fromEntries(statusCounts.map((c) => [c._id, c.count])),
        pagination: { total, page: pageNum, limit: limitNum, totalPages, hasMore: pageNum < totalPages }
      }
    });
  } catch (error) {
    next(error);
  }
};

const canManage = (booking, user) =>
  isAdminRole(user.role) || booking.ownerId?.toString() === user._id.toString();

/**
 * @route   GET /api/bookings/:id
 * @access  Private (customer who booked, owning shop, or admin)
 */
export const getBookingById = async (req, res, next) => {
  try {
    const booking = await populateBooking(findBooking(req.params.id));
    if (!booking) {
      return sendError(res, { statusCode: 404, message: `Booking '${req.params.id}' not found.` });
    }

    const userId = req.user._id.toString();
    const isCustomer = (booking.customerId?._id || booking.customerId)?.toString() === userId;
    const isOwner = (booking.ownerId?._id || booking.ownerId)?.toString() === userId;

    if (!isCustomer && !isOwner && !isAdminRole(req.user.role)) {
      return sendError(res, { statusCode: 403, message: 'You do not have access to this booking.' });
    }

    return sendSuccess(res, { message: 'Booking retrieved.', data: { booking } });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/bookings/:id/status
 * @desc    Move a booking through its lifecycle (owner of the drone or admin)
 * @access  Private (Shop Owner or Admin)
 */
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, rejectionReason, note } = req.body;
    let nextStatus = String(status).trim().toLowerCase();
    if (nextStatus === 'confirmed') nextStatus = 'approved';

    const booking = await findBooking(req.params.id);
    if (!booking) return sendError(res, { statusCode: 404, message: 'Booking not found.' });

    if (!canManage(booking, req.user)) {
      return sendError(res, {
        statusCode: 403,
        message: 'You can only manage bookings for your own fleet.'
      });
    }

    const allowed = TRANSITIONS[booking.bookingStatus] || [];
    if (!allowed.includes(nextStatus)) {
      return sendError(res, {
        statusCode: 400,
        message: `A ${booking.bookingStatus} booking cannot be changed to ${nextStatus}.`
      });
    }

    if (nextStatus === 'approved') {
      const conflict = await findConflict(booking.droneId, booking.startDate, booking.endDate, booking._id);
      if (conflict) {
        return sendError(res, {
          statusCode: 409,
          message: `Cannot approve: it overlaps approved booking #${conflict.bookingNumber}.`
        });
      }
    }

    if (nextStatus === 'rejected') {
      booking.rejectionReason = rejectionReason || note || '';
    }

    if (nextStatus === 'cancelled') {
      booking.cancellationReason = note || 'Cancelled by shop';
      if (booking.paymentStatus === 'paid') booking.paymentStatus = 'refunded';
    }

    if (nextStatus === 'active') {
      await Drone.findByIdAndUpdate(booking.droneId, { status: 'rented', availability: 'Rented' });
    }

    if (nextStatus === 'completed') {
      const otherActive = await Booking.exists({
        _id: { $ne: booking._id },
        droneId: booking.droneId,
        bookingStatus: 'active'
      });
      if (!otherActive) {
        await Drone.findOneAndUpdate(
          { _id: booking.droneId, status: 'rented' },
          { status: 'available', availability: 'Available' }
        );
      }
      if (booking.paymentStatus === 'pending') booking.paymentStatus = 'paid';
    }

    booking.bookingStatus = nextStatus;
    booking.statusHistory.push({
      status: nextStatus,
      by: req.user.name,
      note: rejectionReason || note || ''
    });
    await booking.save();

    return sendSuccess(res, {
      message: `Booking #${booking.bookingNumber} is now ${nextStatus}.`,
      data: { booking: await populateBooking(Booking.findById(booking._id)) }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/bookings/:id/payment
 * @desc    Record payment state (owner of the drone or admin)
 */
export const updatePaymentStatus = async (req, res, next) => {
  try {
    const paymentStatus = String(req.body.paymentStatus || '').toLowerCase();
    if (!['pending', 'paid', 'refunded', 'failed'].includes(paymentStatus)) {
      return sendError(res, { statusCode: 400, message: 'Invalid payment status.' });
    }

    const booking = await findBooking(req.params.id);
    if (!booking) return sendError(res, { statusCode: 404, message: 'Booking not found.' });
    if (!canManage(booking, req.user)) {
      return sendError(res, { statusCode: 403, message: 'You cannot manage this booking.' });
    }

    booking.paymentStatus = paymentStatus;
    booking.statusHistory.push({ status: booking.bookingStatus, by: req.user.name, note: `Payment marked ${paymentStatus}` });
    await booking.save();

    return sendSuccess(res, {
      message: `Payment marked as ${paymentStatus}.`,
      data: { booking: await populateBooking(Booking.findById(booking._id)) }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/bookings/:id/cancel
 * @desc    Customer (or shop/admin) cancels a booking that has not started
 */
export const cancelBooking = async (req, res, next) => {
  try {
    const { reason = 'Cancelled by customer' } = req.body;
    const booking = await findBooking(req.params.id);
    if (!booking) return sendError(res, { statusCode: 404, message: 'Booking not found.' });

    const isCustomer = booking.customerId.toString() === req.user._id.toString();
    if (!isCustomer && !canManage(booking, req.user)) {
      return sendError(res, { statusCode: 403, message: 'You cannot cancel this booking.' });
    }

    if (!['pending', 'approved', 'confirmed'].includes(booking.bookingStatus)) {
      return sendError(res, {
        statusCode: 400,
        message:
          booking.bookingStatus === 'active'
            ? 'This rental is in progress and cannot be cancelled. Please contact the shop.'
            : `A ${booking.bookingStatus} booking cannot be cancelled.`
      });
    }

    booking.bookingStatus = 'cancelled';
    booking.cancellationReason = reason;
    if (booking.paymentStatus === 'paid') booking.paymentStatus = 'refunded';
    booking.statusHistory.push({ status: 'cancelled', by: req.user.name, note: reason });
    await booking.save();

    return sendSuccess(res, {
      message: `Booking #${booking.bookingNumber} cancelled.`,
      data: { booking: await populateBooking(Booking.findById(booking._id)) }
    });
  } catch (error) {
    next(error);
  }
};
