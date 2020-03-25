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
          An increase of just 1% of the carbon stocks in the top metre of soils would be{' '}
          <mark>higher than the amount</mark> corresponding to the{' '}
          <mark>annual anthropogenic CO2</mark> emissions from fossil fuel burning.
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
