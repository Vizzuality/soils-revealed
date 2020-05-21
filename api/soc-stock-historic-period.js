const ee = require('@google/earthengine');

const RAMP = `
  <RasterSymbolizer>
    <ColorMap extended="false" type="ramp">
      <ColorMapEntry color="#E18D67" quantity="20" opacity="1" />
      <ColorMapEntry color="#CB5A3A" quantity="40" />
      <ColorMapEntry color="#9D4028" quantity="80" />
      <ColorMapEntry color="#6D2410" quantity="160" />
      <ColorMapEntry color="#380E03" quantity="400" />
    </ColorMap>
  </RasterSymbolizer>
`;

module.exports = ({ params: { period, x, y, z } }, res) => {
  try {
    const image = ee
      .Image(
        period === 'historic'
          ? 'projects/soils-revealed/Historic/SOCS_0_200cm_year_NoLU_10km'
          : 'projects/soils-revealed/Historic/SOCS_0_200cm_year_2010AD_10km'
      )
      .sldStyle(RAMP);
    image.getMap({}, ({ formatTileUrl }) => res.redirect(formatTileUrl(x, y, z)));
  } catch (e) {
    res.status(404).end();
  }
};
