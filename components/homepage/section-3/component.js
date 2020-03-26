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
        <div className="col-sm-12 col-md-3 offset-md-2 image" />
        <div className="col-sm-12 col-md-5">
          <div className="row mb-4">
            <div className="col intro">
              But due to agriculture, the world’s soils have lost 130 billion tons of organic
              carbon.
            </div>
          </div>
          <div className="row">
            <div className="col text">
              That means more carbon in the atmosphere, less productive soil for crops to grow in,
              and reduced ability for soil to clean water.
            </div>
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
