const ee = require('@google/earthengine');
const axios = require('axios').default;

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
        <ColorMapEntry color="#E34A33" quantity="-20" />
        <ColorMapEntry color="#FC8D59" quantity="-10" />
        <ColorMapEntry color="#FDCC8A" quantity="-5" />
        <ColorMapEntry color="#FFFFCC" quantity="0" />
        <ColorMapEntry color="#A1DAB4" quantity="5" />
        <ColorMapEntry color="#31B3BD" quantity="10" />
        <ColorMapEntry color="#1C9099" quantity="20" />
        <ColorMapEntry color="#066C59" quantity="30" />
      </ColorMap>
    </RasterSymbolizer>
  `,
  1: `
    <RasterSymbolizer>
      <ColorMap extended="false" type="ramp">
        <ColorMapEntry color="#B30200" quantity="-60" opacity="1" />
        <ColorMapEntry color="#E34A33" quantity="-40" />
        <ColorMapEntry color="#FC8D59" quantity="-20" />
        <ColorMapEntry color="#FDCC8A" quantity="-10" />
        <ColorMapEntry color="#FFFFCC" quantity="0" />
        <ColorMapEntry color="#A1DAB4" quantity="10" />
        <ColorMapEntry color="#31B3BD" quantity="20" />
        <ColorMapEntry color="#1C9099" quantity="40" />
        <ColorMapEntry color="#066C59" quantity="60" />
      </ColorMap>
    </RasterSymbolizer>
  `,
  2: `
    <RasterSymbolizer>
      <ColorMap extended="false" type="ramp">
        <ColorMapEntry color="#B30200" quantity="-120" opacity="1" />
        <ColorMapEntry color="#E34A33" quantity="-60" />
        <ColorMapEntry color="#FC8D59" quantity="-30" />
        <ColorMapEntry color="#FDCC8A" quantity="-10" />
        <ColorMapEntry color="#FFFFCC" quantity="0" />
        <ColorMapEntry color="#A1DAB4" quantity="10" />
        <ColorMapEntry color="#31B3BD" quantity="30" />
        <ColorMapEntry color="#1C9099" quantity="60" />
        <ColorMapEntry color="#066C59" quantity="120" />
      </ColorMap>
    </RasterSymbolizer>
  `,
};

module.exports = ({ params: { depth, x, y, z } }, res) => {
  try {
    const image = ee
      .Image(IMAGE[depth].recent)
      .subtract(ee.Image(IMAGE[depth].historic))
      .sldStyle(RAMP[depth]);
    image.getMap({}, ({ formatTileUrl }) => res.send(axios.get(formatTileUrl(x, y, z))));
  } catch (e) {
    res.status(404).end();
  }
};
