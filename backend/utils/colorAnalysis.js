// Color detection mapping
const COLOR_TO_PH_MAP = {
  'Yellow': { min: 5.5, max: 6.5, range: [5.5, 6.5] },
  'Green': { min: 6.6, max: 7.2, range: [6.6, 7.2] },
  'Blue': { min: 7.3, max: 8.0, range: [7.3, 8.0] },
  'Dark Blue': { min: 8.1, max: 14.0, range: [8.1, 14.0] },
};

const INFECTION_LEVELS = {
  'Healthy': { colors: ['Yellow'], phRange: [5.5, 6.5] },
  'Mild Risk': { colors: ['Green'], phRange: [6.6, 7.2] },
  'Medium Infection': { colors: ['Blue'], phRange: [7.3, 8.0] },
  'High Infection': { colors: ['Dark Blue'], phRange: [8.1, 14.0] },
};

/**
 * Convert RGB values to color name
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {string} Color name
 */
const rgbToColor = (r, g, b) => {
  // Normalize RGB values
  const red = Math.round((r / 255) * 100);
  const green = Math.round((g / 255) * 100);
  const blue = Math.round((b / 255) * 100);

  // Simple color detection logic
  if (red > 80 && green > 60 && blue < 40) {
    return 'Yellow'; // High red and green, low blue
  } else if (red < 60 && green > 80 && blue < 80) {
    return 'Green'; // High green
  } else if (red < 60 && green < 80 && blue > 80) {
    return 'Blue'; // High blue
  } else if (red < 50 && green < 50 && blue > 100) {
    return 'Dark Blue'; // Very high blue
  }

  // Default detection based on dominant color
  if (red > green && red > blue) {
    if (green > 60) return 'Yellow';
    return 'Yellow';
  } else if (green > red && green > blue) {
    return 'Green';
  } else if (blue > red && blue > green) {
    if (blue > 100 || (red < 50 && green < 50)) return 'Dark Blue';
    return 'Blue';
  }

  return 'Green'; // Default fallback
};

/**
 * Convert color to pH value
 * @param {string} color - Color name
 * @returns {number} pH value
 */
const colorToPhValue = (color) => {
  const phRange = COLOR_TO_PH_MAP[color];
  if (!phRange) {
    throw new Error(`Unknown color: ${color}`);
  }

  // Return midpoint of the range for the color
  return (phRange.min + phRange.max) / 2;
};

/**
 * Determine infection level from pH value
 * @param {number} phValue - pH value
 * @returns {string} Infection level
 */
const getInfectionLevel = (phValue) => {
  if (phValue >= 5.5 && phValue <= 6.5) {
    return 'Healthy';
  } else if (phValue >= 6.6 && phValue <= 7.2) {
    return 'Mild Risk';
  } else if (phValue >= 7.3 && phValue <= 8.0) {
    return 'Medium Infection';
  } else if (phValue > 8.0) {
    return 'High Infection';
  }

  return 'Unknown';
};

/**
 * Get color from pH value
 * @param {number} phValue - pH value
 * @returns {string} Color name
 */
const phToColor = (phValue) => {
  if (phValue >= 5.5 && phValue <= 6.5) {
    return 'Yellow';
  } else if (phValue >= 6.6 && phValue <= 7.2) {
    return 'Green';
  } else if (phValue >= 7.3 && phValue <= 8.0) {
    return 'Blue';
  } else if (phValue > 8.0) {
    return 'Dark Blue';
  }

  return 'Unknown';
};

module.exports = {
  rgbToColor,
  colorToPhValue,
  getInfectionLevel,
  phToColor,
  COLOR_TO_PH_MAP,
  INFECTION_LEVELS,
};
