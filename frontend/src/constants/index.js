// Category display colors — used for badges and the donut chart.
// These are raw hex values because Tailwind cannot generate dynamic class names at runtime.
export const CATEGORY_COLORS = {
  Food:          '#6366F1',
  Transport:     '#3B82F6',
  Entertainment: '#8B5CF6',
  Housing:       '#10B981',
  Health:        '#F59E0B',
  Shopping:      '#EF4444',
  Other:         '#94A3B8',
};

// Fallback list used when the Categories API is unavailable.
export const DEFAULT_CATEGORIES = [
  'Food',
  'Transport',
  'Entertainment',
  'Housing',
  'Health',
  'Shopping',
  'Other',
];
