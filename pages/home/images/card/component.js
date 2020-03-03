import React from 'react';
import Icon from 'components/icon';

import './style.scss';

const Card = ({ info }) => (
  <div className="c-card">
    <img src={`/images${info.imageUrl}`} alt="Soils Revealed logo" />
    <div className="card-content">
      <div className="card-head">
        <Icon name="dots-dark" />
        <h4>CATEGORY NAME</h4>
      </div>

      <div className="card-info">
        <p className="card-category">{info.category}</p>
        <p className="card-description">{info.description}</p>
      </div>
    </div>
  </div>
);

export default Card;
