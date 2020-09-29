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

const CROP_GRASS_REWILDING_RAMP = `
  <RasterSymbolizer>
    <ColorMap extended="false" type="ramp">
      <ColorMapEntry color="#B30200" quantity="-20" opacity="1" />
      <ColorMapEntry color="#E34A33" quantity="-10" />
      <ColorMapEntry color="#FC8D59" quantity="-5" />
      <ColorMapEntry color="#FDCC8A" quantity="-2.5" />
      <ColorMapEntry color="#FFFFCC" quantity="0" />
      <ColorMapEntry color="#A1DAB4" quantity="2.5" />
      <ColorMapEntry color="#31B3BD" quantity="5" />
      <ColorMapEntry color="#1C9099" quantity="10" />
      <ColorMapEntry color="#066C59" quantity="20" />
    </ColorMap>
  </RasterSymbolizer>
`;

const DEGRADATION_RAMP = `
  <RasterSymbolizer>
    <ColorMap extended="false" type="ramp">
      <ColorMapEntry color="#B30200" quantity="-40" opacity="1" />
      <ColorMapEntry color="#E34A33" quantity="-30" />
      <ColorMapEntry color="#FC8D59" quantity="-20" />
      <ColorMapEntry color="#FDCC8A" quantity="-10" />
      <ColorMapEntry color="#FFFFCC" quantity="0" />
      <ColorMapEntry color="#A1DAB4" quantity="10" />
      <ColorMapEntry color="#31B3BD" quantity="20" />
      <ColorMapEntry color="#1C9099" quantity="30" />
      <ColorMapEntry color="#066C59" quantity="40" />
    </ColorMap>
  </RasterSymbolizer>
`;

module.exports = ({ params: { scenario, year, x, y, z } }, res) => {
  try {
    let diff = ee.Image(
      ee
        .ImageCollection(`projects/soils-revealed/Future/scenario_${SCENARIOS[scenario]}_dSOC`)
        .filterDate(`${year}-01-01`, `${year}-12-31`)
        .first()
    );
    diff = diff.updateMask(diff.mask().gt(0.001));

    const baseline = ee.Image(
      ee
        .ImageCollection('projects/soils-revealed/Recent/SOC_stocks')
        .filterDate('2018-01-01', '2018-12-31')
        .first()
    );

    const image = baseline
      .multiply(0.0)
      .add(diff.unmask())
      .sldStyle(scenario[0] === '2' ? DEGRADATION_RAMP : CROP_GRASS_REWILDING_RAMP);

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
