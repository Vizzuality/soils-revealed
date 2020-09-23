import React, { useMemo, useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { getLayerExtraParams } from 'utils/map';
import Icon from 'components/icon';
import { Radio } from 'components/forms';
import { LAYERS } from 'components/map/constants';
import Tooltip from 'components/tooltip';
import Compare from './compare';
import TimeseriesSection from './timeseries-section';
import ChangeSection from './change-section';
import RankingSection from './ranking-section';
import { useChartsData } from './helpers';

import './style.scss';

const Analysis = ({
  areaInterest,
  compareAreaInterest,
  socLayerState,
  boundaries,
  updateLayer,
  onClickInfo,
  onChangeVisibilityCloseBtn,
  updateCompareAreaInterest,
  swapAndResetAreaInterest,
}) => {
  const [compareTooltipOpen, setCompareTooltipOpen] = useState(false);

  const typeOptions = useMemo(() => socLayerState.config.settings.type.options, [socLayerState]);

  const typeOption = useMemo(
    () =>
      socLayerState.config.settings.type.options.find(
        option => option.value === socLayerState.type
      ),
    [socLayerState]
  );

  const depthIndex = useMemo(
    () =>
      typeOption.settings.depth.options.findIndex(option => option.value === socLayerState.depth),
    [typeOption, socLayerState]
  );

  const { data, error } = useChartsData(
    socLayerState.id,
    typeOption.value,
    boundaries.id,
    depthIndex,
    areaInterest,
    compareAreaInterest,
    socLayerState.scenario
  );

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

  const onClickCompare = useCallback(() => {
    const tooltipOpen = !compareTooltipOpen;
    setCompareTooltipOpen(tooltipOpen);
    onChangeVisibilityCloseBtn(!tooltipOpen);
  }, [compareTooltipOpen, setCompareTooltipOpen, onChangeVisibilityCloseBtn]);

  const onCloseCompare = useCallback(() => {
    setCompareTooltipOpen(false);
    onChangeVisibilityCloseBtn(true);
  }, [setCompareTooltipOpen, onChangeVisibilityCloseBtn]);

  const onRemoveAreaInterest = useCallback(() => swapAndResetAreaInterest(), [
    swapAndResetAreaInterest,
  ]);

  const onRemoveCompareAreaInterest = useCallback(() => updateCompareAreaInterest(null), [
    updateCompareAreaInterest,
  ]);

  useEffect(() => {
    if (compareAreaInterest) {
      setCompareTooltipOpen(false);
      onChangeVisibilityCloseBtn(true);
    }
  }, [compareAreaInterest, setCompareTooltipOpen, onChangeVisibilityCloseBtn]);

  return (
    <div className="c-areas-interest-tab-analysis">
      <div className="static-container">
        <div className="d-flex justify-content-between align-items-start">
          {!compareAreaInterest && <h3 className="mb-4">{areaInterest.name ?? '−'}</h3>}
          {!!compareAreaInterest && (
            <h3 className="mb-4">
              <div>
                {areaInterest.name ?? '−'}
                <button
                  type="button"
                  className="ml-3 align-baseline btn btn-sm btn-light"
                  onClick={onRemoveAreaInterest}
                >
                  Remove
                </button>
              </div>
              <div className="mt-2">
                {compareAreaInterest.name ?? '−'}
                <button
                  type="button"
                  className="ml-3 align-baseline btn btn-sm btn-light"
                  onClick={onRemoveCompareAreaInterest}
                >
                  Remove
                </button>
              </div>
            </h3>
          )}
          {!compareAreaInterest && (
            <Tooltip
              trigger="manual"
              placement="right-start"
              visible={compareTooltipOpen}
              hideOnClick={false}
              appendTo={() => document.body}
              popperOptions={{
                modifiers: {
                  flip: { enabled: false },
                  preventOverflow: { boundariesElement: 'viewport' },
                },
              }}
              offset="-24 30"
              duration={0}
              content={<Compare onClose={onCloseCompare} />}
            >
              <button
                type="button"
                className="d-shrink-0 ml-4 btn btn-sm btn-primary"
                onClick={onClickCompare}
              >
                Compare
              </button>
            </Tooltip>
          )}
        </div>
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
      </div>
      <div className="scrollable-container">
        <ChangeSection data={data?.change} error={!!error} />
        {(socLayerState.id !== 'soc-stock' ||
          socLayerState.type === 'recent' ||
          socLayerState.type === 'future') && (
          <TimeseriesSection data={data?.timeseries} error={!!error} />
        )}
        {areaInterest.level === 0 && !compareAreaInterest && <RankingSection />}
      </div>
    </div>
  );
};

Analysis.propTypes = {
  areaInterest: PropTypes.object.isRequired,
  compareAreaInterest: PropTypes.object,
  socLayerState: PropTypes.object.isRequired,
  boundaries: PropTypes.object.isRequired,
  updateLayer: PropTypes.func.isRequired,
  onClickInfo: PropTypes.func.isRequired,
  onChangeVisibilityCloseBtn: PropTypes.func.isRequired,
  updateCompareAreaInterest: PropTypes.func.isRequired,
  swapAndResetAreaInterest: PropTypes.func.isRequired,
};

Analysis.defaultProps = {
  compareAreaInterest: null,
};

export default Analysis;
