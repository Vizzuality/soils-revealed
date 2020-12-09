const ee = require('@google/earthengine');
const axios = require('axios').default;

const { LAYERS } = require('../../components/map/constants');
const getPregeneratedTile = require('./pregenerated-tile');

const IMAGE = {
  0: {
    historic: 'projects/soils-revealed/Historic/SOCS_0_30cm_year_NoLU_10km',
    recent: 'projects/soils-revealed/Historic/SOCS_0_30cm_year_2010AD_10km',
  },
  1: {
    historic: 'projects/soils-revealed/Historic/SOCS_0_100cm_year_NoLU_10km',
    recent: 'projects/soils-revealed/Historic/SOCS_0_100cm_year_2010AD_10km',
  },
  2: {
    historic: 'projects/soils-revealed/Historic/SOCS_0_200cm_year_NoLU_10km',
    recent: 'projects/soils-revealed/Historic/SOCS_0_200cm_year_2010AD_10km',
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
  return res.send(Buffer.from(data));
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
  try {
    const depthValue = LAYERS['soc-stock'].paramsConfig.settings.type.options
      .find(option => option.value === 'historic')
      .settings.depth.options[depth].label.replace(/\scm/, '');

    const image = await getPregeneratedTile([
      'soc-stock-historic-change',
      'stock',
      depthValue,
      '2010-NoLU',
      z,
      x,
      y,
    ]);

    sendImage(res, image);
  } catch (e) {
    // Until zoom 5 included, we only retrieve the tiles from the bucket
    if (+z <= 5) {
      res.status(404).end();
    } else {
      try {
        const image = await getOnTheFlyTile(depth, x, y, z);
        sendImage(res, image);
      } catch (e) {
        res.status(404).end();
      }
    }
  }
};
