export const BASEMAPS = {
  light: {
    label: 'White',
    image: null,
    minZoom: 0,
    maxZoom: 19,
    url: 'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
  },
  dark: {
    label: 'Dark',
    image: null,
    minZoom: 0,
    maxZoom: 19,
    url: 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
  },
  satellite: {
    label: 'Satellite',
    image: null,
    minZoom: 0,
    maxZoom: 18,
    url:
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  },
};

export const BOUNDARIES = {
  'no-boundaries': {
    label: 'No boundaries',
  },
  'political-boundaries': {
    label: 'Political boundaries',
  },
  'protected-areas': {
    label: 'Protected areas',
  },
  'river-basins': {
    label: 'River basins',
  },
  biomes: {
    label: 'Biomes',
  },
};
