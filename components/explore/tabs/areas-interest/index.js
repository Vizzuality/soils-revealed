import { connect } from 'react-redux';

import { analysisSelectors } from 'modules/explore';
import Component from './component';

export default connect(state => ({
  areasInterest: analysisSelectors.selectAreaInterest(state),
}))(Component);
