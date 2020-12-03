const ee = require('@google/earthengine');
const axios = require('axios').default;

const IMAGE = {
  0: {
    historic: 'projects/soils-revealed/Historic/SOCS_0_30cm_year_NoLU_10km',
    current: 'projects/soils-revealed/Historic/SOCS_0_30cm_year_2010AD_10km',
  },
  1: {
    historic: 'projects/soils-revealed/Historic/SOCS_0_100cm_year_NoLU_10km',
    current: 'projects/soils-revealed/Historic/SOCS_0_100cm_year_2010AD_10km',
  },
  2: {
    historic: 'projects/soils-revealed/Historic/SOCS_0_200cm_year_NoLU_10km',
    current: 'projects/soils-revealed/Historic/SOCS_0_200cm_year_2010AD_10km',
  },
};

const RAMP = {
  0: `
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
  `,
  1: `
    <RasterSymbolizer>
      <ColorMap extended="false" type="ramp">
        <ColorMapEntry color="#FFD0BB" quantity="0" opacity="1" />
        <ColorMapEntry color="#FFB492" quantity="50" />
        <ColorMapEntry color="#E18D67" quantity="100" />
        <ColorMapEntry color="#B74829" quantity="150" />
        <ColorMapEntry color="#903116" quantity="200" />
        <ColorMapEntry color="#631E0B" quantity="250" />
        <ColorMapEntry color="#2A0A02" quantity="300" />
      </ColorMap>
    </RasterSymbolizer>
  `,
  2: `
    <RasterSymbolizer>
      <ColorMap extended="false" type="ramp">
        <ColorMapEntry color="#FFD0BB" quantity="0" opacity="1" />
        <ColorMapEntry color="#FFB492" quantity="80" />
        <ColorMapEntry color="#E18D67" quantity="160" />
        <ColorMapEntry color="#B74829" quantity="240" />
        <ColorMapEntry color="#903116" quantity="320" />
        <ColorMapEntry color="#631E0B" quantity="400" />
        <ColorMapEntry color="#2A0A02" quantity="480" />
      </ColorMap>
    </RasterSymbolizer>
  `,
};

module.exports = ({ params: { depth, period, x, y, z } }, res) => {
  try {
    const image = ee.Image(IMAGE[depth][period]).sldStyle(RAMP[depth]);
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
