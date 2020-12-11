const AWS = require('aws-sdk');

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

/**
 * Save a tile in S3
 * @param {string} path Path of the tile
 * @param {Buffer} file Tile
 */
module.exports = (path, file) => {
  return new Promise((resolve, reject) => {
    s3.putObject(
      {
        Key: `tiles/${path}.png`,
        Bucket: process.env.AWS_BUCKET_NAME,
        ContentType: 'image/png',
        Body: file,
      },
      function(err) {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      }
    );
  });
};
