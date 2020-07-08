import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

import { Switch } from 'components/forms';

const ChangeSection = ({ legendLayers, updateLayer }) => {
  const socLayerGroup = useMemo(
    () => legendLayers.find(layer => layer.id === 'soc-stock' || layer.id === 'soc-experimental'),
    [legendLayers]
  );

  const modeOptions = useMemo(() => {
    const typeOption = socLayerGroup.layers[0].extraParams.config.settings.type.options.find(
      option => option.value === socLayerGroup.layers[0].extraParams.type
    );
    return typeOption.settings.mode.options;
  }, [socLayerGroup]);

  const onChangeMode = useCallback(() => {
    const newMode =
      socLayerGroup.layers[0].extraParams.mode === modeOptions[1].value
        ? modeOptions[0].value
        : modeOptions[1].value;

    updateLayer({ id: socLayerGroup.id, mode: newMode });
  }, [socLayerGroup, modeOptions, updateLayer]);

  return (
    <section>
      <header>
        <h4>{modeOptions[1].label}</h4>
        <Switch
          id="analysis-timeseries-toggle"
          checked={socLayerGroup.layers[0].extraParams.mode === modeOptions[1].value}
          onChange={onChangeMode}
          className="-label-left"
        >
          Display on map
        </Switch>
      </header>
      <div className="alert alert-warning mt-2" role="alert">
        This feature is currently under development.
      </div>
    </section>
  );
};

ChangeSection.propTypes = {
  legendLayers: PropTypes.arrayOf(PropTypes.object).isRequired,
  updateLayer: PropTypes.func.isRequired,
};

export default ChangeSection;
