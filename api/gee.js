const ee = require('@google/earthengine');

const privateKey = require('../gee.key.json');

ee.data.authenticateViaPrivateKey(
  privateKey,
  () => {
    ee.initialize();
    console.log('> GEE authenticate and initialized');
  },
  err => {
    console.log('> GEE authentication failed');
    console.log(err);
  }
);

module.exports = (req, res) => {
  const baseUrl = 'https://earthengine.googleapis.com';

  const image = ee.Image(req.params.imageId);
  image.getMap({}, ({ mapId, token }) => {
    res.redirect(
      `${baseUrl}/map/${mapId}/${req.params.z}/${req.params.x}/${req.params.y}.png?token=${token}`
    );
  });
};
