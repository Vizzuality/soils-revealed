import { connect } from 'react-redux';

import { analysisSelectors, analysisActions, mapSelectors, mapActions } from 'modules/explore';
import Component from './component';

export default connect(
  state => ({
    areaInterest: analysisSelectors.selectAreaInterest(state),
    compareAreaInterest: analysisSelectors.selectCompareAreaInterest(state),
    drawingState: analysisSelectors.selectDrawingState(state),
    boundaries: mapSelectors.selectBoundaries(state),
  }),
  {
    updateAreaInterest: analysisActions.updateAreaInterest,
    updateCompareAreaInterest: analysisActions.updateCompareAreaInterest,
    updateDrawing: analysisActions.updateDrawing,
    updateDrawingState: analysisActions.updateDrawingState,
    updateBoundaries: mapActions.updateBoundaries,
  }
)(Component);
