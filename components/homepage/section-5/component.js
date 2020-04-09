import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const Section5 = ({ configuration }) => (
  <section id={configuration.anchor} className="c-homepage-section-5">
    <div className="container">
      <div className="row">
        <div className="col-sm-12">
          <div className="section-title">{configuration.title}</div>
          <div className="section-description">{configuration.description}</div>
        </div>
        <div className="col-sm-12 col-md-8 offset-md-2 intro">
          A relatively small increase in the soil organic carbon stocks in the topsoil would{' '}
          <mark>significantly reduce the CO2 concentration</mark> in the atmosphere related to human
          activities. When realised, such an increase would help to stabilise the climate and ensure
          food security.
        </div>
      </div>
    </div>
  </section>
);

Section5.propTypes = {
  id: PropTypes.string,
  configuration: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    anchor: PropTypes.string.isRequired,
  }).isRequired,
};

export default Section5;
