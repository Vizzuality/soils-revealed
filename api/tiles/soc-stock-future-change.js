const ee = require('@google/earthengine');
const axios = require('axios').default;

const { LAYERS } = require('../../components/map/constants');
const getPregeneratedTile = require('./pregenerated-tile');
const saveTile = require('./save-tile');

const SCENARIOS = {
  '00': 'crop_MGI',
  '01': 'crop_I',
  '02': 'crop_MG',
  '03': 'grass_part',
  '04': 'grass_full',
  '10': 'rewilding',
  '20': 'degradation_NoDeforestation',
  '21': 'degradation_ForestToCrop',
  '22': 'degradation_ForestToGrass',
};

const CROP_GRASS_REWILDING_RAMP = `
  <RasterSymbolizer>
    <ColorMap extended="false" type="ramp">
      <ColorMapEntry color="#B30200" quantity="-20" opacity="1" />
      <ColorMapEntry color="#E34A33" quantity="-15" />
      <ColorMapEntry color="#FC8D59" quantity="-10" />
      <ColorMapEntry color="#FDCC8A" quantity="-5" />
      <ColorMapEntry color="#FFFFCC" quantity="0" />
      <ColorMapEntry color="#A1DAB4" quantity="5" />
      <ColorMapEntry color="#31B3BD" quantity="10" />
      <ColorMapEntry color="#1C9099" quantity="15" />
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

const sendImage = (res, data) => {
  res.set('Content-Type', 'image/png');
  return res.send(data);
};

const getOnTheFlyTile = async (scenario, year, x, y, z) => {
  return new Promise((resolve, reject) => {
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

module.exports = async ({ params: { scenario, year, x, y, z } }, res) => {
  const depth = LAYERS['soc-stock'].paramsConfig.settings.type.options
    .find(option => option.value === 'future')
    .settings.depth.options[0].label.replace(/\scm/, '');

  const S3Path = `soc-stock-future-change/${SCENARIOS[scenario]}/stock/${depth}/${year}-2018/${z}/${x}/${y}`;
  try {
    const image = await getPregeneratedTile(S3Path);
    sendImage(res, image);
  } catch (e) {
    try {
      const image = await getOnTheFlyTile(scenario, year, x, y, z);

      // We save the data to the S3 bucket
      if (+z <= +process.env.AWS_MAX_Z_TILE_STORAGE) {
        try {
          await saveTile(S3Path, image);
        } catch (e) {
          console.log(`> Unable to save tile in S3 (${S3Path})`);
        }
      }

      sendImage(res, Buffer.from(image));
    } catch (e) {
      res.status(404).end();
    }
  }
};
