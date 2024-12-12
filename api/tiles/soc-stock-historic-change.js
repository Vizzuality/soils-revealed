const ee = require('@google/earthengine');
const axios = require('axios').default;

const { LAYERS } = require('../../components/map/constants');
const getPregeneratedTile = require('./pregenerated-tile');
const saveTile = require('./save-tile');

const IMAGE = {
  0: {
    historic: 'projects/soils-revealed-307010/assets/Historic/SOCS_0_30cm_year_NoLU_10km',
    recent: 'projects/soils-revealed-307010/assets/Historic/SOCS_0_30cm_year_2010AD_10km',
  },
  1: {
    historic: 'projects/soils-revealed-307010/assets/Historic/SOCS_0_100cm_year_NoLU_10km',
    recent: 'projects/soils-revealed-307010/assets/Historic/SOCS_0_100cm_year_2010AD_10km',
  },
  2: {
    historic: 'projects/soils-revealed-307010/assets/Historic/SOCS_0_200cm_year_NoLU_10km',
    recent: 'projects/soils-revealed-307010/assets/Historic/SOCS_0_200cm_year_2010AD_10km',
  },
};

const RAMP = {
  0: `
    <RasterSymbolizer>
      <ColorMap extended="false" type="ramp">
        <ColorMapEntry color="#B30200" quantity="-30" opacity="1" />
        <ColorMapEntry color="#E34A33" quantity="-22.5" />
        <ColorMapEntry color="#FC8D59" quantity="-15" />
        <ColorMapEntry color="#FDCC8A" quantity="-7.5" />
        <ColorMapEntry color="#FFFFCC" quantity="0" />
        <ColorMapEntry color="#A1DAB4" quantity="7.5" />
        <ColorMapEntry color="#31B3BD" quantity="15" />
        <ColorMapEntry color="#1C9099" quantity="22.5" />
        <ColorMapEntry color="#066C59" quantity="30" />
      </ColorMap>
    </RasterSymbolizer>
  `,
  1: `
    <RasterSymbolizer>
      <ColorMap extended="false" type="ramp">
        <ColorMapEntry color="#B30200" quantity="-60" opacity="1" />
        <ColorMapEntry color="#E34A33" quantity="-45" />
        <ColorMapEntry color="#FC8D59" quantity="-30" />
        <ColorMapEntry color="#FDCC8A" quantity="-15" />
        <ColorMapEntry color="#FFFFCC" quantity="0" />
        <ColorMapEntry color="#A1DAB4" quantity="15" />
        <ColorMapEntry color="#31B3BD" quantity="30" />
        <ColorMapEntry color="#1C9099" quantity="45" />
        <ColorMapEntry color="#066C59" quantity="60" />
      </ColorMap>
    </RasterSymbolizer>
  `,
  2: `
    <RasterSymbolizer>
      <ColorMap extended="false" type="ramp">
        <ColorMapEntry color="#B30200" quantity="-120" opacity="1" />
        <ColorMapEntry color="#E34A33" quantity="-90" />
        <ColorMapEntry color="#FC8D59" quantity="-60" />
        <ColorMapEntry color="#FDCC8A" quantity="-30" />
        <ColorMapEntry color="#FFFFCC" quantity="0" />
        <ColorMapEntry color="#A1DAB4" quantity="30" />
        <ColorMapEntry color="#31B3BD" quantity="60" />
        <ColorMapEntry color="#1C9099" quantity="90" />
        <ColorMapEntry color="#066C59" quantity="120" />
      </ColorMap>
    </RasterSymbolizer>
  `,
};

const sendImage = (res, data) => {
  res.set('Content-Type', 'image/png');
  return res.send(data);
};

const getOnTheFlyTile = async (depth, x, y, z) => {
  return new Promise((resolve, reject) => {
    const image = ee
      .Image(IMAGE[depth].recent)
      .subtract(ee.Image(IMAGE[depth].historic))
      .sldStyle(RAMP[depth]);

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

module.exports = async ({ params: { depth, x, y, z } }, res) => {
  const depthValue = LAYERS['soc-stock'].paramsConfig.settings.type.options
    .find(option => option.value === 'historic')
    .settings.depth.options[depth].label.replace(/\scm/, '');

  const S3Path = `soc-stock-historic-change/stock/${depthValue}/2010-NoLU/${z}/${x}/${y}`;

  try {
    const image = await getPregeneratedTile(S3Path);
    sendImage(res, image);
  } catch (e) {
    try {
      const image = await getOnTheFlyTile(depth, x, y, z);

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
