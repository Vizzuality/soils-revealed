import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

import { Switch } from 'components/forms';
import LegendTitle from 'components/map/legend/title';

const TimeseriesSection = ({ legendLayers, updateLayer }) => {
  const socLayerGroup = useMemo(
    () => legendLayers.find(layer => layer.id === 'soc-stock' || layer.id === 'soc-experimental'),
    [legendLayers]
  );

  const mode = useMemo(() => {
    if (socLayerGroup.id !== 'soc-stock' || socLayerGroup.layers[0].extraParams.type === 'recent') {
      return {
        label: 'Time Series',
        value: 'timeseries',
      };
    }

    return {
      label: 'Period',
      value: 'period',
    };
  }, [socLayerGroup]);

  const onChangeMode = useCallback(() => {
    const newMode = socLayerGroup.layers[0].extraParams.mode === mode.value ? 'change' : mode.value;

    updateLayer({ id: socLayerGroup.id, mode: newMode });
  }, [socLayerGroup, mode, updateLayer]);

  return (
    <section>
      <LegendTitle
        layerGroup={socLayerGroup}
        onChangeParams={(id, params) => updateLayer({ id, ...params })}
      />
      <header className="mt-2">
        <h4>{mode.label}</h4>
        <Switch
          id="analysis-timeseries-toggle"
          checked={socLayerGroup.layers[0].extraParams.mode === mode.value}
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

TimeseriesSection.propTypes = {
  legendLayers: PropTypes.arrayOf(PropTypes.object).isRequired,
  updateLayer: PropTypes.func.isRequired,
};

export default TimeseriesSection;
