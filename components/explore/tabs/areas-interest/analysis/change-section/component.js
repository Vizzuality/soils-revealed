import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Label,
  Bar,
  Cell,
  ReferenceLine,
  Tooltip,
  Customized,
} from 'recharts';

import { slugify } from 'utils/functions';
import { Switch } from 'components/forms';
import LoadingSpinner from 'components/loading-spinner';
import HintButton from 'components/hint-button';
import { useChange } from './helpers';

const ChangeSection = ({ socLayerState, boundaries, areaInterest, updateLayer }) => {
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

  const modeOptions = useMemo(() => {
    const typeOption = socLayerState.config.settings.type.options.find(
      option => option.value === socLayerState.type
    );
    return typeOption.settings.mode.options;
  }, [socLayerState]);

  const { data, error } = useChange(
    socLayerState.id,
    typeOption.value,
    boundaries,
    depthIndex,
    areaInterest.id
  );

  const chartData = useMemo(() => {
    if (!data?.length) {
      return [];
    }

    return data;
  }, [data]);

  const onChangeMode = useCallback(() => {
    const newMode =
      socLayerState.mode === modeOptions[1].value ? modeOptions[0].value : modeOptions[1].value;

    updateLayer({ id: socLayerState.id, mode: newMode });
  }, [socLayerState, modeOptions, updateLayer]);

  const onClickDownload = useCallback(() => {
    const blob = new Blob([JSON.stringify({ data }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${slugify(areaInterest.name)}-change-data.json`;
    a.click();
  }, [data, areaInterest]);

  // FIXME: unit for the SOC concentration of the experimental dataset should be different
  const unit = 't C/ha';

  return (
    <section>
      <header>
        <h4>{modeOptions[1].label}</h4>
        <div className="d-flex align-items-center">
          <Switch
            id="analysis-timeseries-toggle"
            checked={socLayerState.mode === modeOptions[1].value}
            onChange={onChangeMode}
            className="-label-left"
          >
            Display on map
          </Switch>
          <HintButton
            icon="download"
            className="ml-3"
            onClick={onClickDownload}
            disabled={!chartData || chartData.length === 0}
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
      {!error && !chartData && (
        <div className="mt-2 text-center">
          <LoadingSpinner transparent inline />
        </div>
      )}
      {!error && chartData?.length === 0 && (
        <div className="py-5 text-center">No data available.</div>
      )}
      <div className="alert alert-warning mt-2" role="alert">
        This feature is currently under development.
      </div>
      {!error && chartData?.length > 0 && (
        <ResponsiveContainer width="100%" aspect={1.3}>
          <BarChart
            data={chartData}
            margin={{ top: 0, right: 0, bottom: 45, left: 0 }}
            barCategoryGap={1}
          >
            <Tooltip
              labelFormatter={value => `${value} ${unit}`}
              formatter={value => [
                value < 0.01 ? '< 0.01' : /** @type {number} */ (value).toFixed(2),
              ]}
            />
            <XAxis dataKey="bin" minTickGap={20} tickMargin={10} axisLine={false} tickLine={false}>
              <Label
                position="insideBottomLeft"
                content={({ viewBox }) => {
                  const LINE_HEIGHT = 16;
                  return (
                    <>
                      <g className="recharts-text recharts-legend">
                        <rect
                          x={viewBox.x + 5}
                          width={12}
                          y={viewBox.y + LINE_HEIGHT + 30}
                          height={12}
                          fill="#ae224a"
                        />
                        <text
                          x={viewBox.x + 22}
                          y={viewBox.y + LINE_HEIGHT + 40}
                          textAnchor="start"
                        >
                          Loss
                        </text>
                        <rect
                          x={viewBox.x + 75}
                          width={12}
                          y={viewBox.y + LINE_HEIGHT + 30}
                          height={12}
                          fill="#31b8a8"
                        />
                        <text
                          x={viewBox.x + 92}
                          y={viewBox.y + LINE_HEIGHT + 40}
                          textAnchor="start"
                        >
                          Gain
                        </text>
                      </g>
                      <g className="recharts-text recharts-label">
                        <text x={viewBox.width} y={viewBox.y + LINE_HEIGHT + 40} textAnchor="end">
                          SOC {socLayerState.id !== 'soc-stock' ? socLayerState.type : `stock`}{' '}
                          change
                        </text>
                        <text
                          x={viewBox.width}
                          y={viewBox.y + LINE_HEIGHT * 2 + 40}
                          textAnchor="end"
                        >
                          ({unit})
                        </text>
                      </g>
                    </>
                  );
                }}
              />
            </XAxis>
            <YAxis
              dataKey="value"
              // Can't be 0 otherwise the axis is not drawn
              width={1}
              axisLine={false}
              tickLine={false}
              tick={false}
            >
              <Label
                position="insideTopRight"
                content={() => {
                  const LINE_HEIGHT = 16;
                  return (
                    <g className="recharts-text recharts-label">
                      <text x={0} y={LINE_HEIGHT} textAnchor="start">
                        (%) of the
                      </text>
                      <text x={0} y={LINE_HEIGHT * 2} textAnchor="start">
                        total area
                      </text>
                    </g>
                  );
                }}
              />
            </YAxis>
            <ReferenceLine x={0} strokeDasharray="5 5" />
            <Customized
              component={({ xAxisMap, yAxisMap }) => {
                const { scale, padding, x, y, width } = xAxisMap[0];
                const { width: yAxisWidth } = yAxisMap[0];

                return (
                  <>
                    {/* The pattern (dots) of the bars */}
                    <defs>
                      <pattern
                        id="change-chart-bar-pattern"
                        patternUnits="userSpaceOnUse"
                        width="5"
                        height="5"
                      >
                        <rect x="0" width="5" y="0" height="5" />
                        <circle cx="2.5" cy="2.5" r="0.7" />
                        <circle cx="0" cy="0" r="0.7" />
                        <circle cx="0" cy="5" r="0.7" />
                        <circle cx="5" cy="0" r="0.7" />
                        <circle cx="5" cy="5" r="0.7" />
                      </pattern>
                    </defs>
                    {/* The green and red bar above the ticks */}
                    <g>
                      <rect
                        x={x + padding.left + yAxisWidth}
                        width={scale(0) + scale.bandwidth() / 2 - x - padding.left - yAxisWidth}
                        y={y + 2}
                        height="4"
                        fill="#ae224a"
                      />
                      <rect
                        x={scale(0) + scale.bandwidth() / 2 + 1}
                        width={width - scale(0) - scale.bandwidth() / 2 - padding.right - 1}
                        y={y + 2}
                        height="4"
                        fill="#31b8a8"
                      />
                    </g>
                  </>
                );
              }}
            />
            <Bar dataKey="value" isAnimationActive={false} unit="%">
              {chartData.map(d => (
                <Cell key={d.bin} fill="url(#change-chart-bar-pattern)" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </section>
  );
};

ChangeSection.propTypes = {
  socLayerState: PropTypes.object.isRequired,
  boundaries: PropTypes.string.isRequired,
  areaInterest: PropTypes.object.isRequired,
  updateLayer: PropTypes.func.isRequired,
};

export default ChangeSection;
