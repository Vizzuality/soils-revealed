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
        <ColorMapEntry color="#E18D67" quantity="5" opacity="1" />
        <ColorMapEntry color="#CB5A3A" quantity="20" />
        <ColorMapEntry color="#9D4028" quantity="50" />
        <ColorMapEntry color="#6D2410" quantity="75" />
        <ColorMapEntry color="#380E03" quantity="200" />
      </ColorMap>
    </RasterSymbolizer>
  `,
  1: `
    <RasterSymbolizer>
      <ColorMap extended="false" type="ramp">
        <ColorMapEntry color="#E18D67" quantity="20" opacity="1" />
        <ColorMapEntry color="#CB5A3A" quantity="40" />
        <ColorMapEntry color="#9D4028" quantity="80" />
        <ColorMapEntry color="#6D2410" quantity="160" />
        <ColorMapEntry color="#380E03" quantity="300" />
      </ColorMap>
    </RasterSymbolizer>
  `,
  2: `
    <RasterSymbolizer>
      <ColorMap extended="false" type="ramp">
        <ColorMapEntry color="#E18D67" quantity="20" opacity="1" />
        <ColorMapEntry color="#CB5A3A" quantity="40" />
        <ColorMapEntry color="#9D4028" quantity="80" />
        <ColorMapEntry color="#6D2410" quantity="160" />
        <ColorMapEntry color="#380E03" quantity="400" />
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
        return res.send(Buffer.from(serverResponse.data));
      });
    });
  } catch (e) {
    res.status(404).end();
  }
};
