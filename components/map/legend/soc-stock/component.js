import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { LegendItemTypes, LegendItemTimeStep } from 'vizzuality-components';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { Select, Radio } from 'components/forms';

import './style.scss';

const TYPES = [
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

const MODES_BY_TYPE = {
  historic: {
    0: { label: 'Period', value: 'period' },
    1: { label: 'Change', value: 'change' },
  },
  recent: {
    0: { label: 'Time Series', value: 'timeseries' },
    1: { label: 'Change', value: 'change' },
  },
  future: {
    0: { label: 'Period', value: 'period' },
    1: { label: 'Change', value: 'change' },
  },
};

const LINEAR_LEGEND = {
  type: 'gradient',
  items: [
    { color: '#E18D67', value: '0' },
    { color: '#CB5A3A', value: '' },
    { color: '#9D4028', value: '100' },
    { color: '#6D2410', value: '' },
    { color: '#380E03', value: '200' },
  ],
};

const DIVERGENY_LEGEND = {
  type: 'gradient',
  items: [
    { color: '#B30200', value: '-80' },
    { color: '#E34A33', value: '' },
    { color: '#FC8D59', value: '' },
    { color: '#FDCC8A', value: '' },
    { color: '#FFFFCC', value: '0' },
    { color: '#A1DAB4', value: '' },
    { color: '#31B3BD', value: '' },
    { color: '#1C9099', value: '' },
    { color: '#066C59', value: '80' },
  ],
};

const SOCStockLegend = ({ layerGroup, onChangeParams }) => {
  const layer = layerGroup.layers[0];

  const yearOptions = useMemo(
    () =>
      Array(layer.extraParams.config.years[1] - layer.extraParams.config.years[0] + 1)
        .fill(null)
        .map((_, index) => ({
          label: `${layer.extraParams.config.years[0] + index}`,
          value: `${layer.extraParams.config.years[0] + index}`,
        })),
    [layer]
  );

  const scenarioOptions = useMemo(
    () =>
      Object.keys(layer.extraParams.config.scenarios).map(key => ({
        label: layer.extraParams.config.scenarios[key],
        value: key,
      })),
    [layer]
  );

  const futureYearOptions = useMemo(
    () =>
      Object.keys(layer.extraParams.config.futureYears).map(key => ({
        label: layer.extraParams.config.futureYears[key],
        value: key,
      })),
    [layer]
  );

  const selectedTypeIndex = useMemo(
    () => TYPES.findIndex(type => type.value === layer.extraParams.type),
    [layer]
  );

  const onChangeType = useCallback(
    index => {
      const type = TYPES[index].value;

      const otherParams = {};
      if (type === 'historic') {
        otherParams.mode = 'period';
        otherParams.period = Object.keys(layer.extraParams.config.periods)[0];
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

      onChangeParams(layerGroup.id, { type, ...otherParams });
    },
    [layer, layerGroup, onChangeParams]
  );

  const selectedModeIndex = useMemo(
    () =>
      +Object.entries(MODES_BY_TYPE[layer.extraParams.type]).find(
        entry => entry[1].value === layer.extraParams.mode
      )[0],
    [layer]
  );

  const onChangeMode = useCallback(
    index =>
      onChangeParams(layerGroup.id, { mode: MODES_BY_TYPE[layer.extraParams.type][index].value }),
    [layer, layerGroup, onChangeParams]
  );

  return (
    <div className="c-map-legend-soc-stock">
      <Tabs className="type-tabs" selectedIndex={selectedTypeIndex} onSelect={onChangeType}>
        <TabList>
          {TYPES.map((type, index) => (
            <Tab key={type.value}>{TYPES[index].label}</Tab>
          ))}
        </TabList>
        <TabPanel>
          <div className="gradient-container">
            <LegendItemTypes
              activeLayer={{
                legendConfig:
                  layer.extraParams.mode === 'period' ? LINEAR_LEGEND : DIVERGENY_LEGEND,
              }}
            />
            <div className="unit">(t C/ha)</div>
          </div>

          <Tabs className="mode-tabs" selectedIndex={selectedModeIndex} onSelect={onChangeMode}>
            <TabList>
              <Tab>{MODES_BY_TYPE[layer.extraParams.type][0].label}</Tab>
              <Tab>{MODES_BY_TYPE[layer.extraParams.type][1].label}</Tab>
              <div className="depth-dropdown">
                Soil depth:
                <span className="d-inline-block ml-1 font-weight-bold">0-200 cm</span>
              </div>
            </TabList>
            <TabPanel>
              {Object.keys(layer.extraParams.config.periods).map(period => (
                <Radio
                  key={period}
                  id={`legend-historic-period-${period}`}
                  className="mr-4"
                  name="legend-historic-period"
                  checked={layer.extraParams.period === period}
                  onChange={() => onChangeParams(layerGroup.id, { period })}
                >
                  {layer.extraParams.config.periods[period]}
                </Radio>
              ))}
            </TabPanel>
            <TabPanel>
              <div className="select d-inline-block mr-4">
                From:
                <span className="d-inline-block ml-1 font-weight-bold">
                  {layer.extraParams.config.periods.historic}
                </span>
              </div>
              <div className="select d-inline-block">
                To:
                <span className="d-inline-block ml-1 font-weight-bold">
                  {layer.extraParams.config.periods.current}
                </span>
              </div>
            </TabPanel>
          </Tabs>
        </TabPanel>
        <TabPanel>
          <div className="gradient-container">
            <LegendItemTypes
              activeLayer={{
                legendConfig:
                  layer.extraParams.mode === 'timeseries' ? LINEAR_LEGEND : DIVERGENY_LEGEND,
              }}
            />
            <div className="unit">(t C/ha)</div>
          </div>

          <Tabs className="mode-tabs" selectedIndex={selectedModeIndex} onSelect={onChangeMode}>
            <TabList>
              <Tab>{MODES_BY_TYPE[layer.extraParams.type][0].label}</Tab>
              <Tab>{MODES_BY_TYPE[layer.extraParams.type][1].label}</Tab>
              <div className="depth-dropdown">
                Soil depth:
                <span className="d-inline-block ml-1 font-weight-bold">0-30 cm</span>
              </div>
            </TabList>
            <TabPanel>
              <LegendItemTimeStep
                activeLayer={{
                  timelineParams: {
                    range: false,
                    interval: 'years',
                    dateFormat: 'YYYY',
                    minDate: `${layer.extraParams.config.years[0]}-01-01`,
                    maxDate: `${layer.extraParams.config.years[1]}-12-31`,
                    startDate: `${layer.extraParams.config.years[0]}-01-01`,
                    endDate: `${layer.extraParams.year}-01-01`,
                    trimEndDate: `${layer.extraParams.config.years[1]}-12-31`,
                  },
                }}
                handleChange={dates =>
                  onChangeParams(layerGroup.id, { year: +dates[1].split('-')[0] })
                }
              />
            </TabPanel>
            <TabPanel>
              <div className="select d-inline-block mr-4">
                <label htmlFor="legend-recent-from">From:</label>
                <Select
                  id="legend-recent-from"
                  className="ml-2"
                  options={yearOptions}
                  value={`${layer.extraParams.year1}`}
                  onChange={({ value }) => onChangeParams(layerGroup.id, { year1: +value })}
                />
              </div>
              <div className="select d-inline-block">
                <label htmlFor="legend-recent-to">To:</label>
                <Select
                  id="legend-recent-to"
                  className="ml-2"
                  options={yearOptions}
                  value={`${layer.extraParams.year2}`}
                  onChange={({ value }) => onChangeParams(layerGroup.id, { year2: +value })}
                />
              </div>
            </TabPanel>
          </Tabs>
        </TabPanel>
        <TabPanel>
          <div className="gradient-container">
            <LegendItemTypes
              activeLayer={{
                legendConfig:
                  layer.extraParams.mode === 'period' ? LINEAR_LEGEND : DIVERGENY_LEGEND,
              }}
            />
            <div className="unit">(t C/ha)</div>
          </div>

          <Tabs className="mode-tabs" selectedIndex={selectedModeIndex} onSelect={onChangeMode}>
            <TabList>
              <Tab>{MODES_BY_TYPE[layer.extraParams.type][0].label}</Tab>
              <Tab>{MODES_BY_TYPE[layer.extraParams.type][1].label}</Tab>
              <div className="depth-dropdown">
                Soil depth:
                <span className="d-inline-block ml-1 font-weight-bold">0-30 cm</span>
              </div>
            </TabList>
            <TabPanel className="react-tabs__tab-panel align-items-end">
              {Object.keys(layer.extraParams.config.futureYears).map(year => (
                <Radio
                  key={year}
                  id={`legend-future-year-${year}`}
                  className="mr-4"
                  name="legend-future-year"
                  checked={layer.extraParams.year === +year}
                  onChange={() => onChangeParams(layerGroup.id, { year: +year })}
                >
                  {layer.extraParams.config.futureYears[year]}
                </Radio>
              ))}
              <div className="select d-flex flex-column ml-auto text-right">
                <label htmlFor="legend-future-scenario">Scenario:</label>
                <Select
                  id="legend-future-scenario"
                  className="mt-1"
                  options={scenarioOptions}
                  value={layer.extraParams.scenario}
                  onChange={({ value }) => onChangeParams(layerGroup.id, { scenario: value })}
                />
              </div>
            </TabPanel>
            <TabPanel className="react-tabs__tab-panel align-items-end">
              <div className="d-flex align-items-center">
                <div className="select d-inline-block mr-4">
                  From:
                  <span className="d-inline-block ml-1 font-weight-bold">
                    {layer.extraParams.config.years[1]}
                  </span>
                </div>
                <div className="select d-inline-block">
                  <label htmlFor="legend-future-to">To:</label>
                  <Select
                    id="legend-future-to"
                    className="ml-2"
                    options={futureYearOptions}
                    value={`${layer.extraParams.year}`}
                    onChange={({ value }) => onChangeParams(layerGroup.id, { year: +value })}
                  />
                </div>
              </div>
              <div className="select d-flex flex-column ml-auto text-right">
                <label htmlFor="legend-future-scenario">Scenario:</label>
                <Select
                  id="legend-future-scenario"
                  className="mt-1"
                  options={scenarioOptions}
                  value={layer.extraParams.scenario}
                  onChange={({ value }) => onChangeParams(layerGroup.id, { scenario: value })}
                />
              </div>
            </TabPanel>
          </Tabs>
        </TabPanel>
      </Tabs>
    </div>
  );
};

SOCStockLegend.propTypes = {
  layerGroup: PropTypes.object.isRequired,
  onChangeParams: PropTypes.func.isRequired,
};

export default SOCStockLegend;
