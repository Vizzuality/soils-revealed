export const BASEMAPS = {
  light: {
    label: 'White',
    image: null,
    backgroundColor: '#d4d8da',
    minZoom: 0,
    maxZoom: 19,
    url: 'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
  },
  dark: {
    label: 'Dark',
    image: null,
    backgroundColor: '#282626',
    minZoom: 0,
    maxZoom: 19,
    url: 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
  },
  satellite: {
    label: 'Satellite',
    image: null,
    backgroundColor: '#061b3a',
    minZoom: 0,
    maxZoom: 18,
    url:
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  },
  landsat: {
    label: 'Landsat',
    image: null,
    backgroundColor: '#020043',
    minZoom: 0,
    maxZoom: 12,
    url: 'https://api.resourcewatch.org/v2/landsat-tiles/{year}/{z}/{x}/{y}',
    params: {
      year: {
        label: 'Year',
        values: [2013, 2014, 2015, 2016, 2017],
        default: 2017,
      },
    },
    attribution: 'rw',
  },
};

export const BOUNDARIES = {
  'no-boundaries': {
    label: 'No boundaries',
    minZoom: -Infinity,
    maxZoom: Infinity,
  },
  'political-boundaries': {
    label: 'Political boundaries',
    minZoom: -Infinity,
    maxZoom: Infinity,
  },
  'protected-areas': {
    label: 'Protected areas',
    minZoom: -Infinity,
    maxZoom: Infinity,
  },
  'river-basins': {
    label: 'River basins',
    minZoom: -Infinity,
    maxZoom: Infinity,
  },
  biomes: {
    label: 'Biomes',
    minZoom: -Infinity,
    maxZoom: Infinity,
    // minZoom: 0,
    // maxZoom: 8,
    // url: '',
    // render: {
    //   layers: [
    //     {
    //       type: 'fill',
    //       'source-layer': 'Biomes',
    //       paint: {
    //         'fill-color': 'orange',
    //         'fill-opacity': 0.5,
    //         'fill-outline-color': 'red',
    //       },
    //     },
    //   ],
    // },
  },
};

export const LAYERS = {
  'tree-cover-loss': {
    // From: http://api.resourcewatch.org/v1/dataset/897ecc76-2308-4c51-aeb3-495de0bdca79?includes=layer
    label: 'Tree Cover Loss',
    group: 'land-use',
    attribution: ['rw'],
    config: {
      type: 'raster',
      source: {
        tiles: [
          'https://storage.googleapis.com/wri-public/Hansen18/tiles/hansen_world/v1/tc30/{z}/{x}/{y}.png',
        ],
        minzoom: 2,
        maxzoom: 12,
      },
    },
    legend: {
      type: 'basic',
      items: [
        {
          name: 'Tree Cover Loss',
          color: '#dc6c9a',
        },
      ],
      timeline: {
        step: 1,
        speed: 250,
        interval: 'years',
        dateFormat: 'YYYY',
        minDate: '2001-01-01',
        maxDate: '2018-12-31',
        canPlay: true,
        trackStyle: [
          {
            background: '#dc6c9a',
          },
        ],
      },
    },
    decodeParams: {
      startYear: 2001,
      endYear: 2018,
    },
    decodeConfig: [
      {
        default: '2001-01-01',
        key: 'startDate',
        required: true,
      },
      {
        default: '2018-12-31',
        key: 'endDate',
        required: true,
      },
    ],
    decodeFunction: `
      // values for creating power scale, domain (input), and range (output)
      float domainMin = 0.;
      float domainMax = 255.;
      float rangeMin = 0.;
      float rangeMax = 255.;
      float exponent = zoom < 13. ? 0.3 + (zoom - 3.) / 20. : 1.;
      float intensity = color.r * 255.;
      // get the min, max, and current values on the power scale
      float minPow = pow(domainMin, exponent - domainMin);
      float maxPow = pow(domainMax, exponent);
      float currentPow = pow(intensity, exponent);
      // get intensity value mapped to range
      float scaleIntensity = ((currentPow - minPow) / (maxPow - minPow) * (rangeMax - rangeMin)) + rangeMin;
      // a value between 0 and 255
      alpha = zoom < 13. ? scaleIntensity / 255. : color.g;
      float year = 2000.0 + (color.b * 255.);
      // map to years
      if (year >= startYear && year <= endYear && year >= 2001.) {
        color.r = 220. / 255.;
        color.g = (72. - zoom + 102. - 3. * scaleIntensity / zoom) / 255.;
        color.b = (33. - zoom + 153. - intensity / zoom) / 255.;
      } else {
        alpha = 0.;
      }
    `,
    // Metadata: https://production-api.globalforestwatch.org/v1/gfw-metadata/tree_cover_loss
  },
  // 'land-cover': {
  //   label: 'Global Land Cover',
  //   group: 'land-use',
  //   attribution: ['rw'],
  //   from: 'rw',
  //   datasetId: 'bca0109c-6d13-42a0-89b2-bcc046dc177e',
  //   layerId: '4a9ef4c2-0c13-4348-b986-f02781c6bf9f',
  //   // 2000 a 2018
  // },
};

export const LAYER_GROUPS = {
  'land-use': 'Land use',
  others: 'Other layers',
};

export const ATTRIBUTIONS = {
  rw:
    'Powered by <a href="https://resourcewatch.org/" target="_blank" rel="noopener noreferrer">Resource Watch</a>',
};
