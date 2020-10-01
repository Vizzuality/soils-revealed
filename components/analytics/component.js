import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { initGA, logPageView } from 'utils/analytics';

const Analytics = ({ allowCookies, consentDate }) => {
  // When allowCookies or consentDate is updated, we eventually initialize the analytics
  useEffect(() => {
    if (allowCookies && consentDate) {
      initGA();
      logPageView(); // We log the current page
    }
  }, [allowCookies, consentDate]);

  return null;
};

Analytics.propTypes = {
  allowCookies: PropTypes.bool.isRequired,
  consentDate: PropTypes.number,
};

Analytics.defaultProps = {
  consentDate: null,
};

export default Analytics;
