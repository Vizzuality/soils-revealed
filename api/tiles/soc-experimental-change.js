const ee = require('@google/earthengine');
const axios = require('axios').default;

const { LAYERS } = require('../../components/map/constants');
const getPregeneratedTile = require('./pregenerated-tile');

const STOCK_RAMP = `
  <RasterSymbolizer>
    <ColorMap extended="false" type="ramp">
      <ColorMapEntry color="#B30200" quantity="-20" opacity="1" />
      <ColorMapEntry color="#E34A33" quantity="-15" />
      <ColorMapEntry color="#FC8D59" quantity="-10" />
      <ColorMapEntry color="#FDCC8A" quantity="-5" />
      <ColorMapEntry color="#FFFFCC" quantity="0" />
      <ColorMapEntry color="#A1DAB4" quantity="5" />
      <ColorMapEntry color="#31B3BD" quantity="10" />
      <ColorMapEntry color="#1C9099" quantity="15" />
      <ColorMapEntry color="#066C59" quantity="20" />
    </ColorMap>
  </RasterSymbolizer>
`;

const CONCENTRATION_RAMP = `
  <RasterSymbolizer>
    <ColorMap extended="false" type="ramp">
      <ColorMapEntry color="#B30200" quantity="-5" opacity="1" />
      <ColorMapEntry color="#E34A33" quantity="-3.75" />
      <ColorMapEntry color="#FC8D59" quantity="-2.5" />
      <ColorMapEntry color="#FDCC8A" quantity="-1.25" />
      <ColorMapEntry color="#FFFFCC" quantity="0" />
      <ColorMapEntry color="#A1DAB4" quantity="1.25" />
      <ColorMapEntry color="#31B3BD" quantity="2.5" />
      <ColorMapEntry color="#1C9099" quantity="3.75" />
      <ColorMapEntry color="#066C59" quantity="5" />
    </ColorMap>
  </RasterSymbolizer>
`;

const sendImage = (res, data) => {
  res.set('Content-Type', 'image/png');
  return res.send(Buffer.from(data));
};

const getOnTheFlyTile = async (type, depth, year1, year2, x, y, z) => {
  return new Promise((resolve, reject) => {
    let image;

    if (type === 'stock') {
      const collection = ee.ImageCollection(
        'projects/soils-revealed/experimental-dataset/SOC_stock'
      );

      image = collection
        .filterDate(`${year2}-01-01`, `${year2}-12-31`)
        .first()
        .subtract(collection.filterDate(`${year1}-01-01`, `${year1}-12-31`).first())
        .divide(10)
        .select('b1')
        .sldStyle(STOCK_RAMP);
    } else if (type === 'concentration') {
      const collection = ee.ImageCollection(
        'projects/soils-revealed/experimental-dataset/SOC_concentration_2020'
      );

      let startImage = collection.filterDate(`${year1}-01-01`, `${year1}-12-31`).first();
      let endImage = collection.filterDate(`${year2}-01-01`, `${year2}-12-31`).first();

      startImage = startImage.updateMask(startImage.gt(0));
      endImage = endImage.updateMask(endImage.gt(0));

      image = endImage
        .subtract(startImage)
        .select(`b${+depth + 1}`)
        .sldStyle(CONCENTRATION_RAMP);
    }

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

module.exports = async ({ params: { type, depth, year1, year2, x, y, z } }, res) => {
  try {
    const depthValue = LAYERS['soc-experimental'].paramsConfig.settings.type.options
      .find(option => option.value === type)
      .settings.depth.options[depth].label.replace(/\scm/, '');

    const image = await getPregeneratedTile([
      'soc-experimental-change',
      type,
      depthValue,
      `${year2}-${year1}`,
      z,
      x,
      y,
    ]);

    sendImage(res, image);
  } catch (e) {
    // Until zoom 9 included, we only retrieve the tiles from the bucket
    if (+z <= 9) {
      res.status(404).end();
    } else {
      try {
        const image = await getOnTheFlyTile(type, depth, year1, year2, x, y, z);
        sendImage(res, image);
      } catch (e) {
        res.status(404).end();
      }
    }
  }
};
