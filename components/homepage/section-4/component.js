import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const Section4 = ({ configuration }) => (
  <section id={configuration.anchor} className="c-homepage-section-4">
    <div className="container">
      <div className="row">
        <div className="col-sm-12">
          <div className="section-title">{configuration.title}</div>
          <div className="section-description">{configuration.description}</div>
        </div>
        <div className="col-sm-12 col-md-8 offset-md-2 intro">
          <mark>Carbon stored in soil can be maintained for thousands of years</mark> under natural
          conditions. Upon disturbance and land use change, 30-80 % of the surficial carbon can be
          emitted to the atmosphere. Judicious management can help prevent such losses.
        </div>
      </div>
    </div>
  </section>
);

Section4.propTypes = {
  id: PropTypes.string,
  configuration: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    anchor: PropTypes.string.isRequired,
  }).isRequired,
};

export default Section4;
