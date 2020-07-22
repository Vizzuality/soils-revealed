import { connect } from 'react-redux';

import { mapSelectors, mapActions, analysisActions, analysisSelectors } from 'modules/explore';
import Component from './component';

export default connect(
  state => ({
    socLayerState: mapSelectors.selectSOCLayerState(state),
    boundaries: mapSelectors.selectBoundaries(state),
    rankingBoundaries: mapSelectors.selectRankingBoundaries(state),
    rankingBoundariesOptions: mapSelectors.selectRankingBoundariesOptions(state),
    areaInterest: analysisSelectors.selectAreaInterest(state),
  }),
  {
    updateBoundaries: mapActions.updateBoundaries,
    updateAreaInterest: analysisActions.updateAreaInterest,
    updateCompareAreaInterest: analysisActions.updateCompareAreaInterest,
    updateLayer: mapActions.updateLayer,
  }
)(Component);
