const ee = require('@google/earthengine');

const RAMP = `
  <RasterSymbolizer>
    <ColorMap type="values" extended="false">
      <ColorMapEntry color="#ffff64" quantity="10" opacity="1" />
      <ColorMapEntry color="#ffff64" quantity="11" />
      <ColorMapEntry color="#ffff00" quantity="12" />
      <ColorMapEntry color="#aaf0f0" quantity="20" />
      <ColorMapEntry color="#dcf064" quantity="30" />
      <ColorMapEntry color="#c8c864" quantity="40" />
      <ColorMapEntry color="#006400" quantity="50" />
      <ColorMapEntry color="#00a000" quantity="60" />
      <ColorMapEntry color="#00a000" quantity="61" />
      <ColorMapEntry color="#aac800" quantity="62" />
      <ColorMapEntry color="#003c00" quantity="70" />
      <ColorMapEntry color="#003c00" quantity="71" />
      <ColorMapEntry color="#005000" quantity="72" />
      <ColorMapEntry color="#285000" quantity="80" />
      <ColorMapEntry color="#285000" quantity="81" />
      <ColorMapEntry color="#286400" quantity="82" />
      <ColorMapEntry color="#788200" quantity="90" />
      <ColorMapEntry color="#8ca000" quantity="100" />
      <ColorMapEntry color="#be9600" quantity="110" />
      <ColorMapEntry color="#966400" quantity="120" />
      <ColorMapEntry color="#966400" quantity="121" />
      <ColorMapEntry color="#966400" quantity="122" />
      <ColorMapEntry color="#ffb432" quantity="130" />
      <ColorMapEntry color="#ffdcd2" quantity="140" />
      <ColorMapEntry color="#ffebaf" quantity="150" />
      <ColorMapEntry color="#ffc864" quantity="151" />
      <ColorMapEntry color="#ffd278" quantity="152" />
      <ColorMapEntry color="#ffebaf" quantity="153" />
      <ColorMapEntry color="#00785a" quantity="160" />
      <ColorMapEntry color="#009678" quantity="170" />
      <ColorMapEntry color="#00dc82" quantity="180" />
      <ColorMapEntry color="#c31400" quantity="190" />
      <ColorMapEntry color="#fff5d7" quantity="200" />
      <ColorMapEntry color="#dcdcdc" quantity="201" />
      <ColorMapEntry color="#fff5d7" quantity="202" />
      <ColorMapEntry color="#0046c8" quantity="210" opacity="0" />
      <ColorMapEntry color="#ffffff" quantity="220" />
    </ColorMap>
  </RasterSymbolizer>
`;

module.exports = ({ params: { year, x, y, z } }, res) => {
  try {
    const image = ee
      .Image(`projects/soils-revealed/esa_landcover_ipcc/ESA_${year}_ipcc`)
      .sldStyle(RAMP);
    image.getMap({}, ({ formatTileUrl }) => res.redirect(formatTileUrl(x, y, z)));
  } catch (e) {
    res.status(404).end();
  }
};
