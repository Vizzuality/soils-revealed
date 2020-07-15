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
} from 'recharts';

import { Switch } from 'components/forms';
import LoadingSpinner from 'components/loading-spinner';
import { useChange } from './helpers';

const ChangeSection = ({ legendLayers, boundaries, areaInterest, updateLayer }) => {
  const socLayerGroup = useMemo(
    () => legendLayers.find(layer => layer.id === 'soc-stock' || layer.id === 'soc-experimental'),
    [legendLayers]
  );

  const typeOption = useMemo(
    () =>
      socLayerGroup.layers[0].extraParams.config.settings.type.options.find(
        option => option.value === socLayerGroup.layers[0].extraParams.type
      ),
    [socLayerGroup]
  );

  const depthIndex = useMemo(
    () =>
      typeOption.settings.depth.options.findIndex(
        option => option.value === socLayerGroup.layers[0].extraParams.depth
      ),
    [typeOption, socLayerGroup]
  );

  const modeOptions = useMemo(() => {
    const typeOption = socLayerGroup.layers[0].extraParams.config.settings.type.options.find(
      option => option.value === socLayerGroup.layers[0].extraParams.type
    );
    return typeOption.settings.mode.options;
  }, [socLayerGroup]);

  const { data, error } = useChange(
    socLayerGroup.id,
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
        <div className="alert alert-primary mt-2" role="alert">
          No data available.
        </div>
      )}
      <div className="alert alert-warning mt-2" role="alert">
        This feature is currently under development.
      </div>
      {!error && chartData?.length > 0 && (
        <ResponsiveContainer width="100%" aspect={1.3}>
          <BarChart
            data={chartData}
            margin={{ top: 0, right: 0, bottom: 35, left: 0 }}
            barCategoryGap={1}
          >
            <XAxis
              dataKey="bin"
              type="number"
              padding={{ left: 20, right: 20 }}
              axisLine={false}
              tickLine={false}
            >
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
                          y={viewBox.y + LINE_HEIGHT + 20}
                          height={12}
                          fill="#ae224a"
                        />
                        <text
                          x={viewBox.x + 22}
                          y={viewBox.y + LINE_HEIGHT + 30}
                          textAnchor="start"
                        >
                          Loss
                        </text>
                        <rect
                          x={viewBox.x + 75}
                          width={12}
                          y={viewBox.y + LINE_HEIGHT + 20}
                          height={12}
                          fill="#31b8a8"
                        />
                        <text
                          x={viewBox.x + 92}
                          y={viewBox.y + LINE_HEIGHT + 30}
                          textAnchor="start"
                        >
                          Gain
                        </text>
                      </g>
                      <g className="recharts-text recharts-label">
                        <text x={viewBox.width} y={viewBox.y + LINE_HEIGHT + 30} textAnchor="end">
                          SOC{' '}
                          {socLayerGroup.id !== 'soc-stock'
                            ? socLayerGroup.layers[0].extraParams.type
                            : `stock`}{' '}
                          change
                        </text>
                        <text
                          x={viewBox.width}
                          y={viewBox.y + LINE_HEIGHT * 2 + 30}
                          textAnchor="end"
                        >
                          (t C/ha)
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
            <Bar dataKey="value" isAnimationActive={false}>
              {chartData.map(d => (
                <Cell key={d.bin} fill={d.bin > 0 ? '#31b8a8' : '#ae224a'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </section>
  );
};

ChangeSection.propTypes = {
  legendLayers: PropTypes.arrayOf(PropTypes.object).isRequired,
  boundaries: PropTypes.string.isRequired,
  areaInterest: PropTypes.object.isRequired,
  updateLayer: PropTypes.func.isRequired,
};

export default ChangeSection;
