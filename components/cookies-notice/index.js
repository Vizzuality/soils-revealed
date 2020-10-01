import { connect } from 'react-redux';

import {
  selectAllowCookies,
  selectConsentDate,
  updateAllowCookies,
  updateConsentDate,
} from 'modules/cookies';
import Component from './component';

export default connect(
  state => ({
    allowCookies: selectAllowCookies(state),
    consentDate: selectConsentDate(state),
  }),
  {
    updateAllowCookies,
    updateConsentDate,
  }
)(Component);
