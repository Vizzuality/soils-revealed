import { configureStore, combineReducers } from '@reduxjs/toolkit';

import routingReducer from 'modules/routing';

export default preloadedState =>
  configureStore({
    preloadedState,
    reducer: combineReducers({
      routing: routingReducer,
    }),
  });
