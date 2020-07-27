import { connect } from 'react-redux';

import { analysisActions } from 'modules/explore';
import Component from './component';

export default connect(null, {
  updateDrawing: analysisActions.updateDrawing,
})(Component);
