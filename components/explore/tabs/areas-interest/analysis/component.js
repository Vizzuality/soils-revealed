import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/icon';
import { Radio } from 'components/forms';
import TimeseriesSection from './timeseries-section';
import ChangeSection from './change-section';

import './style.scss';

const SOC_STOCK_TYPES = [
  {
    label: 'Historic',
    value: 'historic',
  },
  {
    label: 'Recent',
    value: 'recent',
  },
  {
    label: 'Future',
    value: 'future',
  },
];

const Analysis = ({ areasInterest, legendLayers, updateLayer, onClickInfo }) => {
  const socLayerGroup = useMemo(
    () => legendLayers.find(layer => layer.id === 'soc-stock' || layer.id === 'soc-experimental'),
    [legendLayers]
  );

  const onChangeType = useCallback(
    type => {
      const otherParams = {};
      const layer = socLayerGroup.layers[0];

      if (type === 'historic') {
        otherParams.mode = 'period';
        otherParams.period = Object.keys(layer.extraParams.config.periods)[0];
        otherParams.depth = +Object.keys(layer.extraParams.config.depths)[0];
      } else if (type === 'recent') {
        otherParams.mode = 'timeseries';
        otherParams.year = layer.extraParams.config.years[1];
        otherParams.year1 = layer.extraParams.config.years[0];
        otherParams.year2 = layer.extraParams.config.years[1];
      } else {
        otherParams.mode = 'period';
        otherParams.scenario = `${Object.keys(layer.extraParams.config.scenarios)[0]}`;
        otherParams.year = +Object.keys(layer.extraParams.config.futureYears)[0];
      }

      updateLayer({ id: socLayerGroup.id, type, ...otherParams });
    },
    [socLayerGroup, updateLayer]
  );

  return (
    <div className="c-areas-interest-tab-analysis">
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
                  ? socLayerGroup.layers[0].extraParams?.type ?? 'recent'
                  : null,
            })
          }
        >
          <Icon name="info" />
        </button>
      </header>
      {socLayerGroup.id === 'soc-stock' && (
        <div className="soc-stock-switcher mt-2">
          {SOC_STOCK_TYPES.map(type => (
            <Radio
              key={type.value}
              id={`analysis-soc-stock-${type.value}`}
              name="analysis-soc-stock"
              checked={type.value === socLayerGroup.layers[0].extraParams.type}
              className={
                type.value === socLayerGroup.layers[0].extraParams.type ? '-checked' : undefined
              }
              onChange={() => onChangeType(type.value)}
            >
              {type.label}
            </Radio>
          ))}
        </div>
      )}
      <TimeseriesSection />
      <ChangeSection />
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
