const AWS = require('aws-sdk');

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

/**
 * Get a pregenerated tile based on its path
 * @param {string} path Path of the tile
 * @returns {Promise<AWS.S3.Body>}
 */
module.exports = path => {
  const bucketParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `tiles/${path}.png`,
  };

  return new Promise((resolve, reject) => {
    s3.getObject(bucketParams, function(err, data) {
      if (err) {
        reject(err);
        return;
      }

      resolve(data.Body);
    });
  });
};
