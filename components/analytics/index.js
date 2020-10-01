import { connect } from 'react-redux';

import { selectAllowCookies, selectConsentDate } from 'modules/cookies';
import Component from './component';

export default connect(state => ({
  allowCookies: selectAllowCookies(state),
  consentDate: selectConsentDate(state),
}))(Component);
