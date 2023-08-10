import { connect } from 'react-redux';

import { mapSelectors, analysisActions, mapActions, analysisSelectors } from 'modules/explore';
import Component from './component';

export default connect(
  state => ({
    boundaries: mapSelectors.selectBoundaries(state),
    areaInterest: analysisSelectors.selectAreaInterest(state),
    compareAreaInterest: analysisSelectors.selectCompareAreaInterest(state),
    socLayerState: mapSelectors.selectSOCLayerState(state),
  }),
  {
    updateAreaInterest: analysisActions.updateAreaInterest,
    updateCompareAreaInterest: analysisActions.updateCompareAreaInterest,
    updateLayer: mapActions.updateLayer,
  }
)(Component);
