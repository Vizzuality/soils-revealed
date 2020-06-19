import { connect } from 'react-redux';

import { exploreActions } from 'modules/explore';
import Component from './component';

export default connect(null, {
  onClickHelp: () => exploreActions.updateShowTour(true),
})(Component);
