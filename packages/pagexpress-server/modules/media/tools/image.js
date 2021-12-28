const sharp = require('sharp');

/**
 * @typedef ImageDimensions
 * @property {string} width
 * @property {string} height
 */

/**
 * @param {string} imagePath
 * @returns Promise<ImageDimensions>
 */
const getMetadata = imagePath => sharp(imagePath).metadata();

module.exports = {
  getMetadata,
};
