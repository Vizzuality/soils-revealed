import React from 'react';
import PropTypes from 'prop-types';

import { Dropdown } from 'components/forms';

const LegendTitle = ({ layerGroup, onChangeParams }) => {
  const layer = layerGroup.layers[0];

  if (layerGroup.id === 'soc-experimental') {
    return (
      <div className="c-map-legend-title">
        Soil organic carbon{' '}
        <Dropdown
          options={layer.extraParams.config.settings.type.options}
          value={layer.extraParams.config.settings.type.options.find(
            o => o.value === layer.extraParams.type
          )}
          onChange={({ value }) => onChangeParams(layerGroup.id, { type: value, depth: 0 })}
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
