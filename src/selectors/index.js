const { get, filter, flow, first } = require('lodash/fp');

const selectTextPosition = ({ expectedConfidenceLevel, expectedTextLength }) =>
  flow(
    get('TextDetections'),
    filter(
      x => x.Type === 'LINE' && x.Confidence > expectedConfidenceLevel && x.DetectedText.length >= expectedTextLength,
    ),
    first,
    get('Geometry.Polygon'),
    x =>
      x
        ? {
            topLeft: x[0],
            topRight: x[1],
            bottomRight: x[2],
            bottomLeft: x[3],
          }
        : null,
  );

module.exports = {
  selectTextPosition,
};
