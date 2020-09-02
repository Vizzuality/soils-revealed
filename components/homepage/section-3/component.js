import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const Section3 = ({ configuration }) => (
  <section id={configuration.anchor} className="c-homepage-section-3">
    <div className="container">
      <div className="row">
        <div className="col-sm-12">
          <div className="section-title">{configuration.title}</div>
          <div className="section-description">{configuration.description}</div>
        </div>
        <div className="col-sm-12 col-md-5 offset-md-2">
          <div className="row mb-4">
            <div className="col intro">
              But due to agriculture, the world’s soils have lost 116 billion tons of organic carbon
              or roughly a fourth of all carbon emitted by humans since the Industrial Revolution.
            </div>
          </div>
        </div>
        <div className="col-sm-12 col-md-3 images-container">
          <div>
            <img src="/images/homepage-section-3-image-1.jpeg" alt="Aerial view of a crop field" />
          </div>
          <div>
            <img src="/images/homepage-section-3-image-2.jpeg" alt="Aerial view of a crop field" />
          </div>
          <div>
            <img src="/images/homepage-section-3-image-3.jpeg" alt="Aerial view of a crop field" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

Section3.propTypes = {
  id: PropTypes.string,
  configuration: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    anchor: PropTypes.string.isRequired,
  }).isRequired,
};

export default Section3;
