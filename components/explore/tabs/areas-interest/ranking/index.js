import { connect } from 'react-redux';

import { analysisActions, mapActions, mapSelectors } from 'modules/explore';
import Component from './component';

export default connect(
  state => ({
    boundaries: mapSelectors.selectBoundaries(state),
    rankingBoundaries: mapSelectors.selectRankingBoundaries(state),
    legendLayers: mapSelectors.selectLegendDataLayers(state),
  }),
  {
    updateBoundaries: mapActions.updateBoundaries,
    updateAreaInterest: analysisActions.updateAreaInterest,
  }
)(Component);
