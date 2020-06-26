import { connect } from 'react-redux';

import { mapSelectors, analysisActions } from 'modules/explore';
import Component from './component';

export default connect(
  state => ({
    boundaries: mapSelectors.selectBoundaries(state),
  }),
  {
    updateAreaInterest: analysisActions.updateAreaInterest,
  }
)(Component);
