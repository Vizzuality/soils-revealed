import { connect } from 'react-redux';

import { exploreSelectors, mapSelectors, exploreActions, mapActions } from 'modules/explore';
import Component from './component';

export default connect(
  state => ({
    zoom: mapSelectors.selectZoom(state),
    viewport: mapSelectors.selectViewport(state),
    serializedState: exploreSelectors.selectSerializedState(state),
  }),
  {
    restoreState: exploreActions.restoreState,
    updateZoom: mapActions.updateZoom,
    updateViewport: mapActions.updateViewport,
  }
)(Component);
