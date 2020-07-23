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

import { slugify, truncate } from 'utils/functions';
import { Switch, Dropdown } from 'components/forms';
import LoadingSpinner from 'components/loading-spinner';
import HintButton from 'components/hint-button';
import LegendTitle from 'components/map/legend/title';
import { useTimeseries } from './helpers';

const TimeseriesSection = ({
  legendLayers,
  socLayerState,
  boundaries,
  areaInterest,
  compareAreaInterest,
  updateLayer,
}) => {
  const socLayerGroup = useMemo(
    () => legendLayers.find(layer => layer.id === 'soc-stock' || layer.id === 'soc-experimental'),
    [legendLayers]
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
        option => option.value === `${typeOption.settings.year1.defaultOption}`
      ),
    [typeOption]
  );

  const year2Option = useMemo(
    () =>
      typeOption.settings.year.options.find(
        option => option.value === `${typeOption.settings.year2.defaultOption}`
      ),
    [typeOption]
  );

  const { data, error } = useTimeseries(
    socLayerState.id,
    typeOption.value,
    boundaries,
    depthIndex,
    areaInterest.id,
    compareAreaInterest?.id
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
    const blob = new Blob([JSON.stringify({ data }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${slugify(areaInterest.name)}-timeseries-data.json`;
    a.click();
  }, [data, areaInterest]);

  const unit =
    socLayerState.id === 'soc-experimental' && socLayerState.type === 'concentration'
      ? 'g C/kg'
      : 't C/ha';

  return (
    <section>
      <LegendTitle
        layerGroup={socLayerGroup}
        onChangeParams={(id, params) => updateLayer({ id, ...params })}
      />
      <header className="mt-2">
        <h4>{modeOptions[0].label}</h4>
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
      {!error && !data && (
        <div className="mt-2 text-center">
          <LoadingSpinner transparent inline />
        </div>
      )}
      {!error && data?.length === 0 && <div className="py-5 text-center">No data available.</div>}
      {!error && data?.length > 0 && (
        <>
          <div className="chart-intro">
            Soil organic carbon from <strong>{year1Option.label}</strong> to{' '}
            <strong>{year2Option.label}</strong>
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
          <ResponsiveContainer
            width="100%"
            aspect={1.3}
            className={compareAreaInterest ? '-compare' : undefined}
          >
            <LineChart data={data} margin={{ top: 0, right: 0, bottom: 45, left: 0 }}>
              <Tooltip
                formatter={value => [
                  value < 0.01 ? '< 0.01' : /** @type {number} */ (value).toFixed(2),
                ]}
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
                            <rect
                              className="background"
                              width={47 + depthOption.label.length * 7}
                              height={22}
                              x={viewBox.x}
                              y={viewBox.y + LINE_HEIGHT + 35}
                            />
                            <line
                              x1={viewBox.x + 5}
                              x2={viewBox.x + 35}
                              y1={viewBox.y + LINE_HEIGHT + 46}
                              y2={viewBox.y + LINE_HEIGHT + 46}
                              strokeDasharray="5 5"
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
                              strokeDasharray="5 5"
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
                domain={['auto', 'auto']}
                tickFormatter={value => value.toFixed(2)}
              >
                <Label
                  position="insideTopRight"
                  content={() => {
                    const LINE_HEIGHT = 16;
                    return (
                      <g className="recharts-text recharts-label">
                        <text x={0} y={LINE_HEIGHT} transform="rotate(-90)" textAnchor="end">
                          Soil Organic Carbon{' '}
                          {socLayerState.id !== 'soc-stock' ? socLayerState.type : `stock`}
                        </text>
                        <text x={0} y={LINE_HEIGHT * 2} transform="rotate(-90)" textAnchor="end">
                          ({unit})
                        </text>
                      </g>
                    );
                  }}
                />
              </YAxis>
              <Line
                dataKey="value"
                dot={false}
                strokeDasharray="5 5"
                isAnimationActive={false}
                unit={` ${unit}`}
              />
              {compareAreaInterest && (
                <Line
                  dataKey="compareValue"
                  dot={false}
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
  legendLayers: PropTypes.arrayOf(PropTypes.object).isRequired,
  socLayerState: PropTypes.object.isRequired,
  boundaries: PropTypes.string.isRequired,
  areaInterest: PropTypes.object.isRequired,
  compareAreaInterest: PropTypes.object,
  updateLayer: PropTypes.func.isRequired,
};

TimeseriesSection.defaultProps = {
  compareAreaInterest: null,
};

export default TimeseriesSection;
