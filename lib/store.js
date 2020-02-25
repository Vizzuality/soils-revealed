import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import { handleModule } from 'vizzuality-redux-tools';

import * as routes from 'modules/routes';

const reducer = combineReducers({
  routes: handleModule(routes),
});

const makeStore = (initialState = {}) =>
  createStore(
    reducer,
    initialState,
    /* Redux dev tool, install chrome extension in
     * https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en */
    composeWithDevTools(
      /* The router middleware MUST be before thunk otherwise the URL changes
       * inside a thunk function won't work properly */
      applyMiddleware(thunkMiddleware)
    )
  );

export default makeStore;
