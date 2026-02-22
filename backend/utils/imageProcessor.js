const sharp = require('sharp');

/**
 * Extract average RGB color from image file
 * @param {string} imagePath - Path to the image file
 * @returns {Promise<Object>} Object with r, g, b values
 */
const extractAverageColor = async (imagePath) => {
  try {
    const { data, info } = await sharp(imagePath)
      .resize(100, 100, { fit: 'cover' })
      .raw()
      .toBuffer({ resolveWithObject: true });

    let r = 0,
      g = 0,
      b = 0;
    let pixelCount = 0;

    // Calculate average RGB from the 100x100 image
    for (let i = 0; i < data.length; i += info.channels) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      pixelCount++;
    }

    return {
      r: Math.round(r / pixelCount),
      g: Math.round(g / pixelCount),
      b: Math.round(b / pixelCount),
    };
  } catch (error) {
    throw new Error(`Failed to extract color from image: ${error.message}`);
  }
};

module.exports = {
  extractAverageColor,
};
