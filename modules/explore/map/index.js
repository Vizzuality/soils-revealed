import { createSlice, createSelector } from '@reduxjs/toolkit';
import { omit } from 'lodash';

import { BASEMAPS } from 'components/map';

export const SLICE_NAME = 'map';

export const selectViewport = state => state[SLICE_NAME].viewport;
export const selectZoom = createSelector([selectViewport], viewport => viewport.zoom);
export const selectCenter = createSelector([selectViewport], viewport => ({
  latitude: viewport.lat,
  longitude: viewport.lng,
}));
export const selectBasemap = state => state[SLICE_NAME].basemap;
export const selectRoads = state => state[SLICE_NAME].roads;
export const selectLabels = state => state[SLICE_NAME].labels;
export const selectBoundaries = state => state[SLICE_NAME].boundaries;
export const selectAcceptableMinZoom = createSelector(
  [selectBasemap],
  basemap => BASEMAPS[basemap].minZoom
);
export const selectAcceptableMaxZoom = createSelector(
  [selectBasemap],
  basemap => BASEMAPS[basemap].maxZoom
);

export const selectSerializedState = createSelector(
  [selectViewport, selectBasemap, selectRoads, selectLabels, selectBoundaries],
  (viewport, basemap, roads, labels, boundaries) => {
    return {
      viewport: omit(viewport, 'transitionDuration'),
      basemap,
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
      },
      basemap: 'light',
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
      updateViewport(state, action) {
        const { transitionDuration } = state.viewport;
        state.viewport = action.payload;
        state.viewport.transitionDuration = transitionDuration;
      },
      updateBasemap(state, action) {
        state.basemap = action.payload;
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
