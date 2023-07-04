import { connect } from 'react-redux';

import { mapSelectors, mapActions } from 'modules/explore';
import Component from './component';

export default connect(
  state => ({
    landCoverLayerState: mapSelectors.selectLandCoverLayerState(state),
  }),
  {
    updateLayer: mapActions.updateLayer,
  }
)(Component);
