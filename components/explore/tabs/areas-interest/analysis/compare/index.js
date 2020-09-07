import { connect } from 'react-redux';

import { mapSelectors, analysisSelectors, analysisActions, mapActions } from 'modules/explore';
import Component from './component';

export default connect(
  state => ({
    boundaries: mapSelectors.selectBoundaries(state),
    areaInterest: analysisSelectors.selectAreaInterest(state),
    socLayerState: mapSelectors.selectSOCLayerState(state),
    viewport: mapSelectors.selectViewport(state),
  }),
  {
    updateCompareAreaInterest: analysisActions.updateCompareAreaInterest,
    updateDrawing: analysisActions.updateDrawing,
    updateViewport: mapActions.updateViewport,
  }
)(Component);
