import { connect } from 'react-redux';

import { analysisSelectors, analysisActions, exploreSelectors } from 'modules/explore';
import Component from './component';

export default connect(
  state => ({
    showTour: exploreSelectors.selectShowTour(state),
    areaInterest: analysisSelectors.selectAreaInterest(state),
  }),
  {
    updateAreaInterest: analysisActions.updateAreaInterest,
  }
)(Component);
