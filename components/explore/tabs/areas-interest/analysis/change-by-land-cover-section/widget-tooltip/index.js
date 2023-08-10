import { connect } from 'react-redux';

import { mapSelectors } from 'modules/explore';
import Component from './component';

export default connect(state => ({
  legendLayers: mapSelectors.selectLegendDataLayers(state),
  socLayerState: mapSelectors.selectSOCLayerState(state),
}))(Component);
