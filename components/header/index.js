import { connect } from 'react-redux';

import { selectPathname } from 'modules/routing';
import Component from './component';

const mapStateToProps = state => ({
  pathname: selectPathname(state),
});

export default connect(mapStateToProps)(Component);
