import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import { Link } from 'lib/routes';
import { logEvent } from 'utils/analytics';
import AboutModal from 'components/about-modal';
import JoinUsModal from 'components/join-us-modal';

import './style.scss';

const Section7 = ({ configuration }) => {
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [joinUsModalOpen, setJoinUsModalOpen] = useState(false);

  const onClickExplore = useCallback(() => {
    logEvent('Homepage', 'click on calls to action buttons', 'explore map (bottom of page)');
  }, []);

  const onClickAbout = useCallback(() => {
    logEvent('Homepage', 'click on calls to action buttons', 'about us (bottom of page)');
    setAboutModalOpen(true);
  }, [setAboutModalOpen]);

  const onClickJoinUs = useCallback(() => {
    logEvent('Homepage', 'click on calls to action buttons', 'join us (bottom of page)');
    setJoinUsModalOpen(true);
  }, [setJoinUsModalOpen]);

  return (
    <>
      <AboutModal open={aboutModalOpen} onClose={() => setAboutModalOpen(false)} />
      <JoinUsModal open={joinUsModalOpen} onClose={() => setJoinUsModalOpen(false)} />
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
          <div className="row justify-content-center">
            <div className="col-sm-12 col-md-auto mb-3 mb-md-0 text-center">
              <Link route="explore">
                <a className="btn btn-secondary btn-fixed-width" onClick={onClickExplore}>
                  Explore map
                </a>
              </Link>
            </div>
            <div className="col-sm-12 col-md-auto mb-3 mb-md-0 text-center">
              <button
                type="button"
                className="btn btn-outline-secondary btn-fixed-width"
                onClick={onClickAbout}
              >
                About us
              </button>
            </div>
            <div className="col-sm-12 col-md-auto text-center">
              <button
                type="button"
                className="btn btn-outline-secondary btn-fixed-width"
                onClick={onClickJoinUs}
              >
                Join us
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
