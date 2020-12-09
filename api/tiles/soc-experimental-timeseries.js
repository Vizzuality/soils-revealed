const ee = require('@google/earthengine');
const axios = require('axios').default;

const { LAYERS } = require('../../components/map/constants');
const getPregeneratedTile = require('./pregenerated-tile');

const STOCK_RAMP = `
  <RasterSymbolizer>
    <ColorMap extended="false" type="ramp">
      <ColorMapEntry color="#FFD0BB" quantity="0" opacity="1" />
      <ColorMapEntry color="#FFB492" quantity="20" />
      <ColorMapEntry color="#E18D67" quantity="40" />
      <ColorMapEntry color="#B74829" quantity="60" />
      <ColorMapEntry color="#903116" quantity="80" />
      <ColorMapEntry color="#631E0B" quantity="100" />
      <ColorMapEntry color="#2A0A02" quantity="120" />
    </ColorMap>
  </RasterSymbolizer>
`;

const CONCENTRATION_RAMP = `
  <RasterSymbolizer>
    <ColorMap extended="false" type="ramp">
      <ColorMapEntry color="#FFD0BB" quantity="0" opacity="1" />
      <ColorMapEntry color="#FFB492" quantity="10" />
      <ColorMapEntry color="#E18D67" quantity="20" />
      <ColorMapEntry color="#B74829" quantity="30" />
      <ColorMapEntry color="#903116" quantity="40" />
      <ColorMapEntry color="#631E0B" quantity="50" />
      <ColorMapEntry color="#2A0A02" quantity="60" />
    </ColorMap>
  </RasterSymbolizer>
`;

const sendImage = (res, z, data) => {
  res.set('Content-Type', 'image/png');
  if (+z <= 5) {
    res.set('Cache-Control', 'public,max-age=604800');
  }
  return res.send(Buffer.from(data));
};

const getOnTheFlyTile = async (type, depth, year, x, y, z) => {
  return new Promise((resolve, reject) => {
    let image;

    if (type === 'stock') {
      image = ee
        .Image(
          ee
            .ImageCollection('projects/soils-revealed/experimental-dataset/SOC_stock')
            .filterDate(`${year}-01-01`, `${year}-12-31`)
            .first()
        )
        .divide(10)
        .select('b1')
        .sldStyle(STOCK_RAMP);
    } else if (type === 'concentration') {
      image = ee
        .Image(
          ee
            .ImageCollection('projects/soils-revealed/experimental-dataset/SOC_concentration_2020')
            .filterDate(`${year}-01-01`, `${year}-12-31`)
            .first()
        )
        .select(`b${+depth + 1}`);

      image = image.updateMask(image.gt(0)).sldStyle(CONCENTRATION_RAMP);
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

module.exports = async ({ params: { type, depth, year, x, y, z } }, res) => {
  try {
    const depthValue = LAYERS['soc-experimental'].paramsConfig.settings.type.options
      .find(option => option.value === type)
      .settings.depth.options[depth].label.replace(/\scm/, '');

    const image = await getPregeneratedTile([
      'soc-experimental-timeseries',
      type,
      depthValue,
      year,
      z,
      x,
      y,
    ]);

    sendImage(res, z, image);
  } catch (e) {
    // Until zoom 9 included, we only retrieve the tiles from the bucket
    if (+z <= 9) {
      res.status(404).end();
    } else {
      try {
        const image = await getOnTheFlyTile(type, depth, year, x, y, z);
        sendImage(res, z, image);
      } catch (e) {
        res.status(404).end();
      }
    }
  }
};
