import * as actions from './actions';

export default {
  [/** @type {any} */ (actions.setRoutes)]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),
};
