import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import { Link } from 'lib/routes';
import { logEvent } from 'utils/analytics';
import AboutModal from 'components/about-modal';

import './style.scss';

const Section7 = ({ configuration }) => {
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  const onClickExplore = useCallback(() => {
    logEvent('Homepage', 'click on calls to action buttons', 'explore map (bottom of page)');
  }, []);

  const onClickAbout = useCallback(() => {
    logEvent('Homepage', 'click on calls to action buttons', 'about us (bottom of page)');
    setAboutModalOpen(true);
  }, [setAboutModalOpen]);

  return (
    <>
      <AboutModal open={aboutModalOpen} onClose={() => setAboutModalOpen(false)} />
      <section id={configuration.anchor} className="c-homepage-section-7">
        <div className="container">
          <div className="row mb-5">
            <div className="col-sm-12">
              <div className="section-title">{configuration.title}</div>
              <div className="section-description">{configuration.description}</div>
            </div>
            <div className="col-sm-12 col-md-8 offset-md-2 text-center intro">
              Check out our maps with soil organic carbon predictions and trends for the past and
              for future scenarios.
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 col-md-4 offset-md-2 text-center text-md-right mb-3">
              <Link route="explore">
                <a className="btn btn-secondary btn-fixed-width" onClick={onClickExplore}>
                  Explore map
                </a>
              </Link>
            </div>
            <div className="col-sm-12 col-md-4 text-center text-md-left">
              <button
                type="button"
                className="btn btn-outline-secondary btn-fixed-width"
                onClick={onClickAbout}
              >
                About us
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

Section7.propTypes = {
  id: PropTypes.string,
  configuration: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    anchor: PropTypes.string.isRequired,
  }).isRequired,
};

export default Section7;
