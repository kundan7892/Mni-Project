import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Drone from '../models/Drone.js';
import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

const REVENUE_STATUSES = ['approved', 'confirmed', 'active', 'completed'];

const isAdminRole = (role) => role === 'admin' || role === 'super-admin';

/** Shop owners only see their own fleet; admins see everything. */
const scopeFor = (user) => (isAdminRole(user.role) ? {} : { ownerId: user._id });

/**
 * @route   GET /api/admin/analytics?months=6
 * @desc    Revenue, booking and catalogue metrics for the admin / owner panel
 */
export const getAnalytics = async (req, res, next) => {
  try {
    const months = Math.min(24, Math.max(1, parseInt(req.query.months, 10) || 6));
    const scope = scopeFor(req.user);

    const now = new Date();
    const since = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);

    const [statusAgg, monthlyAgg, topDronesAgg, categoryAgg, totals, droneStatusAgg, recent, customers] =
      await Promise.all([
        Booking.aggregate([
          { $match: scope },
          { $group: { _id: '$bookingStatus', count: { $sum: 1 } } }
        ]),
        Booking.aggregate([
          { $match: { ...scope, createdAt: { $gte: since } } },
          {
            $group: {
              _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } },
              bookings: { $sum: 1 },
              revenue: {
                $sum: { $cond: [{ $in: ['$bookingStatus', REVENUE_STATUSES] }, '$totalPrice', 0] }
              }
            }
          }
        ]),
        Booking.aggregate([
          { $match: { ...scope, bookingStatus: { $in: REVENUE_STATUSES } } },
          {
            $group: {
              _id: '$droneId',
              name: { $first: '$droneName' },
              bookings: { $sum: 1 },
              revenue: { $sum: '$totalPrice' },
              days: { $sum: '$durationDays' }
            }
          },
          { $sort: { revenue: -1 } },
          { $limit: 5 }
        ]),
        Booking.aggregate([
          { $match: { ...scope, bookingStatus: { $in: REVENUE_STATUSES } } },
          { $lookup: { from: 'drones', localField: 'droneId', foreignField: '_id', as: 'drone' } },
          { $unwind: { path: '$drone', preserveNullAndEmptyArrays: true } },
          {
            $group: {
              _id: { $ifNull: ['$drone.category', 'Other'] },
              revenue: { $sum: '$totalPrice' },
              bookings: { $sum: 1 }
            }
          },
          { $sort: { revenue: -1 } }
        ]),
        Booking.aggregate([
          { $match: { ...scope, bookingStatus: { $in: REVENUE_STATUSES } } },
          {
            $group: {
              _id: null,
              revenue: { $sum: '$totalPrice' },
              collected: {
                $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$totalPrice', 0] }
              },
              rentalDays: { $sum: '$durationDays' }
            }
          }
        ]),
        Drone.aggregate([
          { $match: scope },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
              listed: { $sum: { $cond: [{ $ne: ['$isListed', false] }, 1, 0] } }
            }
          }
        ]),
        Booking.find(scope)
          .sort({ createdAt: -1 })
          .limit(6)
          .populate('droneId', 'name image'),
        isAdminRole(req.user.role)
          ? User.countDocuments({ role: 'customer' })
          : Booking.distinct('customerId', scope).then((ids) => ids.length)
      ]);

    // Fill every month in the window so charts have no gaps
    const monthly = [];
    for (let i = 0; i < months; i++) {
      const d = new Date(since.getFullYear(), since.getMonth() + i, 1);
      const hit = monthlyAgg.find((m) => m._id.y === d.getFullYear() && m._id.m === d.getMonth() + 1);
      monthly.push({
        month: d.toLocaleString('en-US', { month: 'short' }),
        year: d.getFullYear(),
        bookings: hit?.bookings || 0,
        revenue: hit?.revenue || 0
      });
    }

    const byStatus = Object.fromEntries(statusAgg.map((s) => [s._id, s.count]));
    const totalBookings = statusAgg.reduce((sum, s) => sum + s.count, 0);
    const fleet = Object.fromEntries(droneStatusAgg.map((s) => [s._id, s.count]));
    const totalDrones = droneStatusAgg.reduce((sum, s) => sum + s.count, 0);
    const listedDrones = droneStatusAgg.reduce((sum, s) => sum + s.listed, 0);
    const decided = (byStatus.approved || 0) + (byStatus.active || 0) + (byStatus.completed || 0) + (byStatus.rejected || 0);

    return sendSuccess(res, {
      message: 'Analytics computed.',
      data: {
        totals: {
          revenue: totals[0]?.revenue || 0,
          collected: totals[0]?.collected || 0,
          rentalDays: totals[0]?.rentalDays || 0,
          bookings: totalBookings,
          pending: byStatus.pending || 0,
          active: byStatus.active || 0,
          completed: byStatus.completed || 0,
          customers,
          drones: totalDrones,
          listedDrones,
          rentedDrones: fleet.rented || 0,
          approvalRate: decided ? Math.round(((decided - (byStatus.rejected || 0)) / decided) * 100) : 0,
          utilization: totalDrones ? Math.round(((fleet.rented || 0) / totalDrones) * 100) : 0
        },
        byStatus,
        fleet,
        monthly,
        topDrones: topDronesAgg.map((d) => ({
          id: d._id,
          name: d.name,
          bookings: d.bookings,
          revenue: d.revenue,
          days: d.days
        })),
        byCategory: categoryAgg.map((c) => ({ category: c._id, revenue: c.revenue, bookings: c.bookings })),
        recentBookings: recent
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/users?role=customer&search=
 * @desc    Users with their rental totals (admin only)
 */
export const getUsers = async (req, res, next) => {
  try {
    const { role = 'customer', search } = req.query;
    const roles =
      role === 'owner' || role === 'shop-owner'
        ? ['owner', 'shop-owner']
        : role === 'all'
          ? ['customer', 'owner', 'shop-owner', 'admin', 'super-admin']
          : [role];

    const query = { role: { $in: roles } };
    if (search && search.trim()) {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const rx = new RegExp(escaped, 'i');
      query.$or = [{ name: rx }, { email: rx }, { phone: rx }];
    }

    const users = await User.find(query).sort({ createdAt: -1 }).limit(500).lean();
    const ids = users.map((u) => u._id);
    const field = roles.includes('customer') ? '$customerId' : '$ownerId';

    const stats = await Booking.aggregate([
      { $match: { [field.slice(1)]: { $in: ids } } },
      {
        $group: {
          _id: field,
          bookings: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ['$bookingStatus', 'active'] }, 1, 0] } },
          spent: {
            $sum: { $cond: [{ $in: ['$bookingStatus', REVENUE_STATUSES] }, '$totalPrice', 0] }
          },
          lastBookingAt: { $max: '$createdAt' }
        }
      }
    ]);
    const statMap = new Map(stats.map((s) => [s._id.toString(), s]));

    return sendSuccess(res, {
      message: 'Users retrieved.',
      data: {
        users: users.map(({ password, __v, ...u }) => {
          const s = statMap.get(u._id.toString());
          return {
            ...u,
            id: u._id,
            bookings: s?.bookings || 0,
            activeRentals: s?.active || 0,
            totalSpent: s?.spent || 0,
            lastBookingAt: s?.lastBookingAt || null
          };
        })
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/admin/users/:id/status
 * @desc    Activate or deactivate an account (admin only)
 */
export const setUserActive = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, { statusCode: 400, message: 'Invalid user id.' });
    }
    if (id === req.user._id.toString()) {
      return sendError(res, { statusCode: 400, message: 'You cannot deactivate your own account.' });
    }
    const user = await User.findByIdAndUpdate(id, { isActive: Boolean(req.body.isActive) }, { new: true });
    if (!user) return sendError(res, { statusCode: 404, message: 'User not found.' });
    return sendSuccess(res, {
      message: `${user.name} is now ${user.isActive ? 'active' : 'deactivated'}.`,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};
