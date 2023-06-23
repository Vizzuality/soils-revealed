import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

const ChangeByLandCoverSectionWidgetTooltip = ({ payload, legendLayers, socLayerState }) => {
  const socLayerGroup = useMemo(
    () => legendLayers.find(layer => layer.id === 'soc-stock' || layer.id === 'soc-experimental'),
    [legendLayers]
  );

  const typeOptions = useMemo(
    () => socLayerGroup.layers[0].extraParams.config.settings.type.options,
    [socLayerGroup]
  );

  const typeOption = useMemo(
    () =>
      socLayerState.config.settings.type.options.find(
        option => option.value === socLayerState.type
      ),
    [socLayerState]
  );

  const year1Option = useMemo(
    () =>
      typeOption.settings.year.options.find(
        option => option.value === `${typeOption.settings.year1?.defaultOption}`
      ),
    [typeOption]
  );

  if (!payload.length) {
    return null;
  }

  return (
    <div className="recharts-default-tooltip">
      <div className="recharts-tooltip-item">
        Land cover{' '}
        {socLayerState.type === 'future'
          ? typeOptions[1].settings.year2.defaultOption
          : year1Option.label}
      </div>
      <ul>
        {payload.map(({ name, value, color }) => (
          <li key={name}>
            <div className="color-pill" style={{ background: color }} />
            <div className="name-value">
              <div>{name}</div>
              <div className="recharts-tooltip-item">{value}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

ChangeByLandCoverSectionWidgetTooltip.propTypes = {
  payload: PropTypes.object.isRequired,
  legendLayers: PropTypes.arrayOf(PropTypes.object).isRequired,
  socLayerState: PropTypes.object.isRequired,
};

export default ChangeByLandCoverSectionWidgetTooltip;
