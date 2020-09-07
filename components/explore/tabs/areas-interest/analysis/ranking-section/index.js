import { connect } from 'react-redux';

import { analysisSelectors, mapSelectors, analysisActions, mapActions } from 'modules/explore';
import Component from './component';

export default connect(
  state => ({
    areaInterest: analysisSelectors.selectAreaInterest(state),
    boundaries: mapSelectors.selectBoundaries(state),
    viewport: mapSelectors.selectViewport(state),
  }),
  {
    updateCompareAreaInterest: analysisActions.updateCompareAreaInterest,
    updateViewport: mapActions.updateViewport,
  }
)(Component);
