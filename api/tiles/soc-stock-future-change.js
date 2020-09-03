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
      <ColorMapEntry color="#B30200" quantity="-4" opacity="1" />
      <ColorMapEntry color="#E34A33" quantity="-3" />
      <ColorMapEntry color="#FC8D59" quantity="-2" />
      <ColorMapEntry color="#FDCC8A" quantity="-1" />
      <ColorMapEntry color="#FFFFCC" quantity="0" />
      <ColorMapEntry color="#A1DAB4" quantity="1" />
      <ColorMapEntry color="#31B3BD" quantity="2" />
      <ColorMapEntry color="#1C9099" quantity="3" />
      <ColorMapEntry color="#066C59" quantity="4" />
    </ColorMap>
  </RasterSymbolizer>
`;

const DEGRADATION_RAMP = `
  <RasterSymbolizer>
    <ColorMap extended="false" type="ramp">
      <ColorMapEntry color="#B30200" quantity="-30" opacity="1" />
      <ColorMapEntry color="#E34A33" quantity="-24" />
      <ColorMapEntry color="#FC8D59" quantity="-18" />
      <ColorMapEntry color="#FDCC8A" quantity="-8" />
      <ColorMapEntry color="#FFFFCC" quantity="0" />
      <ColorMapEntry color="#A1DAB4" quantity="8" />
      <ColorMapEntry color="#31B3BD" quantity="18" />
      <ColorMapEntry color="#1C9099" quantity="24" />
      <ColorMapEntry color="#066C59" quantity="30" />
    </ColorMap>
  </RasterSymbolizer>
`;

module.exports = ({ params: { scenario, year, x, y, z } }, res) => {
  try {
    const image = ee
      .Image(
        ee
          .ImageCollection(`projects/soils-revealed/Future/scenario_${SCENARIOS[scenario]}_dSOC`)
          .filterDate(`${year}-01-01`, `${year}-12-31`)
          .first()
      )
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
