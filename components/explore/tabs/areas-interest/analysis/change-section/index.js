import { connect } from 'react-redux';

import { mapSelectors, mapActions } from 'modules/explore';
import Component from './component';

export default connect(
  state => ({
    legendLayers: mapSelectors.selectLegendDataLayers(state),
  }),
  {
    updateLayer: mapActions.updateLayer,
  }
)(Component);
