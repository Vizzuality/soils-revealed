const ee = require('@google/earthengine');

const RAMP = `
  <RasterSymbolizer>
    <ColorMap extended="false" type="ramp">
      <ColorMapEntry color="#B30200" quantity="-120"  opacity="1" />
      <ColorMapEntry color="#E34A33" quantity="-60"  />
      <ColorMapEntry color="#FC8D59" quantity="-30" />
      <ColorMapEntry color="#FDCC8A" quantity="-10"  />
      <ColorMapEntry color="#FFFFCC" quantity="0"  />
      <ColorMapEntry color="#A1DAB4" quantity="10" />
      <ColorMapEntry color="#31B3BD" quantity="30"  />
      <ColorMapEntry color="#1C9099" quantity="60" />
      <ColorMapEntry color="#066C59" quantity="120"  />
    </ColorMap>
  </RasterSymbolizer>
`;

module.exports = ({ params: { x, y, z } }, res) => {
  try {
    const image = ee
      .Image('projects/soils-revealed/Historic/SOCS_0_200cm_year_2010AD_10km')
      .subtract(ee.Image('projects/soils-revealed/Historic/SOCS_0_200cm_year_NoLU_10km'))
      .sldStyle(RAMP);
    image.getMap({}, ({ formatTileUrl }) => res.redirect(formatTileUrl(x, y, z)));
  } catch (e) {
    res.status(404).end();
  }
};
