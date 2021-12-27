const { promisify } = require('util');
const sizeOf = promisify(require('image-size'));

/**
 * @typedef ImageDimensions
 * @property {string} width
 * @property {string} width
 */

/**
 * @param {string} imagePath
 * @returns {ImageDimensions}
 */
module.exports = imagePath => sizeOf(imagePath);
