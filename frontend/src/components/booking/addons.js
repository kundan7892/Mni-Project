/**
 * Rental add-ons. Prices are enforced by the backend: keep in sync with backend/utils/pricing.js.
 */
export const ADDONS = [
  { id: 'addon-battery', name: 'Extra flight battery', description: 'About 40 more minutes in the air per swap.', price: 500, priceType: 'perDay' },
  { id: 'addon-insurance', name: 'Full damage protection', description: 'No deductible for accidental damage or crashes.', price: 500, priceType: 'perDay' },
  { id: 'addon-propellers', name: 'Spare propeller kit', description: 'Eight quick-release low-noise blades.', price: 300, priceType: 'flat' },
  { id: 'addon-case', name: 'Hard travel case', description: 'Waterproof case with custom foam.', price: 200, priceType: 'flat' },
  { id: 'addon-memory', name: '128 GB microSD card', description: 'V30 card for 4K and higher recording.', price: 250, priceType: 'flat' }
]

export const ADDON_LABELS = Object.fromEntries(ADDONS.map((a) => [a.id, a.name]))
