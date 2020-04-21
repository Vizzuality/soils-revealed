import { configureStore, combineReducers } from '@reduxjs/toolkit';

import routingReducer from 'modules/routing';
import { mapReducer } from 'modules/explore';

export default preloadedState =>
  configureStore({
    preloadedState,
    reducer: combineReducers({
      routing: routingReducer,
      map: mapReducer,
    }),
  });
