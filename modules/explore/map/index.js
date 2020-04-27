import { createSlice, createSelector } from '@reduxjs/toolkit';
import { omit } from 'lodash';

import { BASEMAPS, BOUNDARIES } from 'components/map';

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
export const selectBoundariesLayerDef = createSelector([selectBoundaries], boundaries => {
  if (!BOUNDARIES[boundaries].url) {
    return null;
  }

  return {
    id: boundaries,
    type: 'vector',
    source: {
      type: 'vector',
      tiles: [BOUNDARIES[boundaries].url],
      minzoom: BOUNDARIES[boundaries].minZoom,
      maxzoom: BOUNDARIES[boundaries].maxZoom,
    },
    render: BOUNDARIES[boundaries].render,
  };
});
export const selectAcceptableMinZoom = createSelector(
  [selectBasemap, selectBoundaries],
  (basemap, boundaries) => Math.max(BASEMAPS[basemap].minZoom, BOUNDARIES[boundaries].minZoom)
);
export const selectAcceptableMaxZoom = createSelector(
  [selectBasemap, selectBoundaries],
  (basemap, boundaries) => Math.min(BASEMAPS[basemap].maxZoom, BOUNDARIES[boundaries].maxZoom)
);
export const selectBasemapLayerDef = createSelector(
  [selectBasemap, selectBasemapParams],
  (basemap, basemapParams) => {
    let basemapUrl = BASEMAPS[basemap].url;

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
    };
  }
);
export const selectActiveLayersDef = createSelector(
  [selectBasemapLayerDef, selectBoundariesLayerDef],
  (basemapLayerDef, boundariesLayerDef) => [
    ...(boundariesLayerDef ? [boundariesLayerDef] : []),
    basemapLayerDef,
  ]
);

export const selectSerializedState = createSelector(
  [selectViewport, selectBasemap, selectBasemapParams, selectRoads, selectLabels, selectBoundaries],
  (viewport, basemap, basemapParams, roads, labels, boundaries) => {
    return {
      viewport: omit(viewport, 'transitionDuration', 'bounds'),
      basemap,
      basemapParams,
      roads,
      labels,
      boundaries,
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
      boundaries: 'no-boundaries',
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
        };
      },
    },
  });
