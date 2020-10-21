import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  Label,
  Tooltip,
} from 'recharts';

import { logEvent } from 'utils/analytics';
import { slugify, truncate, getFormattedValue } from 'utils/functions';
import { Switch, Dropdown } from 'components/forms';
import LoadingSpinner from 'components/loading-spinner';
import HintButton from 'components/hint-button';
import NoDataMessage from 'components/explore/no-data-message';

const TimeseriesSection = ({
  data,
  loading,
  error,
  legendLayers,
  socLayerState,
  areaInterest,
  compareAreaInterest,
  updateLayer,
}) => {
  const socLayerGroup = useMemo(
    () => legendLayers.find(layer => layer.id === 'soc-stock' || layer.id === 'soc-experimental'),
    [legendLayers]
  );

  const typeOptions = useMemo(
    () => socLayerGroup.layers[0].extraParams.config.settings.type.options,
    [socLayerGroup]
  );

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

  const depthOption = useMemo(() => typeOption.settings.depth.options[depthIndex], [
    typeOption,
    depthIndex,
  ]);

  const modeOptions = useMemo(() => {
    return typeOption.settings.mode.options;
  }, [typeOption]);

  const year1Option = useMemo(
    () =>
      typeOption.settings.year.options.find(
        option => option.value === `${typeOption.settings.year1?.defaultOption}`
      ),
    [typeOption]
  );

  const year2Option = useMemo(
    () =>
      typeOption.settings.year.options.find(
        option => option.value === `${typeOption.settings.year2?.defaultOption}`
      ),
    [typeOption]
  );

  const onChangeMode = useCallback(() => {
    const newMode =
      socLayerState.mode === modeOptions[0].value ? modeOptions[1].value : modeOptions[0].value;

    updateLayer({ id: socLayerState.id, mode: newMode });
  }, [socLayerState, modeOptions, updateLayer]);

  const onChangeDepth = useCallback(
    ({ value }) => updateLayer({ id: socLayerState.id, depth: value }),
    [socLayerState, updateLayer]
  );

  const onClickDownload = useCallback(() => {
    logEvent('Areas of interest', 'download data', 'download time series data');

    const blob = new Blob([JSON.stringify({ data }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${slugify(areaInterest.name)}-${
      compareAreaInterest ? `${slugify(compareAreaInterest.name)}-` : ''
    }timeseries-data.json`;
    a.click();
  }, [data, areaInterest, compareAreaInterest]);

  const { unit } = getFormattedValue(
    0,
    socLayerState.id,
    socLayerState.type,
    'analysis-timeseries'
  );

  return (
    <section>
      <header className="mt-2">
        <h4>Time Series</h4>
        <div className="d-flex align-items-center">
          <Switch
            id="analysis-timeseries-toggle"
            checked={socLayerState.mode === modeOptions[0].value}
            onChange={onChangeMode}
            className="-label-left"
          >
            Display on map
          </Switch>
          <HintButton
            icon="download"
            className="ml-3"
            onClick={onClickDownload}
            disabled={!data || data.length === 0}
          >
            Download data
          </HintButton>
        </div>
      </header>
      {!!error && (
        <div className="alert alert-danger mt-2" role="alert">
          Unable to fetch the data.
        </div>
      )}
      {loading && (
        <div className="mt-2 text-center">
          <LoadingSpinner transparent inline />
        </div>
      )}
      {!error && !loading && (!data || data.length === 0) && <NoDataMessage />}
      {!error && !loading && data?.length > 0 && (
        <>
          <div className="chart-intro">
            Soil organic carbon from{' '}
            <strong>
              {socLayerState.type === 'future'
                ? typeOptions[1].settings.year2.defaultOption
                : year1Option.label}
            </strong>{' '}
            to{' '}
            <strong>
              {socLayerState.type === 'future'
                ? typeOptions[2].settings.year.options[
                    typeOptions[2].settings.year.options.length - 1
                  ].label
                : year2Option.label}
            </strong>
            <br />
            at{' '}
            {typeOption.settings.depth.options.length > 1 && (
              <Dropdown
                options={typeOption.settings.depth.options}
                value={depthOption}
                onChange={onChangeDepth}
              />
            )}
            {typeOption.settings.depth.options.length <= 1 && <strong>{depthOption.label}</strong>}.
          </div>
          <ResponsiveContainer width="100%" aspect={1.3}>
            <LineChart data={data} margin={{ top: 0, right: 0, bottom: 45, left: 0 }}>
              <Tooltip
                formatter={value => {
                  const { value: res } = getFormattedValue(
                    /** @type {number} */ (value),
                    socLayerState.id,
                    socLayerState.type,
                    'analysis-timeseries'
                  );

                  return [res];
                }}
              />
              <CartesianGrid vertical={false} strokeDasharray="5 5" />
              <XAxis dataKey="year" padding={{ left: 20, right: 20 }}>
                <Label
                  position="insideBottomLeft"
                  content={({ viewBox }) => {
                    const LINE_HEIGHT = 16;

                    const areaInterestName = truncate(areaInterest.name ?? '−', 12);
                    const compareAreaInterestName = compareAreaInterest
                      ? truncate(compareAreaInterest.name ?? '−', 12)
                      : null;

                    return (
                      <g className="recharts-text recharts-legend">
                        {!compareAreaInterest && (
                          <>
                            <line
                              x1={viewBox.x + 5}
                              x2={viewBox.x + 35}
                              y1={viewBox.y + LINE_HEIGHT + 46}
                              y2={viewBox.y + LINE_HEIGHT + 46}
                            />
                            <text
                              x={viewBox.x + 40}
                              y={viewBox.y + LINE_HEIGHT + 50}
                              textAnchor="start"
                            >
                              {depthOption.label}
                            </text>
                          </>
                        )}
                        {!!compareAreaInterest && (
                          <>
                            <line
                              x1={viewBox.x}
                              x2={viewBox.x + 30}
                              y1={viewBox.y + LINE_HEIGHT + 46}
                              y2={viewBox.y + LINE_HEIGHT + 46}
                            />
                            <text
                              x={viewBox.x + 35}
                              y={viewBox.y + LINE_HEIGHT + 50}
                              textAnchor="start"
                            >
                              <title>{areaInterest.name ?? '−'}</title>
                              {areaInterestName}
                            </text>
                            <line
                              x1={viewBox.x + 35 + areaInterestName.length * 10}
                              x2={viewBox.x + 35 + areaInterestName.length * 10 + 30}
                              y1={viewBox.y + LINE_HEIGHT + 46}
                              y2={viewBox.y + LINE_HEIGHT + 46}
                              strokeDasharray="5 5"
                            />
                            <text
                              x={viewBox.x + 2 * 35 + areaInterestName.length * 10}
                              y={viewBox.y + LINE_HEIGHT + 50}
                              textAnchor="start"
                            >
                              <title>{compareAreaInterest.name ?? '−'}</title>
                              {compareAreaInterestName}
                            </text>
                          </>
                        )}
                      </g>
                    );
                  }}
                />
              </XAxis>
              <YAxis
                width={90}
                axisLine={false}
                tickLine={false}
                domain={[dataMin => Math.floor(dataMin - 1), dataMax => Math.ceil(dataMax + 1)]}
                allowDecimals={false}
                tickFormatter={value => {
                  const { value: res } = getFormattedValue(
                    /** @type {number} */ (value),
                    socLayerState.id,
                    socLayerState.type,
                    'analysis-timeseries'
                  );

                  return res;
                }}
              >
                <Label
                  position="insideTopRight"
                  content={() => {
                    const LINE_HEIGHT = 16;
                    return (
                      <g className="recharts-text recharts-label">
                        <text x={0} y={LINE_HEIGHT} transform="rotate(-90)" textAnchor="end">
                          SOC {socLayerState.id !== 'soc-stock' ? socLayerState.type : `stock`}
                        </text>
                        <text x={0} y={LINE_HEIGHT * 2} transform="rotate(-90)" textAnchor="end">
                          ({unit})
                        </text>
                      </g>
                    );
                  }}
                />
              </YAxis>
              <Line dataKey="value" dot={false} isAnimationActive={false} unit={` ${unit}`} />
              {compareAreaInterest && (
                <Line
                  dataKey="compareValue"
                  dot={false}
                  strokeDasharray="5 5"
                  isAnimationActive={false}
                  unit={` ${unit}`}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </section>
  );
};

TimeseriesSection.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired,
      compareValue: PropTypes.number,
    })
  ),
  loading: PropTypes.bool,
  error: PropTypes.bool,
  legendLayers: PropTypes.arrayOf(PropTypes.object).isRequired,
  socLayerState: PropTypes.object.isRequired,
  areaInterest: PropTypes.object.isRequired,
  compareAreaInterest: PropTypes.object,
  updateLayer: PropTypes.func.isRequired,
};

TimeseriesSection.defaultProps = {
  data: null,
  loading: false,
  error: false,
  compareAreaInterest: null,
};

export default TimeseriesSection;
