import React, { useState } from 'react';

import { Link } from 'lib/routes';
import Icon from 'components/icon';
import AboutModal from 'components/about-modal';

import './style.scss';

const Section1 = () => {
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  return (
    <>
      <AboutModal open={aboutModalOpen} onClose={() => setAboutModalOpen(false)} />
      <section className="c-homepage-section-1">
        <div className="scroll-text-container">
          <div className="container text-center">
            <div className="row mb-5">
              <div className="col title">Soil carbon can help combat climate change.</div>
            </div>
            <div className="row mb-4">
              <div className="col intro">
                We’ve predicted the potential amount of carbon our soils could hold.
                <br />
                Using that, you can see the areas where our action can make the biggest impact.
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 col-md-4 offset-md-2 text-center text-md-right mb-3 mb-md-0">
                <Link to="explore">
                  <a className="btn btn-primary btn-fixed-width">Explore map</a>
                </Link>
              </div>
              <div className="col-sm-12 col-md-4 text-center text-md-left">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-fixed-width"
                  onClick={() => setAboutModalOpen(true)}
                >
                  About us
                </button>
              </div>
            </div>
          </div>
          <div className="text-center scroll-text">
            Scroll to discover
            <Icon name="bottom-arrow" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Section1;
