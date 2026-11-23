import mongoose from 'mongoose';
import Drone from '../models/Drone.js';
import Booking from '../models/Booking.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

/**
 * @route   POST /api/drones
 * @desc    Add a new drone to fleet inventory
 * @access  Private (Shop Owner or Admin)
 */
export const createDrone = async (req, res, next) => {
  try {
    const {
      name,
      model,
      brand,
      category,
      description,
      image,
      images,
      isListed,
      pricePerHour,
      pricePerDay,
      securityDeposit,
      batteryLevel,
      status,
      availability,
      shopName,
      location,
      specifications
    } = req.body;

    const gallery = Array.isArray(images) ? images.filter((u) => typeof u === 'string' && u) : [];

    // SECURITY: Use authenticated user ID, never trust client-supplied ownerId
    const ownerId = req.user._id;

    // Determine normalized pricing
    const resolvedPricePerDay =
      Number(pricePerDay) || (Number(pricePerHour) ? Number(pricePerHour) * 8 : 2400);
    const resolvedPricePerHour =
      Number(pricePerHour) || Math.round(resolvedPricePerDay / 8);

    // Determine normalized status
    const initialStatus = (status || availability || 'available').toLowerCase();

    const drone = await Drone.create({
      name,
      model,
      brand,
      category: category || 'Photography',
      description: description || '',
      image:
        image ||
        gallery[0] ||
        'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80',
      images: gallery,
      isListed: isListed !== false,
      pricePerHour: resolvedPricePerHour,
      pricePerDay: resolvedPricePerDay,
      securityDeposit: securityDeposit !== undefined && securityDeposit !== '' ? Number(securityDeposit) : 5000,
      batteryLevel: batteryLevel !== undefined ? Number(batteryLevel) : 100,
      status: initialStatus,
      ownerId,
      shopName: shopName || req.user.shopName || 'DroneHub',
      location: location || 'Bengaluru',
      specifications: {
        camera: specifications?.camera || req.body.camera || '4K',
        flightTime: Number(specifications?.flightTime || req.body.flightTime || 35),
        speed: specifications?.speed || req.body.speed || '75 km/h',
        weight: specifications?.weight || req.body.weight || '958 g',
        gps: specifications?.gps ?? req.body.gps ?? true,
        maxRange: Number(specifications?.maxRange || req.body.maxRange || 10),
        sensors: specifications?.sensors || ['Obstacle Sensing', 'Return to Home']
      }
    });

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Drone added to fleet inventory successfully.',
      data: { drone }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/drones
 * @desc    Get drones with search, filter, sorting, and pagination
 * @access  Public
 */
export const getDrones = async (req, res, next) => {
  try {
    const {
      search,
      brand,
      status,
      category,
      ownerId,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    // Unlisted products are only visible to shop owners / admins managing the catalogue
    const canSeeUnlisted =
      req.query.includeUnlisted === 'true' &&
      req.user &&
      ['owner', 'shop-owner', 'admin', 'super-admin'].includes(req.user.role);
    if (!canSeeUnlisted) query.isListed = { $ne: false };
    // A shop owner managing the catalogue only sees their own fleet
    if (canSeeUnlisted && ['owner', 'shop-owner'].includes(req.user.role)) query.ownerId = req.user._id;

    // 1. Search Query: Matches drone name, model, or brand
    if (search && search.trim()) {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(escaped, 'i');
      query.$or = [{ name: searchRegex }, { model: searchRegex }, { brand: searchRegex }];
    }

    // 2. Brand Filter
    if (brand && brand !== 'All' && brand !== 'all' && brand !== 'All Brands') {
      query.brand = new RegExp(`^${brand.trim()}$`, 'i');
    }

    // 3. Status Filter (normalizes 'Available' to 'available', etc.)
    if (status && status !== 'All' && status !== 'all' && status !== 'All Statuses') {
      query.status = status.trim().toLowerCase();
    }

    // 4. Category Filter
    if (category && category !== 'All' && category !== 'all' && category !== 'All Categories') {
      query.category = new RegExp(`^${category.trim()}$`, 'i');
    }

    // 5. Owner Scoping Filter (for shop owners viewing their own fleet)
    if (ownerId && mongoose.Types.ObjectId.isValid(ownerId)) {
      query.ownerId = ownerId;
    }

    // 6. Price Range Filters
    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
    }

    // 7. Sorting Engine
    let sortOptions = { createdAt: -1 };
    if (sort === 'price-low' || sort === 'price_asc') {
      sortOptions = { pricePerDay: 1 };
    } else if (sort === 'price-high' || sort === 'price_desc') {
      sortOptions = { pricePerDay: -1 };
    } else if (sort === 'rating') {
      sortOptions = { rating: -1, reviews: -1 };
    } else if (sort === 'flight-time') {
      sortOptions = { 'specifications.flightTime': -1 };
    } else if (sort === 'recommended') {
      sortOptions = { recommended: -1, popular: -1, rating: -1 };
    }

    // 8. Pagination Setup
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(200, Math.max(1, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const total = await Drone.countDocuments(query);
    const drones = await Drone.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .populate('ownerId', 'name email phone avatar');

    const totalPages = Math.ceil(total / limitNum);

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Drones retrieved successfully.',
      data: {
        drones,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages,
          hasMore: pageNum < totalPages
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/drones/:id
 * @desc    Get single drone details by ID
 * @access  Public
 */
export const getDroneById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let drone;

    // Check if ID is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      drone = await Drone.findById(id).populate('ownerId', 'name email phone avatar');
    } else {
      // Fallback: search by model string if legacy ID passed
      drone = await Drone.findOne({ model: id }).populate('ownerId', 'name email phone avatar');
    }

    if (!drone) {
      return sendError(res, {
        statusCode: 404,
        message: `Drone not found with identifier '${id}'.`
      });
    }

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Drone details retrieved successfully.',
      data: { drone }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/drones/:id
 * @desc    Update a drone (Owner must own drone, or user must be Admin)
 * @access  Private (Shop Owner or Admin)
 */
export const updateDrone = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, {
        statusCode: 400,
        message: 'Invalid drone identifier format.'
      });
    }

    const drone = await Drone.findById(id);

    if (!drone) {
      return sendError(res, {
        statusCode: 404,
        message: 'Drone not found.'
      });
    }

    // SECURITY: Verify ownership or admin privileges
    const isOwner = drone.ownerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin' || req.user.role === 'super-admin';

    if (!isOwner && !isAdmin) {
      return sendError(res, {
        statusCode: 403,
        message: 'Forbidden: You can only modify drones belonging to your shop fleet.'
      });
    }

    const allowedUpdates = [
      'name',
      'model',
      'brand',
      'category',
      'description',
      'image',
      'images',
      'isListed',
      'pricePerHour',
      'pricePerDay',
      'securityDeposit',
      'batteryLevel',
      'status',
      'availability',
      'shopName',
      'location',
      'specifications'
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'specifications') {
          drone.specifications = { ...(drone.specifications?.toObject?.() || {}), ...req.body.specifications };
        } else if (field === 'images') {
          drone.images = Array.isArray(req.body.images)
            ? req.body.images.filter((u) => typeof u === 'string' && u)
            : drone.images;
        } else if (field === 'status') {
          drone.status = req.body.status.toLowerCase();
          drone.availability =
            drone.status.charAt(0).toUpperCase() + drone.status.slice(1);
        } else if (field === 'availability') {
          drone.availability = req.body.availability;
          drone.status = req.body.availability.toLowerCase();
        } else {
          drone[field] = req.body[field];
        }
      }
    });

    // Sync specifications sub-schema fields if provided at root
    if (req.body.camera || req.body.flightTime || req.body.speed || req.body.weight || req.body.gps !== undefined) {
      drone.specifications = {
        ...drone.specifications,
        camera: req.body.camera || drone.specifications?.camera,
        flightTime: Number(req.body.flightTime) || drone.specifications?.flightTime,
        speed: req.body.speed || drone.specifications?.speed,
        weight: req.body.weight || drone.specifications?.weight,
        gps: req.body.gps !== undefined ? req.body.gps : drone.specifications?.gps
      };
    }

    // Recalculate reciprocal rates if either changed
    if (req.body.pricePerDay && !req.body.pricePerHour) {
      drone.pricePerHour = Math.round(Number(req.body.pricePerDay) / 8);
    } else if (req.body.pricePerHour && !req.body.pricePerDay) {
      drone.pricePerDay = Number(req.body.pricePerHour) * 8;
    }

    const updatedDrone = await drone.save();

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Drone updated successfully.',
      data: { drone: updatedDrone }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/drones/:id
 * @desc    Delete drone from fleet (Owner must own drone, or user must be Admin)
 * @access  Private (Shop Owner or Admin)
 */
export const deleteDrone = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, {
        statusCode: 400,
        message: 'Invalid drone identifier format.'
      });
    }

    const drone = await Drone.findById(id);

    if (!drone) {
      return sendError(res, {
        statusCode: 404,
        message: 'Drone not found.'
      });
    }

    // SECURITY: Verify ownership or admin privileges
    const isOwner = drone.ownerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin' || req.user.role === 'super-admin';

    if (!isOwner && !isAdmin) {
      return sendError(res, {
        statusCode: 403,
        message: 'Forbidden: You can only remove drones belonging to your shop fleet.'
      });
    }

    // PERMISSION CHECK: Block deletion if currently rented
    if (drone.status === 'rented') {
      return sendError(res, {
        statusCode: 400,
        message:
          'Cannot delete a drone that is currently rented out. Please complete or cancel active rentals before removal.'
      });
    }

    const upcoming = await Booking.countDocuments({
      droneId: drone._id,
      bookingStatus: { $in: ['approved', 'confirmed', 'active'] },
      endDate: { $gt: new Date() }
    });
    if (upcoming > 0) {
      return sendError(res, {
        statusCode: 400,
        message: `This drone has ${upcoming} upcoming confirmed rental(s). Hide it from the catalogue instead, or cancel those rentals first.`
      });
    }

    await drone.deleteOne();

    return sendSuccess(res, {
      statusCode: 200,
      message: `Drone '${drone.name}' was successfully removed from the fleet.`
    });
  } catch (error) {
    next(error);
  }
};


/**
 * @route   GET /api/drones/:id/availability
 * @desc    Date ranges already reserved for this drone (approved or active rentals)
 * @access  Public
 */
export const getDroneAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, { statusCode: 400, message: 'Invalid drone identifier format.' });
    }
    const bookings = await Booking.find({
      droneId: id,
      bookingStatus: { $in: ['approved', 'confirmed', 'active'] },
      endDate: { $gt: new Date() }
    })
      .select('startDate endDate bookingStatus')
      .sort({ startDate: 1 });

    return sendSuccess(res, {
      message: 'Availability retrieved.',
      data: {
        reserved: bookings.map((b) => ({ startDate: b.startDate, endDate: b.endDate, status: b.bookingStatus }))
      }
    });
  } catch (error) {
    next(error);
  }
};
