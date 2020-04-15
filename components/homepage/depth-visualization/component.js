import React, { useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const COMPONENT_MARGIN = '12rem';
const COMPONENT_HEIGHT = `(100vh - ${COMPONENT_MARGIN} * 2)`;
const ITEM_HEIGHT = '0.4375rem';
const OBSERVER_THRESHOLDS = [0.3, 0.6, 0.9];

const DepthVisualization = ({ items }) => {
  const [itemsVisibility, setItemsVisibility] = useState(
    items.map((item, index) => (index === 0 ? 1 : 0))
  );

  const activeItem = useMemo(() => {
    let maxVisibility = 0;
    let maxVisibilityItemIndex = 0;

    itemsVisibility.forEach((visibility, index) => {
      if (visibility > maxVisibility) {
        maxVisibility = visibility;
        maxVisibilityItemIndex = index;
      }
    });

    return items[maxVisibilityItemIndex];
  }, [items, itemsVisibility]);

  const lineHeight = `calc((${COMPONENT_HEIGHT} - ${
    items.length
  } * ${ITEM_HEIGHT}) / ${items.length - 1})`;

  const lineXPosition = `calc(${ITEM_HEIGHT} / 2)`;

  const onChangeItemVisibility = useCallback(
    (itemIndex, [entry]) => {
      const visibility =
        entry.intersectionRatio > OBSERVER_THRESHOLDS[0] ? entry.intersectionRatio : 0;
      setItemsVisibility(previousItemsVisibility => {
        const res = [...previousItemsVisibility];
        res[itemIndex] = visibility;
        return res;
      });
    },
    [setItemsVisibility]
  );

  useEffect(() => {
    const observers = items.map((item, index) => {
      const observer = new IntersectionObserver(entries => onChangeItemVisibility(index, entries), {
        threshold: OBSERVER_THRESHOLDS,
      });

      observer.observe(document.querySelector(`#${item.anchor}`));

      return observer;
    });

    return () => observers.map(observer => observer.disconnect());
  }, [items, onChangeItemVisibility]);

  return (
    <div
      className="c-homepage-depth-visualization"
      style={{ width: ITEM_HEIGHT, top: COMPONENT_MARGIN }}
    >
      {items.map((item, index) => (
        <div
          key={item.anchor}
          className={['item', ...(item.anchor === activeItem.anchor ? ['-active'] : [])].join(' ')}
        >
          <a
            href={`#${item.anchor}`}
            className="rectangle"
            style={{ height: ITEM_HEIGHT, width: ITEM_HEIGHT }}
          >
            <span className="sr-only">
              {item.title}: {item.description}
            </span>
          </a>
          {index !== items.length - 1 && (
            <div className="line" style={{ height: lineHeight, left: lineXPosition }} />
          )}
          <div className="text">
            <div className="title">
              {item.title.split(/\s/)[0]}
              <br />
              {[...item.title.split(/\s/).slice(1)].join(' ')}
            </div>
            <div className="description">
              {item.description.split(/:\s/)[0]}:
              <br />
              {item.description.split(/:\s/)[1]}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

DepthVisualization.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      anchor: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default DepthVisualization;
