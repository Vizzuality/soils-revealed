import { configureStore, combineReducers } from '@reduxjs/toolkit';

import routingReducer from 'modules/routing';
import cookiesReducer from 'modules/cookies';
import { exploreReducer, mapReducer, analysisReducer } from 'modules/explore';

export default preloadedState =>
  configureStore({
    preloadedState,
    reducer: combineReducers({
      routing: routingReducer,
      cookies: cookiesReducer,
      explore: exploreReducer,
      map: mapReducer,
      analysis: analysisReducer,
    }),
    devTools: process.env.NODE_ENV !== 'production',
  });
