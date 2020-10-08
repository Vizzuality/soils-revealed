import { connect } from 'react-redux';

import { mapSelectors, analysisSelectors } from 'modules/explore';
import Component from './component';

export default connect(state => ({
  socLayerState: mapSelectors.selectSOCLayerState(state),
  areaInterest: analysisSelectors.selectAreaInterest(state),
  compareAreaInterest: analysisSelectors.selectCompareAreaInterest(state),
}))(Component);
