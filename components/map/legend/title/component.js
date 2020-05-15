import React from 'react';
import PropTypes from 'prop-types';

import { Dropdown } from 'components/forms';

const SOC_EXPERIMENTAL_OPTIONS = [
  {
    label: 'stock',
    value: 'stock',
  },
  {
    label: 'concentration',
    value: 'concentration',
  },
];

const LegendTitle = ({ layerGroup, onChangeParams }) => {
  const layer = layerGroup.layers[0];

  if (layerGroup.id === 'soc-experimental') {
    return (
      <div className="c-map-legend-title">
        Soil organic carbon
        <Dropdown
          options={SOC_EXPERIMENTAL_OPTIONS}
          value={SOC_EXPERIMENTAL_OPTIONS.find(o => o.value === layer.extraParams.type)}
          onChange={({ value }) => onChangeParams(layerGroup.id, { type: value })}
        />
      </div>
    );
  }

  return layer.name;
};

LegendTitle.propTypes = {
  layerGroup: PropTypes.object.isRequired,
  onChangeParams: PropTypes.func.isRequired,
};

export default LegendTitle;
