import { createSelector, createAsyncThunk, createReducer, createAction } from '@reduxjs/toolkit';

import { deserialize, serialize } from 'utils/functions';
import { selectQuery } from '../routing';
import createMapSlice, * as mapModule from './map';

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

// Common selectors for the explore module
const selectors = {
  selectSerializedState: createSelector([mapModule.selectSerializedState], mapState =>
    serialize({
      [mapModule.SLICE_NAME]: mapState,
    })
  ),
  selectShowTour: state => state.explore.showTour,
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
