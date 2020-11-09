const ee = require('@google/earthengine');
const axios = require('axios').default;

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

module.exports = ({ params: { type, depth, year, x, y, z } }, res) => {
  try {
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
      const serverPromise = axios.get(url, {
        headers: { Accept: 'image/*' },
        responseType: 'arraybuffer',
      });
      await serverPromise.then(serverResponse => {
        res.set('Content-Type', 'image/png');
        res.set('Cache-Control', 'public,max-age=604800');
        return res.send(Buffer.from(serverResponse.data));
      });
    });
  } catch (e) {
    res.status(404).end();
  }
};
