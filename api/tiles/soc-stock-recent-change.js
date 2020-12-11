const ee = require('@google/earthengine');
const axios = require('axios').default;

const { LAYERS } = require('../../components/map/constants');
const getPregeneratedTile = require('./pregenerated-tile');
const saveTile = require('./save-tile');

const RAMP = `
  <RasterSymbolizer>
    <ColorMap extended="false" type="ramp">
      <ColorMapEntry color="#B30200" quantity="-10" opacity="1" />
      <ColorMapEntry color="#E34A33" quantity="-7.5" />
      <ColorMapEntry color="#FC8D59" quantity="-5" />
      <ColorMapEntry color="#FDCC8A" quantity="-2.5" />
      <ColorMapEntry color="#FFFFCC" quantity="0" />
      <ColorMapEntry color="#A1DAB4" quantity="2.5" />
      <ColorMapEntry color="#31B3BD" quantity="5" />
      <ColorMapEntry color="#1C9099" quantity="7.5" />
      <ColorMapEntry color="#066C59" quantity="10" />
    </ColorMap>
  </RasterSymbolizer>
`;

const sendImage = (res, data) => {
  res.set('Content-Type', 'image/png');
  return res.send(data);
};

const getOnTheFlyTile = async (year1, year2, x, y, z) => {
  return new Promise((resolve, reject) => {
    const collection = ee.ImageCollection('projects/soils-revealed/Recent/SOC_stock_nov2020');

    const image = collection
      .filterDate(`${year2}-01-01`, `${year2}-12-31`)
      .first()
      .subtract(collection.filterDate(`${year1}-01-01`, `${year1}-12-31`).first())
      .sldStyle(RAMP);

    image.getMap({}, async ({ formatTileUrl }) => {
      const url = formatTileUrl(x, y, z);
      axios
        .get(url, {
          headers: { Accept: 'image/*' },
          responseType: 'arraybuffer',
        })
        .then(({ data }) => resolve(data))
        .catch(reject);
    });
  });
};

module.exports = async ({ params: { year1, year2, x, y, z } }, res) => {
  const depth = LAYERS['soc-stock'].paramsConfig.settings.type.options
    .find(option => option.value === 'recent')
    .settings.depth.options[0].label.replace(/\scm/, '');

  const S3Path = `soc-stock-recent-change/stock/${depth}/${year2}-${year1}/${z}/${x}/${y}`;

  try {
    const image = await getPregeneratedTile(S3Path);
    sendImage(res, image);
  } catch (e) {
    try {
      const image = await getOnTheFlyTile(year1, year2, x, y, z);

      // We save the data to the S3 bucket
      if (+z <= +process.env.AWS_MAX_Z_TILE_STORAGE) {
        try {
          await saveTile(S3Path, image);
        } catch (e) {
          console.log(`> Unable to save tile in S3 (${S3Path})`);
        }
      }

      sendImage(res, Buffer.from(image));
    } catch (e) {
      res.status(404).end();
    }
  }
};
