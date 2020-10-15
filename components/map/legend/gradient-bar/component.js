import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const GradientBar = ({ items }) => {
  const itemsWithValue = useMemo(() => (items ?? []).filter(item => !!item.value), [items]);

  return (
    <div className="c-map-legend-gradient-bar">
      <div
        className="gradient"
        style={{
          backgroundImage: `linear-gradient(to right, ${(items ?? [])
            .map(item => item.color)
            .join(',')})`,
        }}
      />
      <div className="ticks">
        {Array(itemsWithValue.length)
          .fill(0)
          .map((_, index) => (
            <div key={itemsWithValue[index].value} />
          ))}
      </div>
      <div className="values">
        {itemsWithValue.map(item => (
          <div key={item.value} data-value={item.value} />
        ))}
      </div>
    </div>
  );
};

GradientBar.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
};

export default GradientBar;
