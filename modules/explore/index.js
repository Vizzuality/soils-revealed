import { createSelector, createAsyncThunk, createReducer, createAction } from '@reduxjs/toolkit';

import { deserialize, serialize } from 'utils/functions';
import { selectQuery } from '../routing';
import createMapSlice, * as mapModule from './map';
import createAnalysisSlice, * as analysisModule from './analysis';
import { BOUNDARIES } from 'components/map/constants';

// Common actions for the explore module
const actions = {
  restoreState: createAsyncThunk('explore/restoreState', (_, { getState }) => {
    const state = getState();
    const query = selectQuery(state);
    return deserialize(query.state);
  }),
  updateShowTour: createAction('explore/updateShowTour'),
};

// Slices belonging to the explore module
const mapSlice = createMapSlice(actions);
const analysisSlice = createAnalysisSlice(actions);

// Common selectors for the explore module
const selectors = {
  selectSerializedState: createSelector(
    [mapModule.selectSerializedState, analysisModule.selectSerializedState],
    (mapState, analysisState) =>
      serialize({
        [mapModule.SLICE_NAME]: mapState,
        [analysisModule.SLICE_NAME]: analysisState,
      })
  ),
  selectShowTour: state => state.explore.showTour,
  selectFeatureStates: createSelector(
    [
      mapModule.selectBoundaries,
      analysisModule.selectAreaInterest,
      analysisModule.selectCompareAreaInterest,
    ],
    (boundaries, areaInterest, compareAreaInterest) => {
      if (areaInterest) {
        let res = [
          {
            source: boundaries.id,
            sourceLayer: BOUNDARIES[boundaries.id].config.render.layers[0]['source-layer'],
            id: areaInterest.id,
            state: { active: true },
          },
        ];

        if (compareAreaInterest) {
          res.push({
            source: boundaries.id,
            sourceLayer: BOUNDARIES[boundaries.id].config.render.layers[0]['source-layer'],
            id: compareAreaInterest.id,
            state: { active: true },
          });
        }

        return res;
      }

      return [];
    }
  ),
};

const reducer = createReducer(
  {
    showTour: false,
  },
  {
    [actions.updateShowTour.toString()]: (state, action) => {
      state.showTour = action.payload;
    },
  }
);

export const exploreActions = actions;
export const exploreSelectors = selectors;
export const exploreReducer = reducer;

export const mapReducer = mapSlice.reducer;
export const mapActions = mapSlice.actions;
export const mapSelectors = mapModule;

export const analysisReducer = analysisSlice.reducer;
export const analysisActions = analysisSlice.actions;
export const analysisSelectors = analysisModule;
