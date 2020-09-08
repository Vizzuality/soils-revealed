import { connect } from 'react-redux';

import { analysisSelectors } from 'modules/explore';
import Component from './component';

export default connect(state => ({
  drawing: analysisSelectors.selectDrawing(state),
  drawingState: analysisSelectors.selectDrawingState(state),
}))(Component);
