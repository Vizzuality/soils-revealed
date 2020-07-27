import { connect } from 'react-redux';

import { analysisSelectors, mapSelectors, mapActions, analysisActions } from 'modules/explore';
import Component from './component';

export default connect(
  state => ({
    areaInterest: analysisSelectors.selectAreaInterest(state),
    compareAreaInterest: analysisSelectors.selectCompareAreaInterest(state),
    socLayerState: mapSelectors.selectSOCLayerState(state),
  }),
  {
    updateLayer: mapActions.updateLayer,
    updateCompareAreaInterest: analysisActions.updateCompareAreaInterest,
    swapAndResetAreaInterest: analysisActions.swapAndResetAreaInterest,
  }
)(Component);
