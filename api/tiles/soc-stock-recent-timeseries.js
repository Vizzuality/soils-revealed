const ee = require('@google/earthengine');
const axios = require('axios').default;

const RAMP = `
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

module.exports = ({ params: { year, x, y, z } }, res) => {
  try {
    const image = ee
      .Image(
        ee
          .ImageCollection('projects/soils-revealed/Recent/SOC_stocks')
          .filterDate(`${year}-01-01`, `${year}-12-31`)
          .first()
      )
      .sldStyle(RAMP);

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
