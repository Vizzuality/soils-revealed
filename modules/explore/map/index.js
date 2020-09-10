import { createSlice, createSelector } from '@reduxjs/toolkit';
import omit from 'lodash/omit';

import { getLayerSource, getBoundariesDef, getLayerExtraParams } from 'utils/map';
import { BASEMAPS, BOUNDARIES, ATTRIBUTIONS, LAYERS, LAYER_GROUPS } from 'components/map/constants';

export const SLICE_NAME = 'map';

export const selectViewport = state => state[SLICE_NAME].viewport;
export const selectZoom = createSelector([selectViewport], viewport => viewport.zoom);
export const selectCenter = createSelector([selectViewport], viewport => ({
  latitude: viewport.lat,
  longitude: viewport.lng,
}));
export const selectBounds = createSelector([selectViewport], viewport => viewport.bounds);
export const selectBasemap = state => state[SLICE_NAME].basemap;
export const selectBasemapParams = state => state[SLICE_NAME].basemapParams;
export const selectRoads = state => state[SLICE_NAME].roads;
export const selectLabels = state => state[SLICE_NAME].labels;
export const selectBoundaries = state => state[SLICE_NAME].boundaries;
export const selectLayers = state => state[SLICE_NAME].layers;

export const selectBoundariesLayerDef = createSelector([selectBoundaries], boundaries => {
  if (!BOUNDARIES[boundaries.id].config) {
    return null;
  }

  return getBoundariesDef(boundaries.id, BOUNDARIES[boundaries.id], boundaries);
});

export const selectBasemapLayerDef = createSelector(
  [selectBasemap, selectBasemapParams],
  (basemap, basemapParams) => {
    let basemapUrl = BASEMAPS[basemap].url;

    if (!basemapUrl) {
      return null;
    }

    if (basemapParams) {
      basemapUrl = Object.keys(basemapParams).reduce(
        (res, key) => basemapUrl.replace(`{${key}}`, basemapParams[key]),
        basemapUrl
      );
    }

    return {
      id: basemap,
      type: 'raster',
      source: {
        type: 'raster',
        tiles: [basemapUrl],
        minzoom: BASEMAPS[basemap].minZoom,
        maxzoom: BASEMAPS[basemap].maxZoom,
      },
      zIndex: 1, // 1 is the minimum we can assign
    };
  }
);

export const selectDataLayers = () => LAYERS;

export const selectActiveDataLayers = createSelector([selectLayers], layers => Object.keys(layers));

export const selectSOCLayerId = createSelector([selectActiveDataLayers], activeDataLayers =>
  activeDataLayers.indexOf('soc-stock') !== -1 ? 'soc-stock' : 'soc-experimental'
);

export const selectRankingBoundariesOptions = createSelector([], () => {
  let keys = Object.keys(BOUNDARIES).filter(key => key !== 'no-boundaries');

  return keys.map(key => ({
    label: BOUNDARIES[key].level0Noun.replace(/^\w/, c => c.toUpperCase()),
    value: key,
  }));
});

export const selectSOCLayerState = createSelector(
  [selectDataLayers, selectSOCLayerId, selectLayers],
  (dataLayers, socLayerId, layers) => {
    return {
      id: socLayerId,
      label: dataLayers[socLayerId].label,
      ...getLayerExtraParams({ id: socLayerId, ...dataLayers[socLayerId] }, layers[socLayerId]),
    };
  }
);

export const selectRankingBoundaries = createSelector(
  [selectSOCLayerId, selectBoundaries],
  (socLayerId, boundaries) => {
    if (socLayerId !== 'soc-stock' && boundaries.id === 'no-boundaries') {
      // We only have one country so we default to the Landforms instead of the Political boundaries
      return 'landforms';
    }

    if (boundaries.id === 'no-boundaries') {
      return 'political-boundaries';
    }

    return boundaries.id;
  }
);

export const selectDataLayersByGroup = createSelector(
  [selectDataLayers, selectActiveDataLayers],
  (dataLayers, activeDataLayers) => {
    const groups = Object.keys(dataLayers)
      .map(layerId => ({
        ...dataLayers[layerId],
        id: layerId,
        active: activeDataLayers.indexOf(layerId) !== -1,
      }))
      .reduce(
        (res, layer) => ({
          ...res,
          [layer.group]: {
            label: LAYER_GROUPS[layer.group],
            layers: [
              ...(res[layer.group] ? res[layer.group].layers : []),
              layer,
            ].sort((layerA, layerB) => layerA.label.localeCompare(layerB.label)),
          },
        }),
        {}
      );

    const { soc, ...rest } = groups;
    return {
      soc,
      'areas-interest': {
        label: 'Areas of interest',
        layers: Object.keys(BOUNDARIES).map(key => ({
          id: key,
          label: BOUNDARIES[key].label,
        })),
      },
      ...rest,
    };
  }
);

