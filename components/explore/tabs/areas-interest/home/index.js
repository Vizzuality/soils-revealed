import { connect } from 'react-redux';

import { mapSelectors, mapActions, analysisActions } from 'modules/explore';
import Component from './component';

export default connect(
  state => ({
    boundaries: mapSelectors.selectBoundaries(state),
  }),
  {
    updateBoundaries: mapActions.updateBoundaries,
    updateAreaInterest: analysisActions.updateAreaInterest,
  }
)(Component);
