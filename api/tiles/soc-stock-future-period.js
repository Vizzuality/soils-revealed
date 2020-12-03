const ee = require('@google/earthengine');
const axios = require('axios').default;

const SCENARIOS = {
  '00': 'crop_MGI',
  '01': 'crop_I',
  '02': 'crop_MG',
  '03': 'grass_full',
  '04': 'grass_part',
  '10': 'rewilding',
  '20': 'degradation_NoDeforestation',
  '21': 'degradation_ForestToCrop',
  '22': 'degradation_ForestToGrass',
};

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

module.exports = ({ params: { scenario, year, x, y, z } }, res) => {
  try {
    const baseline = ee.Image(
      ee
        .ImageCollection('projects/soils-revealed/Recent/SOC_stock_nov2020')
        .filterDate('2018-01-01', '2018-12-31')
        .first()
    );

    let diff = ee.Image(
      ee
        .ImageCollection(`projects/soils-revealed/Future/scenario_${SCENARIOS[scenario]}_dSOC`)
        .filterDate(`${year}-01-01`, `${year}-12-31`)
        .first()
    );

    diff = diff.updateMask(diff.mask().gt(0.001));

    const image = baseline.add(diff.unmask()).sldStyle(RAMP);

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
