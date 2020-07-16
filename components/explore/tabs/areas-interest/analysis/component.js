import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

import { getLayerExtraParams } from 'utils/map';
import Icon from 'components/icon';
import { Radio } from 'components/forms';
import { LAYERS } from 'components/map';
import TimeseriesSection from './timeseries-section';
import ChangeSection from './change-section';

import './style.scss';

const Analysis = ({ areasInterest, socLayerState, updateLayer, onClickInfo }) => {
  const typeOptions = useMemo(() => socLayerState.config.settings.type.options, [socLayerState]);

  const onChangeType = useCallback(
    type => {
      // eslint-disable-next-line no-unused-vars
      const { config, ...otherParams } = getLayerExtraParams(
        { ...LAYERS[socLayerState.id], id: socLayerState.id },
        { type }
      );
      updateLayer({ id: socLayerState.id, type, ...otherParams });
    },
    [socLayerState, updateLayer]
  );

  return (
    <div className="c-areas-interest-tab-analysis">
      <div className="static-container">
        <h3 className="mb-4">{areasInterest.name ?? '−'}</h3>
        <header>
          {socLayerState.label}
          <button
            type="button"
            className="btn"
            onClick={() =>
              onClickInfo({
                id: socLayerState.id,
                tab: socLayerState.id === 'soc-stock' ? socLayerState.type : null,
              })
            }
          >
            <Icon name="info" />
          </button>
        </header>
      </div>
      <div className="scrollable-container">
        {socLayerState.id === 'soc-stock' && (
          <div className="soc-stock-switcher mt-2">
            {typeOptions.map(option => (
              <Radio
                key={option.value}
                id={`analysis-soc-stock-${option.value}`}
                name="analysis-soc-stock"
                checked={option.value === socLayerState.type}
                className={option.value === socLayerState.type ? '-checked' : undefined}
                onChange={() => onChangeType(option.value)}
              >
                {option.label}
              </Radio>
            ))}
          </div>
        )}
        {(socLayerState.id !== 'soc-stock' || socLayerState.type === 'recent') && (
          <TimeseriesSection />
        )}
        <ChangeSection />
      </div>
    </div>
  );
};

Analysis.propTypes = {
  areasInterest: PropTypes.object.isRequired,
  socLayerState: PropTypes.object.isRequired,
  updateLayer: PropTypes.func.isRequired,
  onClickInfo: PropTypes.func.isRequired,
};

export default Analysis;