export const selectLegendDataLayers = createSelector(
  [selectDataLayers, selectActiveDataLayers, selectLayers, selectBoundaries],
  (dataLayers, activeDataLayers, layers, boundaries) => {
    const activeLayers = Object.keys(dataLayers)
      .map(layerId => ({
        ...dataLayers[layerId],
        id: layerId,
      }))
      .filter(layer => activeDataLayers.indexOf(layer.id) !== -1);

    const layerGroups = activeLayers.map(layer => ({
      id: layer.id,
      dataset: layer.id,
      visibility: layers[layer.id].visible,
      closeable: layer.id !== 'soc-experimental' && layer.id !== 'soc-stock',
      readonly: false,
      canChangeOpacity: true,
      layers: [
        {
          name: layer.label,
          opacity: layers[layer.id].opacity,
          order: layers[layer.id].order,
          legendConfig: layer.legend,
          timelineParams: layer.legend?.timeline
            ? {
                ...layer.legend?.timeline,
                startDate: layers[layer.id].dateRange?.[0] || layer.legend?.timeline.minDate,
                endDate: layers[layer.id].currentDate || layer.legend?.timeline.maxDate,
                trimEndDate: layers[layer.id].dateRange?.[1] || layer.legend?.timeline.maxDate,
              }
            : undefined,
          extraParams: getLayerExtraParams(layer, layers[layer.id]),
        },
      ],
    }));

    if (BOUNDARIES[boundaries.id].legend) {
      layerGroups.unshift({
        id: boundaries.id,
        dataset: boundaries.id,
        visibility: true,
        closeable: false,
        readonly: true,
        canChangeOpacity: true,
        layers: [
          {
            name: BOUNDARIES[boundaries.id].label,
            opacity: boundaries.opacity ?? 1,
            order: 9999,
            legendConfig: BOUNDARIES[boundaries.id].legend,
            timelineParams: undefined,
            extraParams: undefined,
          },
        ],
      });
    }

    const sortedLayerGroups = layerGroups.sort((groupA, groupB) =>
      groupA.layers[0].order < groupB.layers[0].order ? 1 : -1
    );

    return sortedLayerGroups;
  }
);

export const selectActiveLayersInteractiveIds = createSelector([selectBoundaries], boundaries => {
  if (BOUNDARIES[boundaries.id].config?.interactiveLayerIds) {
    return BOUNDARIES[boundaries.id].config.interactiveLayerIds;
  }

  return [];
});

export const selectAttributions = createSelector(
  [selectBasemap, selectDataLayers, selectActiveDataLayers],
  (basemap, dataLayers, activeDataLayers) => {
    const basemapAttributions = BASEMAPS[basemap].attributions
      ? BASEMAPS[basemap].attributions
      : [];
    const layerAttributions = activeDataLayers
      .map(layerId => dataLayers[layerId].attributions || [])
      .reduce((res, attr) => [...res, ...attr], []);
    const uniqueAttributions = [...new Set([...basemapAttributions, ...layerAttributions])];
    return `${
      uniqueAttributions.length
        ? `${uniqueAttributions.map(attr => ATTRIBUTIONS[attr]).join(' ')} | `
        : ''
    }© <a href="https://www.mapbox.com/about/maps/" target="_blank" rel="noopener noreferrer">Mapbox</a> | © <a href="http://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> | <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank" rel="noopener noreferrer">Improve this map</a></strong>`;
  }
);

export const selectAcceptableMinZoom = createSelector(
  [selectBasemap, selectBoundaries, selectDataLayers, selectActiveDataLayers, selectLayers],
  (basemap, boundaries, dataLayers, activeDataLayers, layers) =>
    Math.max(
      ...[
        BASEMAPS[basemap].minZoom,
        BOUNDARIES[boundaries.id].config?.source.minzoom ?? -Infinity,
        ...activeDataLayers.map(
          layerId => getLayerSource(layerId, dataLayers[layerId], layers[layerId]).minzoom
        ),
      ]
    )
);

