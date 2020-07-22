import { createSlice, createSelector } from '@reduxjs/toolkit';

export const SLICE_NAME = 'analysis';

export const selectAreaInterest = state => state[SLICE_NAME].areaInterest;

export const selectCompareAreaInterest = state => state[SLICE_NAME].compareAreaInterest;

export const selectSerializedState = createSelector(
  [selectAreaInterest, selectCompareAreaInterest],
  (areaInterest, compareAreaInterest) => ({
    areaInterest,
    compareAreaInterest,
  })
);

export default exploreActions =>
  createSlice({
    name: SLICE_NAME,
    initialState: {
      areaInterest: null,
      compareAreaInterest: null,
    },
    reducers: {
      updateAreaInterest(state, action) {
        state.areaInterest = action.payload;
      },
      updateCompareAreaInterest(state, action) {
        state.compareAreaInterest = action.payload;
      },
    },
    extraReducers: {
      [exploreActions.restoreState.fulfilled]: (state, action) => {
        const stateToRestore = action.payload[SLICE_NAME] || {};

        return {
          ...state,
          ...stateToRestore,
        };
      },
    },
  });
