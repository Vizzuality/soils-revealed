import React from 'react';

import SectionTitle from 'components/section-title';
import Card from './card';
import cardInfo from './constants';

import './style.scss';

const CardsHomeComponent = () => (
  <div className="p-home-cards">
    <div className="container">
      <div className="row">
        <div className="col">
          <SectionTitle info={{ index: 4, text: 'Discover projects' }} className="-secondary" />
        </div>
      </div>

      <div className="row">
        <div className="col">
          <h3>Learn more in our absorbing stories.</h3>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4">
          <Card info={cardInfo[0]} />
        </div>
        <div className="col-md-8">
          <Card info={cardInfo[1]} />
        </div>
      </div>
    </div>
  </div>
);

export default CardsHomeComponent;
