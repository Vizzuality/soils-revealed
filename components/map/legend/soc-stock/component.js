import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { LegendItemTypes, LegendItemTimeStep } from 'vizzuality-components';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { Select, Radio } from 'components/forms';
import { getLayerExtraParams } from 'utils/map';
import { LAYERS } from 'components/map/constants';

import './style.scss';

const LEGEND_ITEMS = {
  historic: {
    0: {
      period: [
        { color: '#E18D67', value: '5' },
        { color: '#CB5A3A', value: '' },
        { color: '#9D4028', value: '50' },
        { color: '#6D2410', value: '' },
        { color: '#380E03', value: '200' },
      ],
      change: [
        { color: '#B30200', value: '-30' },
        { color: '#E34A33', value: '' },
        { color: '#FC8D59', value: '' },
        { color: '#FDCC8A', value: '' },
        { color: '#FFFFCC', value: '0' },
        { color: '#A1DAB4', value: '' },
        { color: '#31B3BD', value: '' },
        { color: '#1C9099', value: '' },
        { color: '#066C59', value: '30' },
      ],
    },
    1: {
      period: [
        { color: '#E18D67', value: '20' },
        { color: '#CB5A3A', value: '' },
        { color: '#9D4028', value: '80' },
        { color: '#6D2410', value: '' },
        { color: '#380E03', value: '300' },
      ],
      change: [
        { color: '#B30200', value: '-60' },
        { color: '#E34A33', value: '' },
        { color: '#FC8D59', value: '' },
        { color: '#FDCC8A', value: '' },
        { color: '#FFFFCC', value: '0' },
        { color: '#A1DAB4', value: '' },
        { color: '#31B3BD', value: '' },
        { color: '#1C9099', value: '' },
        { color: '#066C59', value: '60' },
      ],
    },
    2: {
      period: [
        { color: '#E18D67', value: '20' },
        { color: '#CB5A3A', value: '' },
        { color: '#9D4028', value: '80' },
        { color: '#6D2410', value: '' },
        { color: '#380E03', value: '400' },
      ],
      change: [
        { color: '#B30200', value: '-120' },
        { color: '#E34A33', value: '' },
        { color: '#FC8D59', value: '' },
        { color: '#FDCC8A', value: '' },
        { color: '#FFFFCC', value: '0' },
        { color: '#A1DAB4', value: '' },
        { color: '#31B3BD', value: '' },
        { color: '#1C9099', value: '' },
        { color: '#066C59', value: '120' },
      ],
    },
  },
  recent: {
    timeseries: [
      { color: '#E18D67', value: '0' },
      { color: '#CB5A3A', value: '' },
      { color: '#9D4028', value: '100' },
      { color: '#6D2410', value: '' },
      { color: '#380E03', value: '200' },
    ],
    change: [
      { color: '#B30200', value: '-1.6' },
      { color: '#E34A33', value: '' },
      { color: '#FC8D59', value: '' },
      { color: '#FDCC8A', value: '' },
      { color: '#FFFFCC', value: '0' },
      { color: '#A1DAB4', value: '' },
      { color: '#31B3BD', value: '' },
      { color: '#1C9099', value: '' },
      { color: '#066C59', value: '1.6' },
    ],
  },
  future: {
    period: [
      { color: '#E18D67', value: '0' },
      { color: '#CB5A3A', value: '' },
      { color: '#9D4028', value: '100' },
      { color: '#6D2410', value: '' },
      { color: '#380E03', value: '200' },
    ],
    change: [
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
  },
};

const SOCStockLegend = ({ layerGroup, onChangeParams }) => {
  const layer = layerGroup.layers[0];

  const typeOptions = useMemo(() => layer.extraParams.config.settings.type.options, [layer]);

  const selectedTypeIndex = useMemo(
    () => typeOptions.findIndex(option => option.value === layer.extraParams.type),
    [layer, typeOptions]
  );

  const onChangeType = useCallback(
    index => {
      const type = typeOptions[index].value;
      // eslint-disable-next-line no-unused-vars
      const { config, ...otherParams } = getLayerExtraParams(
        { ...LAYERS[layerGroup.id], id: layerGroup.id },
        { type }
      );
      onChangeParams(layerGroup.id, { type, ...otherParams });
    },
    [typeOptions, layerGroup, onChangeParams]
  );

  const modeOptions = useMemo(
    () =>
      layer.extraParams.config.settings.type.options.find(
        option => option.value === layer.extraParams.type
      )?.settings.mode.options ?? [],
    [layer]
  );

  const selectedModeIndex = useMemo(
    () => modeOptions.findIndex(option => option.value === layer.extraParams.mode),
    [layer, modeOptions]
  );

  const onChangeMode = useCallback(
    index => {
      const mode = modeOptions[index].value;
      onChangeParams(layerGroup.id, { mode });
    },
    [modeOptions, layerGroup, onChangeParams]
  );

  return (
    <div className="c-map-legend-soc-stock">
      <Tabs className="type-tabs" selectedIndex={selectedTypeIndex} onSelect={onChangeType}>
        <TabList className="react-tabs__tab-list js-soc-stock-tabs">
          {layer.extraParams.config.settings.type.options.map(option => (
            <Tab key={option.value}>{option.label}</Tab>
          ))}
        </TabList>
        <TabPanel>
          <div className="gradient-container">
            <LegendItemTypes
              activeLayer={{
                legendConfig: {
                  type: 'gradient',
                  items: LEGEND_ITEMS.historic[layer.extraParams.depth][layer.extraParams.mode],
                },
              }}
            />
            <div className="unit">(t C/ha)</div>
          </div>

          <Tabs className="mode-tabs" selectedIndex={selectedModeIndex} onSelect={onChangeMode}>
            <TabList>
              {modeOptions.map(option => (
                <Tab key={option.value}>{option.label}</Tab>
              ))}
              <div className="depth-dropdown">
                <>
                  <label htmlFor="legend-depth">Soil depth:</label>
                  <Select
                    id="legend-depth"
                    className="ml-2"
                    options={typeOptions[0].settings.depth.options}
                    value={layer.extraParams.depth}
                    onChange={({ value }) => onChangeParams(layerGroup.id, { depth: value })}
                  />
                </>
              </div>
            </TabList>
            <TabPanel>
              {typeOptions[0].settings.period.options.map(option => (
                <Radio
                  key={option.value}
                  id={`legend-historic-period-${option.value}`}
                  className="mr-4"
                  name="legend-historic-period"
                  checked={layer.extraParams.period === option.value}
                  onChange={() => onChangeParams(layerGroup.id, { period: option.value })}
                >
                  {option.label}
                </Radio>
              ))}
            </TabPanel>
            <TabPanel>
              <div className="select d-inline-block mr-4">
                From:
                <span className="d-inline-block ml-1 font-weight-bold">
                  {typeOptions[0].settings.period.options[0].label}
                </span>
              </div>
              <div className="select d-inline-block">
                To:
                <span className="d-inline-block ml-1 font-weight-bold">
                  {typeOptions[0].settings.period.options[1].label}
                </span>
              </div>
            </TabPanel>
          </Tabs>
        </TabPanel>
        <TabPanel>
          <div className="gradient-container">
            <LegendItemTypes
              activeLayer={{
                legendConfig: {
                  type: 'gradient',
                  items: LEGEND_ITEMS.recent[layer.extraParams.mode],
                },
              }}
            />
            <div className="unit">(t C/ha)</div>
          </div>

          <Tabs className="mode-tabs" selectedIndex={selectedModeIndex} onSelect={onChangeMode}>
            <TabList>
              {modeOptions.map(option => (
                <Tab key={option.value}>{option.label}</Tab>
              ))}
              <div className="depth-dropdown">
                Soil depth:
                <span className="d-inline-block ml-1 font-weight-bold">
                  {typeOptions[1].settings.depth.options[0].label}
                </span>
              </div>
            </TabList>
            <TabPanel>
              <LegendItemTimeStep
                activeLayer={{
                  timelineParams: {
                    range: false,
                    interval: 'years',
                    dateFormat: 'YYYY',
                    minDate: `${typeOptions[1].settings.year1.defaultOption}-01-01`,
                    maxDate: `${typeOptions[1].settings.year2.defaultOption}-12-31`,
                    startDate: `${typeOptions[1].settings.year1.defaultOption}-01-01`,
                    endDate: `${layer.extraParams.year}-01-01`,
                    trimEndDate: `${typeOptions[1].settings.year2.defaultOption}-12-31`,
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
                  options={typeOptions[1].settings.year.options.map(o => ({
                    ...o,
                    disabled: +o.value >= layer.extraParams.year2,
                  }))}
                  value={`${layer.extraParams.year1}`}
                  onChange={({ value }) => onChangeParams(layerGroup.id, { year1: +value })}
                />
              </div>
              <div className="select d-inline-block">
                <label htmlFor="legend-recent-to">To:</label>
                <Select
                  id="legend-recent-to"
                  className="ml-2"
                  options={typeOptions[1].settings.year.options.map(o => ({
                    ...o,
                    disabled: +o.value <= layer.extraParams.year1,
                  }))}
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
                legendConfig: {
                  type: 'gradient',
                  items: LEGEND_ITEMS.future[layer.extraParams.mode],
                },
              }}
            />
            <div className="unit">(t C/ha)</div>
          </div>

          <Tabs className="mode-tabs" selectedIndex={selectedModeIndex} onSelect={onChangeMode}>
            <TabList>
              {modeOptions.map(option => (
                <Tab key={option.value}>{option.label}</Tab>
              ))}
              <div className="depth-dropdown">
                Soil depth:
                <span className="d-inline-block ml-1 font-weight-bold">
                  {typeOptions[2].settings.depth.options[0].label}
                </span>
              </div>
            </TabList>
            <TabPanel className="react-tabs__tab-panel align-items-end">
              <div className="select flex-shrink-1 overflow-hidden d-flex flex-column mr-auto js-soc-stock-scenario">
                <label htmlFor="legend-future-scenario">Soil carbon futures:</label>
                <Select
                  id="legend-future-scenario"
                  className="text-truncate mt-1"
                  options={typeOptions[2].settings.scenario.options}
                  value={layer.extraParams.scenario}
                  onChange={({ value }) => onChangeParams(layerGroup.id, { scenario: value })}
                />
              </div>
              <div className="select flex-shrink-0 d-flex flex-column ml-4">
                <label htmlFor="legend-future-year">Year:</label>
                <Select
                  id="legend-future-year"
                  className="mt-1"
                  options={typeOptions[2].settings.year.options}
                  value={layer.extraParams.year}
                  onChange={({ value }) => onChangeParams(layerGroup.id, { year: value })}
                />
              </div>
            </TabPanel>
            <TabPanel className="react-tabs__tab-panel align-items-end">
              <div className="select flex-shrink-1 overflow-hidden d-flex flex-column mr-auto">
                <label htmlFor="legend-future-scenario">Soil carbon futures:</label>
                <Select
                  id="legend-future-scenario"
                  className="text-truncate mt-1"
                  options={typeOptions[2].settings.scenario.options}
                  value={layer.extraParams.scenario}
                  onChange={({ value }) => onChangeParams(layerGroup.id, { scenario: value })}
                />
              </div>
              <div className="flex-shrink-0 d-flex align-items-center ml-4">
                <div className="select d-inline-block mr-4">
                  From:
                  <span className="d-inline-block ml-1 font-weight-bold">
                    {typeOptions[1].settings.year2.defaultOption}
                  </span>
                </div>
                <div className="select d-inline-block">
                  <label htmlFor="legend-future-to">To:</label>
                  <Select
                    id="legend-future-to"
                    className="ml-2"
                    options={typeOptions[2].settings.year.options}
                    value={layer.extraParams.year}
                    onChange={({ value }) => onChangeParams(layerGroup.id, { year: value })}
                  />
                </div>
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
