import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const CookiesNotice = ({ allowCookies, consentDate, updateAllowCookies, updateConsentDate }) => {
  const [mounted, setMounted] = useState(false);

  const onAcceptCookies = useCallback(() => {
    updateAllowCookies(true);
    updateConsentDate(+new Date());
  }, [updateAllowCookies, updateConsentDate]);

  const onRefuseCookies = useCallback(() => {
    updateAllowCookies(false);
    updateConsentDate(+new Date());
  }, [updateAllowCookies, updateConsentDate]);

  // When the component is mounted, we store that information
  useEffect(() => {
    setMounted(true);
  }, [setMounted]);

  // On mount, we check if the user has already consented to allowing the cookies or not
  useEffect(() => {
    try {
      const storedAllowCookies = localStorage.getItem('allowCookies');
      const storedConsentDate = localStorage.getItem('cookiesConsentDate');

      const hasAllowedCookies = storedAllowCookies === 'true';
      const isConsentDateRecorded =
        typeof storedConsentDate === 'string' &&
        storedConsentDate.length > 0 &&
        !Number.isNaN(+storedConsentDate);

      if (isConsentDateRecorded) {
        updateAllowCookies(hasAllowedCookies);
        updateConsentDate(+storedConsentDate);
      }
    } catch (e) {
      console.error('Unable to access the localStorage.');
    }
  }, [updateAllowCookies, updateConsentDate]);

  // When allowCookies or consentDate is updated, we store the values in the localStorage
  useEffect(() => {
    try {
      if (consentDate) {
        localStorage.setItem('allowCookies', `${allowCookies}`);
        localStorage.setItem('cookiesConsentDate', `${+consentDate}`);
      }
    } catch (e) {
      console.error('Unable to access the localStorage');
    }
  }, [allowCookies, consentDate]);

  // We avoid a flash of the cookies notice by not displaying it by default, until the component is
  // mounted
  if (!mounted) {
    return null;
  }

  // Whether the user has allowed the cookies or not, if they have consented to either choice, the
  // notice should not be displayed again
  if (consentDate) {
    return null;
  }

  return (
    <div role="alert" aria-live="polite" className="c-cookies-notice">
      <div className="container">
        <div className="row">
          <div className="col py-2 py-md-3">
            <div className="d-flex flex-column flex-md-row">
              <div>
                <div>
                  Soils Revealed uses cookies that collect personal data in order to measure the
                  audience and analyze the needs of our users, with the goal of improving the
                  platform. If you accept the use of cookies, data will be shared with{' '}
                  <a
                    href="https://analytics.google.com/analytics/web/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google Analytics
                  </a>
                  . If you refuse, no cookies will be set and no data collection will occur.
                </div>
              </div>
              <div className="d-flex flex-row flex-md-column mt-3 mt-md-0 ml-md-5">
                <button
                  type="button"
                  className="btn btn-sm btn-secondary flex-grow-1 flex-md-grow-0 btn-fixed-width-md"
                  onClick={onAcceptCookies}
                >
                  Accept
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary flex-grow-1 flex-md-grow-0 btn-fixed-width-md ml-2 ml-md-0 mt-md-2"
                  onClick={onRefuseCookies}
                >
                  Refuse
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CookiesNotice.propTypes = {
  allowCookies: PropTypes.bool.isRequired,
  consentDate: PropTypes.number,
  updateAllowCookies: PropTypes.func.isRequired,
  updateConsentDate: PropTypes.func.isRequired,
};

CookiesNotice.defaultProps = {
  consentDate: null,
};

export default CookiesNotice;
