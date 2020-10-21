import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { logEvent } from 'utils/analytics';
import { Dropdown } from 'components/forms';

const LegendTitle = ({ layerGroup, onChangeParams }) => {
  const layer = layerGroup.layers[0];

  const onChangeMode = useCallback(
    ({ label, value }) => {
      logEvent('Legend', 'interacts with legend "experimental dataset"', `Clicks on "${label}"`);
      onChangeParams(layerGroup.id, { type: value, depth: 0 });
    },
    [layerGroup, onChangeParams]
  );

  if (layerGroup.id === 'soc-experimental') {
    return (
      <div className="c-map-legend-title">
        Soil organic carbon{' '}
        <Dropdown
          options={layer.extraParams.config.settings.type.options}
          value={layer.extraParams.config.settings.type.options.find(
            o => o.value === layer.extraParams.type
          )}
          onChange={onChangeMode}
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
