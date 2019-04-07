#!/usr/bin/env node

const fs = require('fs');
const { min, max } = require('lodash/fp');

const { detectText } = require('./clients/aws');
const { selectTextPosition } = require('./selectors');
const { blurArea, getImageMetaData, calcPosition } = require('./image-processors');
const { init, prettyPrint } = require('./utils');

init(async args => {
  const fileName = args.file || `${__dirname}/../input/1.jpeg`;
  const outputFileName = args.output || 'output.jpeg';

  const imageBuffer = fs.readFileSync(fileName);

  const expectedConfidenceLevel = 85; // percentage
  const expectedTextLength = 3;

  // TextMeta contains rectangle position
  const textMeta = await detectText(
    imageBuffer,
    selectTextPosition({
      expectedConfidenceLevel,
      expectedTextLength,
    }),
  );

  if (!textMeta) {
    console.log('Text not found. Nothing to blur...');

    return;
  }

  const { width: imageWidth, height: imageHeight } = await getImageMetaData(imageBuffer);

  // Calculating pixel value for each point position
  const topLeftCorner = calcPosition(imageWidth, imageHeight, textMeta.topLeft);
  const topRightCorner = calcPosition(imageWidth, imageHeight, textMeta.topRight);
  const bottomRightCorner = calcPosition(imageWidth, imageHeight, textMeta.bottomRight);
  const bottomLeftCorner = calcPosition(imageWidth, imageHeight, textMeta.bottomLeft);

  const minX = min([topLeftCorner.x, topRightCorner.x, bottomRightCorner.x, bottomLeftCorner.x]);
  const minY = min([topLeftCorner.y, topRightCorner.y, bottomRightCorner.y, bottomLeftCorner.y]);
  const maxX = max([topLeftCorner.x, topRightCorner.x, bottomRightCorner.x, bottomLeftCorner.x]);
  const maxY = max([topLeftCorner.y, topRightCorner.y, bottomRightCorner.y, bottomLeftCorner.y]);

  // Final rectangle to blur
  const options = {
    top: minY,
    left: minX,
    width: maxX - minX,
    height: maxY - minY,
    blurLevel: 20,
    outputFileName,
  };

  prettyPrint('options', options);

  await blurArea(imageBuffer, options);
});
