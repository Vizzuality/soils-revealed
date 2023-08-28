import React, { useState, useEffect } from 'react';
import { useCookieConsentContext } from '@use-cookie-consent/react';

import './style.scss';

const CookiesNotice = () => {
  const { consent, acceptCookies, declineAllCookies } = useCookieConsentContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || consent.thirdParty !== undefined) {
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
                  onClick={() => acceptCookies({ thirdParty: true })}
                >
                  Accept
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary flex-grow-1 flex-md-grow-0 btn-fixed-width-md ml-2 ml-md-0 mt-md-2"
                  onClick={() => declineAllCookies()}
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

export default CookiesNotice;
