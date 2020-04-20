import { createSlice } from '@reduxjs/toolkit';

const SLICE_NAME = 'routing';

export const selectPathname = state => state[SLICE_NAME].pathname;
export const selectQuery = state => state[SLICE_NAME].query;

const routingSlice = createSlice({
  name: SLICE_NAME,
  initialState: {
    pathname: '/',
    query: {},
  },
  reducers: {
    updateRoute(state, action) {
      return action.payload;
    },
  },
});

export const { updateRoute } = routingSlice.actions;

export default routingSlice.reducer;
