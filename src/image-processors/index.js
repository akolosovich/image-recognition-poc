const sharp = require('sharp');

const maxPercentage = 100;

/**
 * @param {Buffer} imageBuffer
 * @param {Object} options
 */
const blurArea = async (imageBuffer, options) => {
  const { blurLevel, outputFileName } = options;

  const blurredPlates = await sharp(imageBuffer)
    .extract(options)
    .blur(blurLevel)
    .toBuffer();

  return (
    sharp(imageBuffer)
      .overlayWith(blurredPlates, options)
      // .composite([{ input: blurredPlates }])
      .toFile(outputFileName)
  );
};

/**
 * @param {Buffer} imageBuffer
 */
const getImageMetaData = imageBuffer => sharp(imageBuffer).metadata();

/**
 * @param {Number} width
 * @param {Number} height
 * @param {{ x: Number, y: Number }} coors
 * @returns {{ x: Number, y: Number }}
 */
const calcPosition = (width, height, coors) => ({
  x: Math.round((width * (coors.X * maxPercentage)) / maxPercentage),
  y: Math.round((height * (coors.Y * maxPercentage)) / maxPercentage),
});

module.exports = {
  blurArea,
  calcPosition,
  getImageMetaData,
};
