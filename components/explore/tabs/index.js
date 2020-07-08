import { connect } from 'react-redux';

import { analysisSelectors, analysisActions, exploreSelectors } from 'modules/explore';
import Component from './component';

export default connect(
  state => ({
    showTour: exploreSelectors.selectShowTour(state),
    areasInterest: analysisSelectors.selectAreaInterest(state),
  }),
  {
    updateAreasInterest: analysisActions.updateAreaInterest,
  }
)(Component);
