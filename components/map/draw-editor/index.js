import { connect } from 'react-redux';

import { analysisSelectors, analysisActions } from 'modules/explore';
import Component from './component';

export default connect(
  state => ({
    areaInterest: analysisSelectors.selectAreaInterest(state),
    drawingState: analysisSelectors.selectDrawingState(state),
  }),
  {
    updateAreaInterest: analysisActions.updateAreaInterest,
    updateCompareAreaInterest: analysisActions.updateCompareAreaInterest,
    updateDrawing: analysisActions.updateDrawing,
    updateDrawingState: analysisActions.updateDrawingState,
  }
)(Component);
