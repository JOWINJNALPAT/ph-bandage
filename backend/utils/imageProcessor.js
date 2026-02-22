const sharp = require('sharp');

/**
 * Extract average RGB color from an image buffer (memory-based, no disk required)
 * @param {Buffer} imageBuffer - Image buffer from multer memoryStorage
 * @returns {Promise<Object>} Object with r, g, b values
 */
const extractAverageColorFromBuffer = async (imageBuffer) => {
  try {
    const { data, info } = await sharp(imageBuffer)
      .resize(100, 100, { fit: 'cover' })
      .raw()
      .toBuffer({ resolveWithObject: true });

    let r = 0, g = 0, b = 0;
    let pixelCount = 0;

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

// Keep legacy path-based version for backwards compat
const extractAverageColor = async (imagePath) => {
  try {
    const { data, info } = await sharp(imagePath)
      .resize(100, 100, { fit: 'cover' })
      .raw()
      .toBuffer({ resolveWithObject: true });

    let r = 0, g = 0, b = 0;
    let pixelCount = 0;

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
  extractAverageColorFromBuffer,
};
