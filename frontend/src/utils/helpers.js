/**
 * Color to Infection Level mapping (matches backend)
 */
export const COLOR_INFECTION_MAP = {
  'Yellow': { phRange: [5.5, 6.5], level: 'Healthy', color: 'bg-yellow-200', description: 'Healthy wound' },
  'Green': { phRange: [6.6, 7.2], level: 'Mild Risk', color: 'bg-green-200', description: 'Mild infection risk' },
  'Blue': { phRange: [7.3, 8.0], level: 'Medium Infection', color: 'bg-blue-300', description: 'Medium infection detected' },
  'Dark Blue': { phRange: [8.1, 14.0], level: 'High Infection', color: 'bg-blue-700', description: 'High infection - immediate attention' },
};

/**
 * Get infection level details
 */
export const getInfectionDetails = (level) => {
  for (const [color, details] of Object.entries(COLOR_INFECTION_MAP)) {
    if (details.level === level) {
      return { color, ...details };
    }
  }
  return null;
};

/**
 * Get status badge color
 */
export const getStatusBadgeColor = (infectionLevel) => {
  switch (infectionLevel) {
    case 'Healthy':
      return 'bg-green-100 text-green-800';
    case 'Mild Risk':
      return 'bg-yellow-100 text-yellow-800';
    case 'Medium Infection':
      return 'bg-orange-100 text-orange-800';
    case 'High Infection':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Format timestamp
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format time ago
 */
export const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return date.toLocaleDateString();
};
