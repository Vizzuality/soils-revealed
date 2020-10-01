import { createSlice } from '@reduxjs/toolkit';

const SLICE_NAME = 'cookies';

export const selectAllowCookies = state => state[SLICE_NAME].allowCookies;
export const selectConsentDate = state => state[SLICE_NAME].consentDate;

const cookiesSlice = createSlice({
  name: SLICE_NAME,
  initialState: {
    allowCookies: false,
    consentDate: null,
  },
  reducers: {
    updateAllowCookies(state, action) {
      state.allowCookies = action.payload;
    },
    updateConsentDate(state, action) {
      state.consentDate = action.payload;
    },
  },
});

export const { updateAllowCookies, updateConsentDate } = cookiesSlice.actions;

export default cookiesSlice.reducer;
