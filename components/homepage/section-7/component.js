import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'lib/routes';

import './style.scss';

const Section7 = ({ configuration }) => (
  <section id={configuration.anchor} className="c-homepage-section-7">
    <div className="container">
      <div className="row mb-5">
        <div className="col-sm-12">
          <div className="section-title">{configuration.title}</div>
          <div className="section-description">{configuration.description}</div>
        </div>
        <div className="col-sm-12 col-md-8 offset-md-2 text-center intro">
          As well as estimating actual carbon storage, we’ve predicted the potential amount of
          carbon our soils could hold. Using that, you can see the areas where our action can make
          the biggest impact.{' '}
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12 col-md-8 offset-md-2 text-center">
          <Link route="explore">
            <a className="btn btn-outline-secondary btn-fixed-width">Explore map</a>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

Section7.propTypes = {
  id: PropTypes.string,
  configuration: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    anchor: PropTypes.string.isRequired,
  }).isRequired,
};

export default Section7;
