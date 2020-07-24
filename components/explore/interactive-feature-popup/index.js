import { connect } from 'react-redux';

import { mapSelectors, analysisActions, analysisSelectors } from 'modules/explore';
import Component from './component';

export default connect(
  state => ({
    boundaries: mapSelectors.selectBoundaries(state),
    compareAreaInterest: analysisSelectors.selectCompareAreaInterest(state),
  }),
  {
    updateAreaInterest: analysisActions.updateAreaInterest,
    updateCompareAreaInterest: analysisActions.updateCompareAreaInterest,
  }
)(Component);
