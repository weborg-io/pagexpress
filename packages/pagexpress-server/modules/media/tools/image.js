const sharp = require('sharp');

/**
 * @typedef ImageMetadata
 * @property {string} width
 * @property {string} height
 * @property {string} format
 * @property {number} size
 */

/**
 * @typedef TransformationOptions
 * @property {string} width
 * @property {string} height
 * @property {string} format
 */

/**
 * @param {string} imagePath
 * @returns Promise<ImageMetadata>
 */
const getMetadata = imagePath => sharp(imagePath).metadata();

/**
 * @param {any} image
 * @param {string|number} width
 * @param {string|number} height
 * @param {string} format
 * @returns {Sharp}
 */
const getImageTransformer = (image, { width, height, format }) => {
  const transformer = sharp(image);

  if (width || height) {
    transformer.resize({
      width: width ? parseInt(width) : undefined,
      height: height ? parseInt(height) : undefined,
      withoutEnlargement: true,
    });
  }

  if (format) {
    transformer.toFormat(format);
  }

  return transformer;
};

/**
 *
 * @param {any} image
 * @param {TransformationOptions} options
 * @returns {Promise<Buffer>}
 */
const process = (image, options = {}) => {
  const transformer = getImageTransformer(image, options);

  return transformer.toBuffer({ resolveWithObject: true });
};

module.exports = {
  process,
  getMetadata,
  getImageTransformer,
};
