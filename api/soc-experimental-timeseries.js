const ee = require('@google/earthengine');
const axios = require('axios').default;

const STOCK_RAMP = `
  <RasterSymbolizer>
    <ColorMap extended="false" type="ramp">
      <ColorMapEntry color="#E18D67" quantity="5" opacity="1" />
      <ColorMapEntry color="#CB5A3A" quantity="20" />
      <ColorMapEntry color="#9D4028" quantity="50" />
      <ColorMapEntry color="#6D2410" quantity="75" />
      <ColorMapEntry color="#380E03" quantity="200" />
    </ColorMap>
  </RasterSymbolizer>
`;

const CONCENTRATION_RAMP = `
  <RasterSymbolizer>
    <ColorMap extended="false" type="ramp">
      <ColorMapEntry color="#E18D67" quantity="5" opacity="1" />
      <ColorMapEntry color="#CB5A3A" quantity="15" />
      <ColorMapEntry color="#9D4028" quantity="30" />
      <ColorMapEntry color="#6D2410" quantity="50" />
      <ColorMapEntry color="#380E03" quantity="75" />
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
            .ImageCollection('projects/soils-revealed/experimental-dataset/SOC_stock_0_30')
            .filterDate(`${year}-01-01`, `${year}-12-31`)
            .first()
        )
        .sldStyle(STOCK_RAMP);
    } else if (type === 'concentration') {
      image = ee
        .Image(
          ee
            .ImageCollection('projects/soils-revealed/experimental-dataset/SOC_concentration')
            .filterDate(`${year}-01-01`, `${year}-12-31`)
            .first()
        )
        .divide(10)
        .select(Number.isNaN(+depth) ? 'b1' : `b${+depth + 1}`)
        .sldStyle(CONCENTRATION_RAMP);
    } else {
      throw new Error('Unknown type');
    }

    image.getMap({}, async ({ formatTileUrl }) => {
      const url = formatTileUrl(x, y, z);
      const serverPromise = axios.get(url, {
        headers: { Accept: 'image/*' },
        responseType: 'arraybuffer',
      });
      await serverPromise.then(serverResponse => {
        res.set('Content-Type', 'image/png');
        return res.send(Buffer.from(serverResponse.data));
      });
    });
  } catch (e) {
    res.status(404).end();
  }
};
