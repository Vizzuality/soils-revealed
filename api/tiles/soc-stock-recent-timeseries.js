const ee = require('@google/earthengine');
const axios = require('axios').default;

const RAMP = `
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
