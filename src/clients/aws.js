const awsClient = require('aws-sdk');
const path = require('path');

const awsConfigPath = path.resolve(`${__dirname}/../../config/aws.config.json`);

awsClient.config.loadFromPath(awsConfigPath);

const rekognition = new awsClient.Rekognition();

/**
 * @param {Buffer} buffer
 * @param {Function?} resultSelector
 */
const detectText = (buffer, resultSelector) =>
  new Promise((resolve, reject) => {
    rekognition.detectText(
      {
        Image: { Bytes: buffer },
      },
      (err, data) => {
        if (err) {
          return reject(err);
        }

        if (resultSelector) {
          return resolve(resultSelector(data));
        }

        resolve(data);
      },
    );
  });

module.exports = {
  detectText,
};
