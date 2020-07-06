import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

import { Switch } from 'components/forms';

const ChangeSection = ({ legendLayers, updateLayer }) => {
  const socLayerGroup = useMemo(
    () => legendLayers.find(layer => layer.id === 'soc-stock' || layer.id === 'soc-experimental'),
    [legendLayers]
  );

  const otherMode = useMemo(() => {
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
    const newMode =
      socLayerGroup.layers[0].extraParams.mode === 'change' ? otherMode.value : 'change';

    updateLayer({ id: socLayerGroup.id, mode: newMode });
  }, [socLayerGroup, otherMode, updateLayer]);

  return (
    <section>
      <header>
        <h4>Change</h4>
        <Switch
          id="analysis-timeseries-toggle"
          checked={socLayerGroup.layers[0].extraParams.mode === 'change'}
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
