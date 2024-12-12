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

const sendImage = (res, z, data) => {
  res.set('Content-Type', 'image/png');
  if (+z <= 5) {
    res.set('Cache-Control', 'public,max-age=604800');
  }
  return res.send(data);
};

const getOnTheFlyTile = async (scenario, year, x, y, z) => {
  return new Promise((resolve, reject) => {
    const baseline = ee.Image(
      ee
        .ImageCollection('projects/soils-revealed-307010/assets/Recent/SOC_stock_nov2020')
        .filterDate('2018-01-01', '2018-12-31')
        .first()
    );

    let diff = ee.Image(
      ee
        .ImageCollection(
          `projects/soils-revealed-307010/assets/Future/scenario_${SCENARIOS[scenario]}_dSOC`
        )
        .filterDate(`${year}-01-01`, `${year}-12-31`)
        .first()
    );

    diff = diff.updateMask(diff.mask().gt(0.001));

    const image = baseline.add(diff.unmask()).sldStyle(RAMP);

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

  const S3Path = `soc-stock-future-period/${SCENARIOS[scenario]}/stock/${depth}/${year}/${z}/${x}/${y}`;
  try {
    const image = await getPregeneratedTile(S3Path);
    sendImage(res, z, image);
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

      sendImage(res, z, Buffer.from(image));
    } catch (e) {
      res.status(404).end();
    }
  }
};
