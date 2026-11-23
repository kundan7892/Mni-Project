/**
 * Server-side source of truth for rental pricing.
 * Keep in sync with frontend/src/components/booking/RentalOptions.jsx (availableAddons).
 */
export const ADDONS = {
  'addon-battery': { name: 'Extra flight battery', price: 500, priceType: 'perDay' },
  'addon-insurance': { name: 'Full damage protection', price: 500, priceType: 'perDay' },
  'addon-propellers': { name: 'Spare propeller kit', price: 300, priceType: 'flat' },
  'addon-case': { name: 'Hard travel case', price: 200, priceType: 'flat' },
  'addon-memory': { name: '128 GB microSD card', price: 250, priceType: 'flat' }
};

const DAY_MS = 24 * 60 * 60 * 1000;

export const getDurations = (start, end) => {
  const diffMs = end.getTime() - start.getTime();
  return {
    durationHours: Math.max(1, Math.ceil(diffMs / (60 * 60 * 1000))),
    durationDays: Math.max(1, Math.ceil(diffMs / DAY_MS))
  };
};

/**
 * Rentals are priced per day. Sub-day rentals use the hourly rate when one is set.
 */
export const calculateQuote = (drone, start, end, selectedAddons = []) => {
  const { durationHours, durationDays } = getDurations(start, end);

  const baseCost =
    durationHours < 24 && drone.pricePerHour > 0
      ? durationHours * drone.pricePerHour
      : durationDays * drone.pricePerDay;

  const validAddons = [...new Set(selectedAddons)].filter((id) => ADDONS[id]);
  const addonsTotal = validAddons.reduce((sum, id) => {
    const addon = ADDONS[id];
    return sum + (addon.priceType === 'perDay' ? addon.price * durationDays : addon.price);
  }, 0);

  return {
    durationHours,
    durationDays,
    baseCost,
    addonsTotal,
    selectedAddons: validAddons,
    totalPrice: baseCost + addonsTotal,
    securityDeposit: drone.securityDeposit ?? 0
  };
};
