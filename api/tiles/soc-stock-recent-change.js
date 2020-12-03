const ee = require('@google/earthengine');
const axios = require('axios').default;

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

module.exports = ({ params: { year1, year2, x, y, z } }, res) => {
  try {
    const collection = ee.ImageCollection('projects/soils-revealed/Recent/SOC_stock_nov2020');

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
        if (z > 4) {
          res.set('Cache-Control', 'public,max-age=604800');
        }
        return res.send(Buffer.from(serverResponse.data));
      });
    });
  } catch (e) {
    res.status(404).end();
  }
};
