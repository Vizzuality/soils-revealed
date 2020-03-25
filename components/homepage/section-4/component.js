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
          <mark>Carbon stored in soil can remain</mark> there for up to{' '}
          <mark>thousands of years</mark> before being washed into rivers by erosion or released
          into the atmosphere through soil respiration. Between 1989 and 2008 soil respiration
          increased by about 0.1% per year.
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
