import { configureStore, combineReducers } from '@reduxjs/toolkit';

import routingReducer from 'modules/routing';
import { exploreReducer, mapReducer, analysisReducer } from 'modules/explore';

export default preloadedState =>
  configureStore({
    preloadedState,
    reducer: combineReducers({
      routing: routingReducer,
      explore: exploreReducer,
      map: mapReducer,
      analysis: analysisReducer,
    }),
  });
