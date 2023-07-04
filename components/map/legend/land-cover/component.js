import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import './style.scss';
import { LAYERS } from 'components/map/constants';
import Checkbox from 'components/forms/checkbox';
import Icon from 'components/icon';

const LandCover = ({ landCoverLayerState, updateLayer }) => {
  const { items } = LAYERS['land-cover'].legend;

  const [classId, setClassId] = useState(null);

  const showDetailedClasses = useMemo(
    () =>
      landCoverLayerState.detailedClasses ??
      landCoverLayerState.config.settings.detailedClasses.default,
    [landCoverLayerState]
  );

  const activeClass = useMemo(() => {
    if (classId === null) {
      return null;
    }

    return LAYERS['land-cover'].legend.items.find(({ id }) => id === classId);
  }, [classId]);

  const onChangeDetailedClasses = useCallback(
    detailedClasses => updateLayer({ id: landCoverLayerState.id, detailedClasses }),
    [landCoverLayerState, updateLayer]
  );

  return (
    <div className="c-map-legend-land-cover">
      <Checkbox
        id="legend-land-cover-detailed-classes"
        checked={showDetailedClasses}
        onChange={visible => {
          onChangeDetailedClasses(visible);
          if (!visible) {
            setClassId(null);
          }
        }}
      >
        {landCoverLayerState.config.settings.detailedClasses.label}
      </Checkbox>

      {!activeClass && (
        <ul className="list">
          {items.map(({ id, name, color, items }) => (
            <li key={id}>
              <div className="color-pill" style={{ background: color }} />
              <div className="item">
                <div className="name">{name}</div>

                {showDetailedClasses && items.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary class-button"
                    aria-label="See breakdown"
                    onClick={() => setClassId(id)}
                  >
                    <Icon name="bottom-arrow" />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {!!activeClass && (
        <>
          <div className="active-class">
            <button
              type="button"
              className="btn btn-sm btn-outline-primary class-button -back"
              aria-label="Go back"
              onClick={() => setClassId(null)}
            >
              <Icon name="bottom-arrow" />
            </button>
            {activeClass.name}
          </div>

          <ul className="list -no-column">
            {activeClass.items.map(({ id, name, color }) => (
              <li key={id}>
                <div className="color-pill" style={{ background: color }} />
                <div className="item">
                  <div className="name">{name}</div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

LandCover.propTypes = {
  landCoverLayerState: PropTypes.object.isRequired,
  updateLayer: PropTypes.func.isRequired,
};

export default LandCover;
