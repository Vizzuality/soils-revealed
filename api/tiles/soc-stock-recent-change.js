const ee = require('@google/earthengine');
const axios = require('axios').default;

const RAMP = `
  <RasterSymbolizer>
    <ColorMap extended="false" type="ramp">
    <ColorMapEntry color="#B30200" quantity="-1.6" opacity="1" />
    <ColorMapEntry color="#E34A33" quantity="-0.8" />
    <ColorMapEntry color="#FC8D59" quantity="-0.4" />
    <ColorMapEntry color="#FDCC8A" quantity="-0.2" />
    <ColorMapEntry color="#FFFFCC" quantity="0" />
    <ColorMapEntry color="#A1DAB4" quantity="0.2" />
    <ColorMapEntry color="#31B3BD" quantity="0.4" />
    <ColorMapEntry color="#1C9099" quantity="0.8" />
    <ColorMapEntry color="#066C59" quantity="1.6" />
    </ColorMap>
  </RasterSymbolizer>
`;

module.exports = ({ params: { year1, year2, x, y, z } }, res) => {
  try {
    const collection = ee.ImageCollection('projects/soils-revealed/Recent/SOC_stocks');

    const image = collection
      .filterDate(`${year2}-01-01`, `${year2}-12-31`)
      .first()
      .subtract(collection.filterDate(`${year1}-01-01`, `${year1}-12-31`).first())
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
