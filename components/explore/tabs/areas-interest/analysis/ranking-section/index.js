import { connect } from 'react-redux';

import { analysisSelectors, mapSelectors, analysisActions } from 'modules/explore';
import Component from './component';

export default connect(
  state => ({
    areaInterest: analysisSelectors.selectAreaInterest(state),
    boundaries: mapSelectors.selectBoundaries(state),
  }),
  {
    updateCompareAreaInterest: analysisActions.updateCompareAreaInterest,
  }
)(Component);