export const selectAcceptableMaxZoom = createSelector(
  [selectBasemap, selectBoundaries, selectDataLayers, selectActiveDataLayers, selectLayers],
  (basemap, boundaries, dataLayers, activeDataLayers, layers) =>
    Math.min(
      ...[
        BASEMAPS[basemap].maxZoom,
        BOUNDARIES[boundaries.id].config?.source.maxzoom ?? Infinity,
        // ...activeDataLayers.map(layerId => dataLayers[layerId].config.source.maxzoom),
        ...activeDataLayers.map(
          layerId => getLayerSource(layerId, dataLayers[layerId], layers[layerId]).maxzoom
        ),
      ]
    )
);

export const selectSerializedState = createSelector(
  [
    selectViewport,
    selectBasemap,
    selectBasemapParams,
    selectRoads,
    selectLabels,
    selectBoundaries,
    selectLayers,
  ],
  (viewport, basemap, basemapParams, roads, labels, boundaries, layers) => {
    return {
      viewport: omit(viewport, 'transitionDuration', 'bounds'),
      basemap,
      basemapParams,
      roads,
      labels,
      boundaries,
      layers,
    };
  }
);

export default exploreActions =>
  createSlice({
    name: SLICE_NAME,
    initialState: {
      viewport: {
        zoom: 2,
        latitude: 0,
        longitude: 0,
        transitionDuration: 250,
        bounds: null,
      },
      basemap: 'light',
      basemapParams: null,
      roads: false,
      labels: false,
      boundaries: {
        id: 'no-boundaries',
      },
      layers: {
        'soc-stock': {
          visible: true,
          opacity: 1,
          order: 0,
        },
      },
    },
    reducers: {
      updateZoom(state, action) {
        state.viewport.zoom = action.payload;
      },
      updateCenter(state, action) {
        state.viewport.latitude = action.payload.latitude;
        state.viewport.longitude = action.payload.longitude;
      },
      updateBounds(state, action) {
        state.viewport.bounds = action.payload;
      },
      updateViewport(state, action) {
        const { transitionDuration } = state.viewport;
        state.viewport = action.payload;
        state.viewport.transitionDuration = transitionDuration;
      },
      updateBasemap(state, action) {
        state.basemap = action.payload.basemap;
        state.basemapParams = action.payload.params || null;
      },
      updateBasemapParams(state, action) {
        state.basemapParams = action.payload;
      },
      updateRoads(state, action) {
        state.roads = action.payload;
      },
      updateLabels(state, action) {
        state.labels = action.payload;
      },
      updateBoundaries(state, action) {
        state.boundaries = action.payload;
      },
      addLayer(state, action) {
        state.layers[action.payload] = {
          visible: true,
          opacity: 1,
          // Like z-index, the higher = on top
          order: Object.keys(state.layers).length,
        };
      },
      removeLayer(state, action) {
        const order = state.layers[action.payload].order;

        delete state.layers[action.payload];

        // We make sure to update the order of all the layers
        Object.keys(state.layers).forEach(layerId => {
          if (state.layers[layerId].order > order) {
            state.layers[layerId].order -= 1;
          }
        });
      },
      updateActiveLayers(state, action) {
        const previousLayers = { ...state.layers };
        // @ts-ignore
        state.layers = {};
        action.payload.forEach((layerId, index) => {
          state.layers[layerId] = {
            visible: true,
            opacity: 1,
            // Like z-index, the higher = on top
            order: index,
            ...(previousLayers[layerId] ?? {}),
          };
        });
      },
      updateLayer(state, action) {
        state.layers[action.payload.id] = {
          ...state.layers[action.payload.id],
          ...omit(action.payload, 'id'),
        };
      },
      updateLayerOrder(state, action) {
        const mapLayerToOrder = action.payload
          // We remove the IDs that correspond to the boundaries
          .filter(layerId => !!LAYERS[layerId])
          .reduce((res, layerId, index) => ({ ...res, [layerId]: index }), {});

        Object.keys(state.layers).forEach(layerId => {
          state.layers[layerId].order = mapLayerToOrder[layerId];
        });
      },
    },
    extraReducers: {
      [exploreActions.restoreState.fulfilled]: (state, action) => {
        const stateToRestore = action.payload[SLICE_NAME] || {};

        return {
          ...state,
          ...stateToRestore,
          viewport: {
            ...state.viewport,
            ...stateToRestore.viewport,
          },
          layers: stateToRestore.layers ?? state.layers,
        };
      },
    },
  });
