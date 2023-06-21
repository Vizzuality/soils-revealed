import React, { useMemo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
  Label,
  Tooltip,
} from 'recharts';
import min from 'lodash/min';
import max from 'lodash/max';

import { logEvent } from 'utils/analytics';
import { slugify, getValuePrefixAndPow, getHumanReadableValue } from 'utils/functions';
import { Switch, Dropdown } from 'components/forms';
import LoadingSpinner from 'components/loading-spinner';
import HintButton from 'components/hint-button';
import NoDataMessage from 'components/explore/no-data-message';
import { LAYERS } from 'components/map';
import Checkbox from 'components/forms/checkbox';
import WidgetTooltip from './widget-tooltip';

const Y_AXIS_WIDTH = 90;

const ChangeByLandCoverSection = ({
  data,
  loading,
  error,
  legendLayers,
  socLayerState,
  areaInterest,
  compareAreaInterest,
  updateLayer,
  removeLayer,
  addLayer,
}) => {
  // TODO: move to the Redux state to synchonize with the legend
  const [showDetailedClasses, setShowDetailedClasses] = useState(false);

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

  const landCoverActive = useMemo(() => legendLayers.some(layer => layer.id === 'land-cover'), [
    legendLayers,
  ]);

  const [unitPrefix, unitPow] = useMemo(() => {
    if (!error && !loading && data?.length > 0) {
      const minValue = min(data.map(item => Object.values(item.breakdown)).flat());
      const maxValue = max(data.map(item => Object.values(item.breakdown)).flat());
      const maxAbsValue = max([Math.abs(minValue), maxValue]);
      return getValuePrefixAndPow(maxAbsValue);
    }

    return getValuePrefixAndPow(0);
  }, [error, loading, data]);

  const onToggleLandCover = useCallback(() => {
    if (landCoverActive) {
      removeLayer('land-cover');
    } else {
      addLayer('land-cover');
    }
  }, [landCoverActive, removeLayer, addLayer]);

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

  return (
    <section className="change-by-land-cover-section">
      <header className="mt-2 align-items-start">
        <h4>Change by land cover</h4>
        <div className="d-flex align-items-end flex-column-reverse pt-2">
          <Switch
            id="analysis-change-by-land-cover-toggle"
            checked={landCoverActive}
            onChange={onToggleLandCover}
            className="-label-left"
          >
            Display on map
          </Switch>
          <HintButton
            icon="download"
            className="ml-3 mb-2"
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
            Soil organic carbon change by land cover from{' '}
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
          <Checkbox
            id="land-cover-detailed-classes"
            checked={showDetailedClasses}
            onChange={setShowDetailedClasses}
          >
            Detailed land cover classes
          </Checkbox>
          <ResponsiveContainer width="100%" aspect={0.9}>
            <BarChart
              data={data}
              margin={{ top: 50, right: 0, bottom: 45, left: 0 }}
              layout="vertical"
              stackOffset="sign"
              barCategoryGap={'25%'}
            >
              <Tooltip
                allowEscapeViewBox={{ x: false, y: true }}
                offset={20}
                content={({ payload }) => (
                  <WidgetTooltip
                    payload={payload}
                    detailedClasses={showDetailedClasses}
                    unitPow={unitPow}
                    unitPrefix={unitPrefix}
                  />
                )}
              />
              <CartesianGrid horizontal={false} strokeDasharray="5 5" />
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                tickFormatter={value => {
                  // The value we receive is in tons, so we need to multiply it by 10⁶
                  const formattedValue = getHumanReadableValue(
                    (value * Math.pow(10, 6)) / Math.pow(10, unitPow)
                  );

                  return value === 0 ? 0 : `${formattedValue}${unitPrefix}`;
                }}
              >
                <Label
                  position="insideBottomLeft"
                  content={({ viewBox }) => {
                    const LINE_HEIGHT = 16;
                    return (
                      <g className="recharts-text recharts-label">
                        <text
                          x={viewBox.width + Y_AXIS_WIDTH}
                          y={viewBox.y + LINE_HEIGHT + 40}
                          textAnchor="end"
                        >
                          SOC {socLayerState.id !== 'soc-stock' ? socLayerState.type : `stock`}
                        </text>
                        <text
                          x={viewBox.width + Y_AXIS_WIDTH}
                          y={viewBox.y + LINE_HEIGHT * 2 + 40}
                          textAnchor="end"
                        >
                          (g C)
                        </text>
                      </g>
                    );
                  }}
                />
              </XAxis>
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                interval={0}
                width={Y_AXIS_WIDTH}
                // Don't set `allowDuplicatedCategory={false}` as we loose the tooltip's payload
              >
                <Label
                  position="insideTopRight"
                  content={() => {
                    const LINE_HEIGHT = 16;
                    return (
                      <g className="recharts-text recharts-label">
                        <text x={Y_AXIS_WIDTH - 8} y={LINE_HEIGHT} textAnchor="end">
                          Land cover
                        </text>
                        <text x={Y_AXIS_WIDTH - 8} y={LINE_HEIGHT * 2} textAnchor="end">
                          2018
                        </text>
                      </g>
                    );
                  }}
                />
              </YAxis>

              {!showDetailedClasses &&
                LAYERS['land-cover'].legend.items.map(({ id, name, color }) => (
                  <Bar
                    key={id}
                    dataKey={`breakdown.${id}`}
                    name={name}
                    fill={color}
                    stackId="stack"
                    isAnimationActive={false}
                  />
                ))}

              {showDetailedClasses &&
                LAYERS['land-cover'].legend.items
                  .map(item => item.items)
                  .flat()
                  .map(({ id, name, color }) => (
                    <Bar
                      key={id}
                      dataKey={`detailedBreakdown.${id}`}
                      name={name}
                      fill={color}
                      stackId="stack"
                      isAnimationActive={false}
                    />
                  ))}
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </section>
  );
};

ChangeByLandCoverSection.propTypes = {
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
  removeLayer: PropTypes.func.isRequired,
  addLayer: PropTypes.func.isRequired,
};

ChangeByLandCoverSection.defaultProps = {
  data: null,
  loading: false,
  error: false,
  compareAreaInterest: null,
};

export default ChangeByLandCoverSection;
