import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

import { getLayerExtraParams } from 'utils/map';
import Icon from 'components/icon';
import { Radio } from 'components/forms';
import { LAYERS } from 'components/map';
import TimeseriesSection from './timeseries-section';
import ChangeSection from './change-section';

import './style.scss';

const Analysis = ({ areasInterest, legendLayers, updateLayer, onClickInfo }) => {
  const socLayerGroup = useMemo(
    () => legendLayers.find(layer => layer.id === 'soc-stock' || layer.id === 'soc-experimental'),
    [legendLayers]
  );

  const typeOptions = useMemo(
    () => socLayerGroup.layers[0].extraParams.config.settings.type.options,
    [socLayerGroup]
  );

  const onChangeType = useCallback(
    type => {
      // eslint-disable-next-line no-unused-vars
      const { config, ...otherParams } = getLayerExtraParams(
        { ...LAYERS[socLayerGroup.id], id: socLayerGroup.id },
        { type }
      );
      updateLayer({ id: socLayerGroup.id, type, ...otherParams });
    },
    [socLayerGroup, updateLayer]
  );

  return (
    <div className="c-areas-interest-tab-analysis">
      <div className="static-container">
        <h3 className="mb-4">{areasInterest.name ?? '−'}</h3>
        <header>
          {socLayerGroup.layers[0].name}
          <button
            type="button"
            className="btn"
            onClick={() =>
              onClickInfo({
                id: socLayerGroup.id,
                tab:
                  socLayerGroup.id === 'soc-stock'
                    ? socLayerGroup.layers[0].extraParams.type
                    : null,
              })
            }
          >
            <Icon name="info" />
          </button>
        </header>
      </div>
      <div className="scrollable-container">
        {socLayerGroup.id === 'soc-stock' && (
          <div className="soc-stock-switcher mt-2">
            {typeOptions.map(option => (
              <Radio
                key={option.value}
                id={`analysis-soc-stock-${option.value}`}
                name="analysis-soc-stock"
                checked={option.value === socLayerGroup.layers[0].extraParams.type}
                className={
                  option.value === socLayerGroup.layers[0].extraParams.type ? '-checked' : undefined
                }
                onChange={() => onChangeType(option.value)}
              >
                {option.label}
              </Radio>
            ))}
          </div>
        )}
        {(socLayerGroup.id !== 'soc-stock' ||
          socLayerGroup.layers[0].extraParams.type === 'recent') && <TimeseriesSection />}
        <ChangeSection />
      </div>
    </div>
  );
};

Analysis.propTypes = {
  areasInterest: PropTypes.object.isRequired,
  legendLayers: PropTypes.arrayOf(PropTypes.object).isRequired,
  updateLayer: PropTypes.func.isRequired,
  onClickInfo: PropTypes.func.isRequired,
};

export default Analysis;
