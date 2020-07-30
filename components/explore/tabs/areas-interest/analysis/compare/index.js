import { connect } from 'react-redux';

import { mapSelectors, analysisSelectors, analysisActions } from 'modules/explore';
import Component from './component';

export default connect(
  state => ({
    boundaries: mapSelectors.selectBoundaries(state),
    areaInterest: analysisSelectors.selectAreaInterest(state),
    socLayerState: mapSelectors.selectSOCLayerState(state),
  }),
  {
    updateCompareAreaInterest: analysisActions.updateCompareAreaInterest,
    updateDrawing: analysisActions.updateDrawing,
  }
)(Component);
