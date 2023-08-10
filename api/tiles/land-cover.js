const ee = require('@google/earthengine');
const axios = require('axios').default;

const getPregeneratedTile = require('./pregenerated-tile');
const saveTile = require('./save-tile');

const RAMP = `
  <RasterSymbolizer>
    <ColorMap type="values" extended="false">
      // Cropland
      <ColorMapEntry color="#dfc30c" quantity="10" />
      <ColorMapEntry color="#dfc30c" quantity="11" />
      <ColorMapEntry color="#dfc30c" quantity="20" />
      <ColorMapEntry color="#dfc30c" quantity="30" />
      <ColorMapEntry color="#dfc30c" quantity="40" />
      // Tree-covered areas
      <ColorMapEntry color="#0B842F" quantity="12" />
      <ColorMapEntry color="#0B842F" quantity="50" />
      <ColorMapEntry color="#0B842F" quantity="60" />
      <ColorMapEntry color="#0B842F" quantity="61" />
      <ColorMapEntry color="#0B842F" quantity="62" />
      <ColorMapEntry color="#0B842F" quantity="70" />
      <ColorMapEntry color="#0B842F" quantity="71" />
      <ColorMapEntry color="#0B842F" quantity="72" />
      <ColorMapEntry color="#0B842F" quantity="80" />
      <ColorMapEntry color="#0B842F" quantity="81" />
      <ColorMapEntry color="#0B842F" quantity="82" />
      <ColorMapEntry color="#0B842F" quantity="90" />
      <ColorMapEntry color="#0B842F" quantity="100" />
      // Rangeland and pasture
      <ColorMapEntry color="#C69323" quantity="110" />
      <ColorMapEntry color="#C69323" quantity="120" />
      <ColorMapEntry color="#C69323" quantity="121" />
      <ColorMapEntry color="#C69323" quantity="122" />
      <ColorMapEntry color="#C69323" quantity="130" />
      <ColorMapEntry color="#C69323" quantity="140" />
      <ColorMapEntry color="#C69323" quantity="150" />
      <ColorMapEntry color="#C69323" quantity="151" />
      <ColorMapEntry color="#C69323" quantity="152" />
      <ColorMapEntry color="#C69323" quantity="153" />
      // Wetland
      <ColorMapEntry color="#016A6D" quantity="160" />
      <ColorMapEntry color="#016A6D" quantity="180" />
      // Mangroves
      <ColorMapEntry color="#42DED5" quantity="170" />
      // Urban areas
      <ColorMapEntry color="#3640B7" quantity="190" />
      // Bare areas
      <ColorMapEntry color="#C54802" quantity="200" />
      <ColorMapEntry color="#C54802" quantity="201" />
      <ColorMapEntry color="#C54802" quantity="202" />
      // Water bodies
      <ColorMapEntry color="#48A7FF" quantity="210" opacity="0" />
      // Snow and ice
      <ColorMapEntry color="#B9EEEF" quantity="220" opacity="0" />
    </ColorMap>
  </RasterSymbolizer>
`;

const DETAILED_RAMP = `
  <RasterSymbolizer>
    <ColorMap type="values" extended="false">
      // Cropland
      <ColorMapEntry color="#5B5B18" quantity="10" />
      <ColorMapEntry color="#7D7616" quantity="11" />
      <ColorMapEntry color="#A09113" quantity="20" />
      <ColorMapEntry color="#C0AB10" quantity="30" />
      <ColorMapEntry color="#DFC30C" quantity="40" />
      // Tree-covered areas
      <ColorMapEntry color="#124d00" quantity="12" />
      <ColorMapEntry color="#136010" quantity="50" />
      <ColorMapEntry color="#117221" quantity="60" />
      <ColorMapEntry color="#0b842f" quantity="61" />
      <ColorMapEntry color="#2a9339" quantity="62" />
      <ColorMapEntry color="#4aa040" quantity="70" />
      <ColorMapEntry color="#64ac48" quantity="71" />
      <ColorMapEntry color="#7ab84f" quantity="72" />
      <ColorMapEntry color="#91c357" quantity="80" />
      <ColorMapEntry color="#a5ce5f" quantity="81" />
      <ColorMapEntry color="#b9d867" quantity="82" />
      <ColorMapEntry color="#cce36f" quantity="90" />
      <ColorMapEntry color="#e0ed78" quantity="100" />
      // Rangeland and pasture
      <ColorMapEntry color="#967216" quantity="110" />
      <ColorMapEntry color="#a67d1a" quantity="120" />
      <ColorMapEntry color="#b6881f" quantity="121" />
      <ColorMapEntry color="#c69323" quantity="122" />
      <ColorMapEntry color="#d69e27" quantity="130" />
      <ColorMapEntry color="#e6a82b" quantity="140" />
      <ColorMapEntry color="#f6b148" quantity="150" />
      <ColorMapEntry color="#febc7a" quantity="151" />
      <ColorMapEntry color="#ffcaaa" quantity="152" />
      <ColorMapEntry color="#f8dcd3" quantity="153" />
      // Wetland
      <ColorMapEntry color="#016A6D" quantity="160" />
      <ColorMapEntry color="#35ADAD" quantity="180" />
      // Mangroves
      <ColorMapEntry color="#42DED5" quantity="170" />
      // Urban areas
      <ColorMapEntry color="#3640B7" quantity="190" />
      // Bare areas
      <ColorMapEntry color="#C54802" quantity="200" />
      <ColorMapEntry color="#DF704F" quantity="201" />
      <ColorMapEntry color="#FD9CA7" quantity="202" />
      // Water bodies
      <ColorMapEntry color="#48A7FF" quantity="210" opacity="0" />
      // Snow and ice
      <ColorMapEntry color="#B9EEEF" quantity="220" opacity="0" />
    </ColorMap>
  </RasterSymbolizer>
`;

const sendImage = (res, data) => {
  res.set('Content-Type', 'image/png');
  return res.send(data);
};

const getOnTheFlyTile = async (group, year, x, y, z) => {
  return new Promise((resolve, reject) => {
    const image = ee
      .Image(
        ee
          .ImageCollection('projects/soils-revealed/ESA_landcover_ipcc')
          .filterDate(`${year}-01-01`, `${year}-12-31`)
          .first()
      )
      .sldStyle(group === 'simple' ? RAMP : DETAILED_RAMP);

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

module.exports = async ({ params: { group, year, x, y, z } }, res) => {
  const S3Path = `land-cover/${group}/${year}/${z}/${x}/${y}`;

  try {
    const image = await getPregeneratedTile(S3Path);
    sendImage(res, image);
  } catch (e) {
    try {
      const image = await getOnTheFlyTile(group, year, x, y, z);

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
