export const mapStyle = 'mapbox://styles/tncsoilscience/ck9o2m8o652i51irzm0acciu7';

export const BASEMAPS = {
  light: {
    label: 'Light',
    image: '/images/basemap-light.png',
    backgroundColor: '#d2c1b1',
    minZoom: 0,
    maxZoom: 22,
    styleGroup: 'basemap_light',
  },
  dark: {
    label: 'Dark',
    image: '/images/basemap-dark.png',
    backgroundColor: '#4b3116',
    minZoom: 0,
    maxZoom: 22,
    styleGroup: 'basemap_dark',
  },
  satellite: {
    label: 'Satellite',
    image: '/images/basemap-satellite.png',
    backgroundColor: '#050810',
    minZoom: 0,
    maxZoom: 22,
    styleGroup: 'basemap_satellite',
  },
  landsat: {
    label: 'Landsat',
    image: '/images/basemap-landsat.png',
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
    attributions: ['rw'],
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
  'land-cover': {
    // From: https://api.resourcewatch.org/v1/dataset/bca0109c-6d13-42a0-89b2-bcc046dc177e?includes=layer
    label: 'Global Land Cover',
    description:
      "Land Cover from the European Space Agency's Climate Change Initiative Land Cover (ESA CCI-LC) dataset, categorized under the IPCC land cover classification system at 300 m resolution.",
    group: 'land-use',
    attributions: ['rw'],
    config: {
      type: 'raster',
      source: (year = 2015) => {
        const yearToTiles = {
          2000: 'https://api.resourcewatch.org/v1/layer/709afed4-fc07-422f-a7ce-c8051f443d99/tile/gee/{z}/{x}/{y}',
          2001: 'https://api.resourcewatch.org/v1/layer/37a68f52-8e79-43ee-9c5c-ea8db5d4c166/tile/gee/{z}/{x}/{y}',
          2002: 'https://api.resourcewatch.org/v1/layer/d4035b7d-4e41-4406-80cc-4a9e288ab78f/tile/gee/{z}/{x}/{y}',
          2003: 'https://api.resourcewatch.org/v1/layer/9f0b8836-1947-4abd-be76-a26153a58b78/tile/gee/{z}/{x}/{y}',
          2004: 'https://api.resourcewatch.org/v1/layer/2daeb219-c454-4a5e-882a-2c6e53684051/tile/gee/{z}/{x}/{y}',
          2005: 'https://api.resourcewatch.org/v1/layer/432c1aa5-cd80-4023-9b20-1b4291be3022/tile/gee/{z}/{x}/{y}',
          2006: 'https://api.resourcewatch.org/v1/layer/abed6874-6d5d-4575-8935-defba9804e8c/tile/gee/{z}/{x}/{y}',
          2007: 'https://api.resourcewatch.org/v1/layer/f9192bd0-ea3f-4440-91df-9f6878249d6b/tile/gee/{z}/{x}/{y}',
          2008: 'https://api.resourcewatch.org/v1/layer/575b1cf1-a556-4a29-9793-f46ff12ff654/tile/gee/{z}/{x}/{y}',
          2009: 'https://api.resourcewatch.org/v1/layer/98c6d7ab-392a-4bfe-848f-f9e40ece29a9/tile/gee/{z}/{x}/{y}',
          2010: 'https://api.resourcewatch.org/v1/layer/5c42808b-7b33-48f2-9415-5d7c43781468/tile/gee/{z}/{x}/{y}',
          2011: 'https://api.resourcewatch.org/v1/layer/d00946b2-806d-4475-bcf5-08833e0a4c5b/tile/gee/{z}/{x}/{y}',
          2012: 'https://api.resourcewatch.org/v1/layer/b8711907-c63d-437f-a9d9-3f8d12418ee8/tile/gee/{z}/{x}/{y}',
          2013: 'https://api.resourcewatch.org/v1/layer/be996ac0-3228-44c1-9c75-cbe6955689b3/tile/gee/{z}/{x}/{y}',
          2014: 'https://api.resourcewatch.org/v1/layer/4a363e72-bb4a-4ced-8564-3403eaba1823/tile/gee/{z}/{x}/{y}',
          2015: 'https://api.resourcewatch.org/v1/layer/68a50d22-a821-4a39-bb1b-d51fd5fa85c9/tile/gee/{z}/{x}/{y}',
        };

        return {
          tiles: [yearToTiles[year]],
          minzoom: 2,
          maxzoom: 12,
        };
      },
    },
    legend: {
      type: 'basic',
      items: [
        {
          name: 'Agriculture',
          color: '#fffd70',
        },
        {
          name: 'Forest',
          color: '#09630c',
        },
        {
          name: 'Grassland',
          color: '#3fa02c',
        },
        {
          name: 'Wetland',
          color: '#159578',
        },
        {
          name: 'Settlement',
          color: '#c11812',
        },
        {
          name: 'Shrubland',
          color: '#956314',
        },
        {
          name: 'Sparse Vegetation',
          color: '#c2e575',
        },
        {
          name: 'Bare Area',
          color: '#fff5d8',
        },
        {
          name: 'Water',
          color: '#0b4bc5',
        },
        {
          name: 'Permanent Snow and Ice',
          color: '#FFFFFF',
        },
      ],
      timeline: {
        range: false,
        interval: 'years',
        dateFormat: 'YYYY',
        minDate: '2001-01-01',
        maxDate: '2015-12-31',
      },
    },
  },
  'tree-cover-loss': {
    // From: http://api.resourcewatch.org/v1/dataset/897ecc76-2308-4c51-aeb3-495de0bdca79?includes=layer
    label: 'Tree Cover Loss',
    description: 'Identifies areas of gross tree cover loss.',
    group: 'land-use',
    attributions: ['rw'],
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
  cropland: {
    // From: https://api.resourcewatch.org/v1/dataset/0ce24533-7877-4926-b962-a6c726332d82?includes=layer
    label: 'Cropland',
    description: 'The percentage of each grid cell used as cropland in the year 2000.',
    group: 'land-use',
    attributions: ['rw'],
    config: {
      type: 'raster',
      source: {
        tiles: [
          'https://api.resourcewatch.org/v1/layer/47dc9961-05d6-48f1-93c5-aa633e4a1efa/tile/gee/{z}/{x}/{y}',
        ],
        minzoom: 2,
        maxzoom: 12,
      },
    },
    legend: {
      type: 'choropleth',
      items: [
        {
          color: '#d9f0a3',
          name: '≤20',
          id: 0,
        },
        {
          color: '#addd8e',
          name: '≤40',
          id: 1,
        },
        {
          color: '#78c679',
          name: '≤60',
          id: 2,
        },
        {
          color: '#31a354',
          name: '≤80',
          id: 3,
        },
        {
          color: '#006837',
          name: '≤100',
          id: 4,
        },
      ],
    },
  },
  pasture: {
    // From: https://api.resourcewatch.org/v1/dataset/0ce24533-7877-4926-b962-a6c726332d82?includes=layer
    label: 'Pasture Area',
    description: 'The percentage of each grid cell used as pasture in the year 2000.',
    group: 'land-use',
    attributions: ['rw'],
    config: {
      type: 'raster',
      source: {
        tiles: [
          'https://api.resourcewatch.org/v1/layer/1198417e-8cfb-4a40-96f7-9ec016384c86/tile/gee/{z}/{x}/{y}',
        ],
        minzoom: 2,
        maxzoom: 12,
      },
    },
    legend: {
      type: 'choropleth',
      items: [
        {
          name: '≤20',
          color: '#fdd0a2',
          id: 0,
        },
        {
          name: '≤40',
          color: '#fdae6b',
          id: 1,
        },
        {
          name: '≤60',
          color: '#fd8d3c',
          id: 2,
        },
        {
          name: '≤80',
          color: '#e6550d',
          id: 3,
        },
        {
          name: '≤100',
          color: '#a63603',
          id: 4,
        },
      ],
    },
  },
  'wetlands-waterbodies': {
    // From: http://api.resourcewatch.org/v1/dataset/098b3d64-3679-4448-bf05-039dc0224dd5?includes=layer
    label: 'Wetlands and Waterbodies',
    description: 'Types of large-scale wetland distributions and important wetland complexes.',
    group: 'land-use',
    attributions: ['rw'],
    config: {
      type: 'raster',
      source: {
        tiles: [
          'https://api.resourcewatch.org/v1/layer/788d0990-a22d-4519-9041-e99641f84d86/tile/gee/{z}/{x}/{y}',
        ],
        minzoom: 2,
        maxzoom: 12,
      },
    },
    legend: {
      type: 'basic',
      items: [
        {
          name: 'Lakes',
          color: '#a6cee3',
        },
        {
          name: 'Reservoirs',
          color: '#1f78b4',
        },
        {
          name: 'Rivers',
          color: '#08306b',
        },
        {
          name: 'Freshwater Marsh, Floodplain',
          color: '#b2df8a',
        },
        {
          name: 'Swamp Forest, Flooded Forest',
          color: '#33a02c',
        },
        {
          name: 'Coastal Wetland',
          color: '#fb9a99',
        },
        {
          name: 'Pan, Brackish/Saline Wetland',
          color: '#e31a1c',
        },
        {
          name: 'Bog, Fen, Mire (Peatland)',
          color: '#fdbf6f',
        },
        {
          name: 'Intermittent Wetland/Lake',
          color: '#ff7f00',
        },
        {
          name: '50-100% Wetland',
          color: '#cab2d6',
        },
        {
          name: '25-50% Wetland',
          color: '#6a3d9a',
        },
        {
          name: 'Wetland Compex (0-25% Wetland)',
          color: '#b15928',
        },
      ],
    },
  },
  'urban-area': {
    // From: https://api.resourcewatch.org/v1/dataset/dbca28fe-d6bf-464f-9f86-fc8b1d81e381?includes=layer
    label: 'Urban Built-Up Area',
    description:
      'Built-up areas represent the presence of structures on any land. Data shown represents: the global built-up area before 1975, from 1975 to 1990, 1990 - 2000 and 2000 - 2014.',
    group: 'land-use',
    attributions: ['rw'],
    config: {
      type: 'raster',
      source: {
        tiles: [
          'https://api.resourcewatch.org/v1/layer/a4055dea-8762-4c2d-b7ba-a3e616a97b41/tile/gee/{z}/{x}/{y}',
        ],
        minzoom: 2,
        maxzoom: 12,
      },
    },
    legend: {
      type: 'choropleth',
      items: [
        {
          name: '<1975',
          color: '#ff0000',
          id: 0,
        },
        {
          name: '1975-1990',
          color: '#ff7f00',
          id: 1,
        },
        {
          name: '1990-2000',
          color: '#ffff00',
          id: 2,
        },
        {
          name: '2000-2014',
          color: '#f7f7f7',
          id: 3,
        },
      ],
    },
  },
  population: {
    // From: https://api.resourcewatch.org/v1/dataset/b6ceb159-efd8-42de-9c6a-d658801d8922?includes=layer
    label: 'Population',
    description:
      'The distribution and density of population, expressed as the number of people per 250 m grid cell. Legend displays people per square kilometer.',
    group: 'others',
    attributions: ['rw'],
    config: {
      type: 'raster',
      source: (year = 2015) => {
        const yearToTiles = {
          1975: 'https://api.resourcewatch.org/v1/layer/94946f97-a7b6-4ded-be7b-7bae63e3b892/tile/gee/{z}/{x}/{y}',
          1990: 'https://api.resourcewatch.org/v1/layer/24a8a270-bd69-4c99-bfdc-84c59ccbfaf9/tile/gee/{z}/{x}/{y}',
          2000: 'https://api.resourcewatch.org/v1/layer/3e3534ae-6052-4dd8-9fe9-19066aa18826/tile/gee/{z}/{x}/{y}',
          2015: 'https://api.resourcewatch.org/v1/layer/2b44782c-1f20-4868-9400-c3819f49ccc8/tile/gee/{z}/{x}/{y}',
        };

        return {
          tiles: [yearToTiles[year]],
          minzoom: 2,
          maxzoom: 12,
        };
      },
    },
    legend: {
      type: 'choropleth',
      items: [
        {
          color: '#32095D',
          name: '≤25',
          id: 0,
        },
        {
          color: '#781C6D',
          name: '≤100',
          id: 1,
        },
        {
          color: '#BA3655',
          name: '≤1k',
          id: 2,
        },
        {
          color: '#ED6825',
          name: '≤5k',
          id: 3,
        },
        {
          color: '#FBB318',
          name: '≤10k',
          id: 4,
        },
        {
          color: '#FCFEA4',
          name: '>10k',
          id: 5,
        },
      ],
      timeline: {
        step: null,
        range: false,
        interval: 'years',
        dateFormat: 'YYYY',
        minDate: '1975-01-01',
        maxDate: '2015-01-01',
        marks: {
          0: '1975',
          15: '',
          25: '',
          40: '2015',
        },
      },
    },
  },
  'tree-biomass': {
    // From: https://api.resourcewatch.org/v1/dataset/81c802aa-5feb-4fbe-9986-8f30c0597c4d?includes=layer
    label: 'Tree biomass carbon density',
    description:
      'Carbon density of woody biomass that is above ground and living, measured in megagrams of carbon per hectare (Mg C/ha).',
    group: 'others',
    attributions: ['rw'],
    config: {
      type: 'raster',
      source: {
        tiles: [
          'https://storage.googleapis.com/wri-public/biomass/global/2017/v2/30/{z}/{x}/{y}.png',
        ],
        minzoom: 2,
        maxzoom: 12,
      },
    },
    legend: {
      type: 'gradient',
      items: [
        {
          color: '#895122',
          value: '0',
        },
        {
          color: '#957F4F',
          name: '',
        },
        {
          color: '#9DB38A',
          name: '',
        },
        {
          color: '#39A401',
          value: '480 t Ha⁻¹',
        },
      ],
    },
    decodeParams: {},
    decodeFunction: `
      float intensity = color.b * 255.;
      alpha = color.b;
      color.r = (255. - intensity) / 255.;
      color.g = 128. / 255.;
      color.b = 0.;
    `,
  },
  'biodiversity-intactness': {
    // From: http://api.resourcewatch.org/v1/dataset/0e565ddf-74fd-4f90-a6b8-c89d747a89ab?includes=layer
    label: 'Biodiversity Intactness',
    description:
      'Average proportion of natural biodiversity remaining in local ecosystems in 2005. Green areas are those within safe limits for biodiversity, and red areas are those beyond proposed safe limits.',
    group: 'others',
    attributions: ['rw'],
    config: {
      type: 'raster',
      source: {
        tiles: [
          'https://api.resourcewatch.org/v1/layer/70e900f1-2c37-470d-9367-7b34567e3084/tile/gee/{z}/{x}/{y}',
        ],
        minzoom: 2,
        maxzoom: 12,
      },
    },
    legend: {
      type: 'choropleth',
      items: [
        {
          name: '≤60',
          color: '#a50026',
          id: 0,
        },
        {
          name: '≤70',
          color: '#d73027',
          id: 1,
        },
        {
          name: '≤75',
          color: '#f46d43',
          id: 2,
        },
        {
          name: '≤80',
          color: '#fdae61',
          id: 3,
        },
        {
          name: '≤85',
          color: '#fee08b',
          id: 4,
        },
        {
          name: '≤90',
          color: '#d9ef8b',
          id: 5,
        },
        {
          name: '≤95',
          color: '#a6d96a',
          id: 6,
        },
        {
          name: '≤97.5',
          color: '#66bd63',
          id: 7,
        },
        {
          name: '≤100',
          color: '#1a9850',
          id: 8,
        },
        {
          name: '>100',
          color: '#006837',
          id: 9,
        },
      ],
    },
  },
  'erosion-risk': {
    // From: http://api.resourcewatch.org/v1/dataset/dc5db1e0-12bb-4d4d-b84f-37fa492060b6?includes=layer
    label: 'Erosion Risk',
    description:
      'Estimates of soil loss from rainfall and runoff on a scale from 1 to 5. A value of 1 indicates a low risk of erosion and 5 indicates a high risk of erosion.',
    group: 'others',
    attributions: ['rw'],
    config: {
      type: 'raster',
      source: {
        tiles: [
          'https://api.resourcewatch.org/v1/layer/b8c8ecd0-faab-4555-b9c0-d397e5450a33/tile/gee/{z}/{x}/{y}',
        ],
        minzoom: 2,
        maxzoom: 12,
      },
    },
    legend: {
      type: 'choropleth',
      items: [
        {
          color: '#ffffd4',
          name: 'Low',
          id: 0,
        },
        {
          color: '#fed98e',
          name: 'Low - Medium',
          id: 1,
        },
        {
          color: '#fe9929',
          name: 'Medium',
          id: 2,
        },
        {
          color: '#d95f0e',
          name: 'Medium - High',
          id: 3,
        },
        {
          color: '#993404',
          name: 'High',
          id: 4,
        },
      ],
    },
  },
};

export const LAYER_GROUPS = {
  'land-use': 'Land use',
  others: 'Other layers',
};

export const ATTRIBUTIONS = {
  rw:
    'Powered by <a href="https://resourcewatch.org/" target="_blank" rel="noopener noreferrer">Resource Watch</a>',
};
