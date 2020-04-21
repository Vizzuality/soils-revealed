export const BASEMAPS = {
  light: {
    label: 'White',
    mapStyle: {
      version: 8,
      sources: {
        'carto-tiles': {
          type: 'raster',
          tiles: ['https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png'],
          tileSize: 256,
        },
      },
      layers: [
        {
          id: 'basemap',
          type: 'raster',
          source: 'carto-tiles',
          minzoom: 0,
          maxzoom: 22,
        },
      ],
    },
  },
  dark: {
    label: 'Dark',
    mapStyle: {
      version: 8,
      sources: {
        'carto-tiles': {
          type: 'raster',
          tiles: ['https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'],
          tileSize: 256,
        },
      },
      layers: [
        {
          id: 'basemap',
          type: 'raster',
          source: 'carto-tiles',
          minzoom: 0,
          maxzoom: 22,
        },
      ],
    },
  },
  satellite: {
    label: 'Satellite',
    mapStyle: {
      version: 8,
      sources: {
        'carto-tiles': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          ],
          tileSize: 256,
        },
      },
      layers: [
        {
          id: 'basemap',
          type: 'raster',
          source: 'carto-tiles',
          minzoom: 0,
          maxzoom: 22,
        },
      ],
    },
  },
};
