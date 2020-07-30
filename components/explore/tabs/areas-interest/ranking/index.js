import { connect } from 'react-redux';

import { analysisSelectors, mapSelectors } from 'modules/explore';
import Component from './component';

export default connect(state => ({
  areaInterest: analysisSelectors.selectAreaInterest(state),
  socLayerState: mapSelectors.selectSOCLayerState(state),
}))(Component);
