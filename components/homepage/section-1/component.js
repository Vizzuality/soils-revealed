import React from 'react';

import { Link } from 'lib/routes';
import Icon from 'components/icon';

import './style.scss';

const Section1 = () => (
  <section className="c-homepage-section-1">
    <div className="scroll-text-container">
      <div className="container text-center">
        <div className="row mb-5">
          <div className="col title">Soil carbon can help combat climate change.</div>
        </div>
        <div className="row mb-4">
          <div className="col intro">
            Soils Revealed can help you find places with the greatest potential to increase soil
            organic carbon and advance food security, water quality and climate action.
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Link to="explore">
              <a className="btn btn-primary btn-fixed-width">Explore</a>
            </Link>
          </div>
        </div>
      </div>
      <div className="text-center scroll-text">
        Scroll to discover
        <Icon name="bottom-arrow" />
      </div>
    </div>
  </section>
);

export default Section1;
