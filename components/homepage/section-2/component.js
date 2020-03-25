import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const Section2 = ({ configuration }) => (
  <section id={configuration.anchor} className="c-homepage-section-2">
    <div className="container">
      <div className="row">
        <div className="col-sm-12">
          <div className="section-title">{configuration.title}</div>
          <div className="section-description">{configuration.description}</div>
        </div>
        <div className="col-sm-12 col-md-8 offset-md-2 intro">
          Did you know? Globally, soils hold at least two trillion tonnes of organic carbon; around
          three times as much as the atmosphere.
        </div>
      </div>
    </div>
  </section>
);

Section2.propTypes = {
  id: PropTypes.string,
  configuration: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    anchor: PropTypes.string.isRequired,
  }).isRequired,
};

export default Section2;
