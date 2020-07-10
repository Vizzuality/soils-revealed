import React, { useMemo, useCallback, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, LineChart, XAxis, YAxis, CartesianGrid, Line, Label } from 'recharts';

import { Switch } from 'components/forms';
import LoadingSpinner from 'components/loading-spinner';
import LegendTitle from 'components/map/legend/title';
import { BOUNDARIES } from 'components/map';
import { fetchChartData } from './helpers';

const dataReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return { ...state, loading: true, error: false, refetch: false };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        error: false,
        data: action.payload,
      };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: true };

    default:
      return state;
  }
};

const TimeseriesSection = ({ legendLayers, boundaries, areaInterest, updateLayer }) => {
  /**
   * @type {[any, (action: any) => void]}
   */
  const [dataState, dataDispatch] = useReducer(dataReducer, {
    loading: true,
    error: false,
    data: null,
  });

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

  const modeOptions = useMemo(() => {
    return typeOption.settings.mode.options;
  }, [typeOption]);

  const onChangeMode = useCallback(() => {
    const newMode =
      socLayerGroup.layers[0].extraParams.mode === modeOptions[0].value
        ? modeOptions[1].value
        : modeOptions[0].value;

    updateLayer({ id: socLayerGroup.id, mode: newMode });
  }, [socLayerGroup, modeOptions, updateLayer]);

  useEffect(() => {
    dataDispatch({ type: 'FETCH_INIT' });

    fetchChartData({
      table: BOUNDARIES[boundaries].table,
      geoId: BOUNDARIES[boundaries].geoId,
      areaInterest,
      depth: typeOption.settings.depth.options.find(
        option => option.value === socLayerGroup.layers[0].extraParams.depth
      ),
      variable:
        socLayerGroup.id === 'soc-stock' || socLayerGroup.layers[0].extraParams.type === 'stock'
          ? 'stocks'
          : 'concentration',
      group:
        socLayerGroup.id === 'soc-stock'
          ? socLayerGroup.layers[0].extraParams.type
          : 'experimental_dataset',
    })
      .then(data => dataDispatch({ type: 'FETCH_SUCCESS', payload: data }))
      .catch(() => dataDispatch({ type: 'FETCH_FAILURE' }));
  }, [boundaries, areaInterest, typeOption, socLayerGroup]);

  return (
    <section>
      <LegendTitle
        layerGroup={socLayerGroup}
        onChangeParams={(id, params) => updateLayer({ id, ...params })}
      />
      <header className="mt-2">
        <h4>{modeOptions[0].label}</h4>
        <Switch
          id="analysis-timeseries-toggle"
          checked={socLayerGroup.layers[0].extraParams.mode === modeOptions[0].value}
          onChange={onChangeMode}
          className="-label-left"
        >
          Display on map
        </Switch>
      </header>
      <div className="alert alert-warning mt-2" role="alert">
        This feature is currently under development.
      </div>
      {!!dataState.error && (
        <div className="alert alert-danger mt-2" role="alert">
          Unable to fetch the data.
        </div>
      )}
      {!dataState.error && dataState.loading && (!dataState.data || dataState.data.length === 0) && (
        <div className="mt-2 text-center">
          <LoadingSpinner transparent inline />
        </div>
      )}
      {!dataState.error && !dataState.loading && (!dataState.data || dataState.data.length === 0) && (
        <div className="alert alert-primary mt-2" role="alert">
          No data available.
        </div>
      )}
      {!dataState.error && dataState.data?.length > 0 && (
        <ResponsiveContainer width="100%" aspect={1.3}>
          <LineChart data={dataState.data} margin={{ top: 0, right: 0, bottom: 45, left: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="5 5" />
            <XAxis dataKey="year" padding={{ left: 20, right: 20 }}>
              <Label
                position="insideBottomLeft"
                content={({ viewBox }) => {
                  const LINE_HEIGHT = 16;
                  return (
                    <g className="recharts-text recharts-legend">
                      <rect
                        width={100}
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
            <Line dataKey="value" dot={false} strokeDasharray="5 5" isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </section>
  );
};

TimeseriesSection.propTypes = {
  legendLayers: PropTypes.arrayOf(PropTypes.object).isRequired,
  boundaries: PropTypes.string.isRequired,
  areaInterest: PropTypes.object.isRequired,
  updateLayer: PropTypes.func.isRequired,
};

export default TimeseriesSection;
