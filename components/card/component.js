import React from 'react';
import PropType from 'prop-types';
import Icon from 'components/icon';

import './style.scss';

const Card = ({ info }) => (
  <div className="c-card">
    <img src={`/images${info.imageUrl}`} alt={info.title} />
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

Card.propTypes = {
  info: PropType.shape({
    title: PropType.string.isRequired,
    imageUrl: PropType.string.isRequired,
    category: PropType.string.isRequired,
    description: PropType.string.isRequired,
  }),
};

export default Card;
