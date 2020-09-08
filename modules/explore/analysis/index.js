import { createSlice, createSelector } from '@reduxjs/toolkit';

export const SLICE_NAME = 'analysis';

export const selectAreaInterest = state => state[SLICE_NAME].areaInterest;

export const selectCompareAreaInterest = state => state[SLICE_NAME].compareAreaInterest;

export const selectDrawing = state => state[SLICE_NAME].drawing;
export const selectDrawingState = state => state[SLICE_NAME].drawingState;

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
      drawing: false,
      drawingState: 'drawing', // 'drawing' or 'error'
    },
    reducers: {
      updateAreaInterest(state, action) {
        state.areaInterest = action.payload;

        if (action.payload === null) {
          state.compareAreaInterest = null;
        }
      },
      updateCompareAreaInterest(state, action) {
        state.compareAreaInterest = action.payload;
      },
      swapAndResetAreaInterest(state) {
        state.areaInterest = state.compareAreaInterest;
        state.compareAreaInterest = null;
      },
      updateDrawing(state, action) {
        state.drawing = action.payload;

        if (action.payload === false) {
          state.drawingState = 'drawing';
        }
      },
      updateDrawingState(state, action) {
        state.drawingState = action.payload;
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
