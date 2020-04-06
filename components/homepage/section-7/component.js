import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Link } from 'lib/routes';
import AboutModal from 'components/about-modal';

import './style.scss';

const Section7 = ({ configuration }) => {
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

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
              As well as estimating actual carbon storage, we’ve predicted the potential amount of
              carbon our soils could hold. Using that, you can see the areas where our action can
              make the biggest impact.{' '}
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 col-md-4 offset-md-2 text-center text-md-right mb-3">
              <Link route="explore">
                <a className="btn btn-outline-secondary btn-fixed-width">Explore map</a>
              </Link>
            </div>
            <div className="col-sm-12 col-md-4 text-center text-md-left">
              <button
                type="button"
                className="btn btn-outline-secondary btn-fixed-width"
                onClick={() => setAboutModalOpen(true)}
              >
                About
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
