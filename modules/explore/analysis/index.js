import { createSlice, createSelector } from '@reduxjs/toolkit';

export const SLICE_NAME = 'analysis';

export const selectAreaInterest = state => state[SLICE_NAME].areaInterest;

export const selectSerializedState = createSelector([selectAreaInterest], areaInterest => ({
  areaInterest,
}));

export default exploreActions =>
  createSlice({
    name: SLICE_NAME,
    initialState: {
      areaInterest: null,
    },
    reducers: {
      updateAreaInterest(state, action) {
        state.areaInterest = action.payload;
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
