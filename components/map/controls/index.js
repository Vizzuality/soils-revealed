import { connect } from 'react-redux';

import { analysisSelectors, exploreActions } from 'modules/explore';
import Component from './component';

export default connect(
  state => ({
    drawing: analysisSelectors.selectDrawing(state),
  }),
  {
    onClickHelp: () => exploreActions.updateShowTour(true),
  }
)(Component);
