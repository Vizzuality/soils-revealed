import { connect } from 'react-redux';

import { exploreSelectors, exploreActions } from 'modules/explore';
import Component from './component';

const mapStateToProps = state => ({ showTour: exploreSelectors.selectShowTour(state) });

const mapDispatchToProps = {
  updateShowTour: exploreActions.updateShowTour,
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
