import React from 'react';

import SectionTitle from 'components/section-title';
import Card from './card';
import cardInfo from './constants';

import './style.scss';

const CardsHomeComponent = () => (
  <div className="p-home-cards">
    <div className="container">
      <div className="row">
        <SectionTitle info={{ index: 4, text: 'DISCOVER PROJECTS' }} className="-secondary" />
      </div>

      <div className="row">
        <h2>Learn more in our absorbing stories.</h2>
      </div>

      <div className="row">
        <div className="col-sm-4">
          <Card info={cardInfo[0]} />
        </div>
        <div className="col-sm-8">
          <Card info={cardInfo[1]} />
        </div>
      </div>
    </div>
  </div>
);

export default CardsHomeComponent;
