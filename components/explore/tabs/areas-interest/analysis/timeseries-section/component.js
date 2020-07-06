import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, LineChart, XAxis, YAxis, CartesianGrid, Line, Label } from 'recharts';

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

  const data = [
    { year: 1982, value: 42 },
    { year: 1988, value: 45 },
    { year: 1994, value: 47 },
    { year: 2000, value: 50 },
    { year: 2006, value: 43 },
    { year: 2012, value: 41 },
    { year: 2017, value: 45 },
  ];

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
      <ResponsiveContainer width="100%" aspect={1.3}>
        <LineChart data={data} margin={{ top: 0, right: 0, bottom: 45, left: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="5 5" />
          <XAxis dataKey="year" padding={{ left: 20, right: 20 }}>
            <Label
              position="insideBottomLeft"
              content={({ viewBox }) => {
                const LINE_HEIGHT = 16;
                return (
                  <g className="recharts-text recharts-legend">
                    <rect width={100} height={22} x={viewBox.x} y={viewBox.y + LINE_HEIGHT + 35} />
                    <line
                      x1={viewBox.x + 5}
                      x2={viewBox.x + 35}
                      y1={viewBox.y + LINE_HEIGHT + 46}
                      y2={viewBox.y + LINE_HEIGHT + 46}
                      strokeDasharray="5 5"
                    />
                    <text x={viewBox.x + 40} y={viewBox.y + LINE_HEIGHT + 50} textAnchor="start">
                      0-30 cm
                    </text>
                  </g>
                );
              }}
            />
          </XAxis>
          <YAxis dataKey="value" width={70} axisLine={false} tickLine={false}>
            <Label
              position="insideTopRight"
              content={() => {
                const LINE_HEIGHT = 16;
                return (
                  <g className="recharts-text recharts-label">
                    <text x={0} y={LINE_HEIGHT} transform="rotate(-90)" textAnchor="end">
                      Soil Organic Carbon{' '}
                      {socLayerGroup.id !== 'soc-stock'
                        ? socLayerGroup.layers[0].extraParams.type
                        : `stock`}
                    </text>
                    <text x={0} y={LINE_HEIGHT * 2} transform="rotate(-90)" textAnchor="end">
                      (t C/ha)
                    </text>
                  </g>
                );
              }}
            />
          </YAxis>
          <Line dataKey="value" dot={false} strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
};

TimeseriesSection.propTypes = {
  legendLayers: PropTypes.arrayOf(PropTypes.object).isRequired,
  updateLayer: PropTypes.func.isRequired,
};

export default TimeseriesSection;
