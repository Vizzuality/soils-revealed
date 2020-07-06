import { connect } from 'react-redux';

import { analysisSelectors, analysisActions } from 'modules/explore';
import Component from './component';

export default connect(
  state => ({
    areasInterest: analysisSelectors.selectAreaInterest(state),
  }),
  {
    updateAreasInterest: analysisActions.updateAreaInterest,
  }
)(Component);
