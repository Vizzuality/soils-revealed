import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { logEvent } from 'utils/analytics';
import { Select, Radio } from 'components/forms';
import { getLayerExtraParams } from 'utils/map';
import { LAYERS } from 'components/map/constants';
import GradientBar from 'components/map/legend/gradient-bar';

import './style.scss';

const LEGEND_ITEMS = {
  historic: {
    0: {
      period: [
        { color: '#FFD0BB', value: '0' },
        { color: '#FFB492', value: '20' },
        { color: '#E18D67', value: '40' },
        { color: '#B74829', value: '60' },
        { color: '#903116', value: '80' },
        { color: '#631E0B', value: '100' },
        { color: '#2A0A02', value: '≥120' },
      ],
      change: [
        { color: '#B30200', value: '≤-30' },
        { color: '#E34A33', value: '' },
        { color: '#FC8D59', value: '-15' },
        { color: '#FDCC8A', value: '' },
        { color: '#FFFFCC', value: '0' },
        { color: '#A1DAB4', value: '' },
        { color: '#31B3BD', value: '15' },
        { color: '#1C9099', value: '' },
        { color: '#066C59', value: '≥30' },
      ],
    },
    1: {
      period: [
        { color: '#FFD0BB', value: '0' },
        { color: '#FFB492', value: '50' },
        { color: '#E18D67', value: '100' },
        { color: '#B74829', value: '150' },
        { color: '#903116', value: '200' },
        { color: '#631E0B', value: '250' },
        { color: '#2A0A02', value: '≥300' },
      ],
      change: [
        { color: '#B30200', value: '≤-60' },
        { color: '#E34A33', value: '' },
        { color: '#FC8D59', value: '-30' },
        { color: '#FDCC8A', value: '' },
        { color: '#FFFFCC', value: '0' },
        { color: '#A1DAB4', value: '' },
        { color: '#31B3BD', value: '30' },
        { color: '#1C9099', value: '' },
        { color: '#066C59', value: '≥60' },
      ],
    },
    2: {
      period: [
        { color: '#FFD0BB', value: '0' },
        { color: '#FFB492', value: '80' },
        { color: '#E18D67', value: '160' },
        { color: '#B74829', value: '240' },
        { color: '#903116', value: '320' },
        { color: '#631E0B', value: '400' },
        { color: '#2A0A02', value: '≥480' },
      ],
      change: [
        { color: '#B30200', value: '≤-120' },
        { color: '#E34A33', value: '' },
        { color: '#FC8D59', value: '-60' },
        { color: '#FDCC8A', value: '' },
        { color: '#FFFFCC', value: '0' },
        { color: '#A1DAB4', value: '' },
        { color: '#31B3BD', value: '60' },
        { color: '#1C9099', value: '' },
        { color: '#066C59', value: '≥120' },
      ],
    },
  },
  recent: {
    timeseries: [
      { color: '#FFD0BB', value: '0' },
      { color: '#FFB492', value: '20' },
      { color: '#E18D67', value: '40' },
      { color: '#B74829', value: '60' },
      { color: '#903116', value: '80' },
      { color: '#631E0B', value: '100' },
      { color: '#2A0A02', value: '≥120' },
    ],
    change: [
      { color: '#B30200', value: '≤-1.0' },
      { color: '#E34A33', value: '' },
      { color: '#FC8D59', value: '-0.5' },
      { color: '#FDCC8A', value: '' },
      { color: '#FFFFCC', value: '0' },
      { color: '#A1DAB4', value: '' },
      { color: '#31B3BD', value: '0.5' },
      { color: '#1C9099', value: '' },
      { color: '#066C59', value: '≥1.0' },
    ],
  },
  future: {
    period: [
      { color: '#FFD0BB', value: '0' },
      { color: '#FFB492', value: '20' },
      { color: '#E18D67', value: '40' },
      { color: '#B74829', value: '60' },
      { color: '#903116', value: '80' },
      { color: '#631E0B', value: '100' },
      { color: '#2A0A02', value: '≥120' },
    ],
    change: {
      '00': [
        { color: '#B30200', value: '≤-20' },
        { color: '#E34A33', value: '' },
        { color: '#FC8D59', value: '-10' },
        { color: '#FDCC8A', value: '' },
        { color: '#FFFFCC', value: '0' },
        { color: '#A1DAB4', value: '' },
        { color: '#31B3BD', value: '10' },
        { color: '#1C9099', value: '' },
        { color: '#066C59', value: '≥20' },
      ],
      '01': [
        { color: '#B30200', value: '≤-20' },
        { color: '#E34A33', value: '' },
        { color: '#FC8D59', value: '-10' },
        { color: '#FDCC8A', value: '' },
        { color: '#FFFFCC', value: '0' },
        { color: '#A1DAB4', value: '' },
        { color: '#31B3BD', value: '10' },
        { color: '#1C9099', value: '' },
        { color: '#066C59', value: '≥20' },
      ],
      '02': [
        { color: '#B30200', value: '≤-20' },
        { color: '#E34A33', value: '' },
        { color: '#FC8D59', value: '-10' },
        { color: '#FDCC8A', value: '' },
        { color: '#FFFFCC', value: '0' },
        { color: '#A1DAB4', value: '' },
        { color: '#31B3BD', value: '10' },
        { color: '#1C9099', value: '' },
        { color: '#066C59', value: '≥20' },
      ],
      '03': [
        { color: '#B30200', value: '≤-20' },
        { color: '#E34A33', value: '' },
        { color: '#FC8D59', value: '-10' },
        { color: '#FDCC8A', value: '' },
        { color: '#FFFFCC', value: '0' },
        { color: '#A1DAB4', value: '' },
        { color: '#31B3BD', value: '10' },
        { color: '#1C9099', value: '' },
        { color: '#066C59', value: '≥20' },
      ],
      '04': [
        { color: '#B30200', value: '≤-20' },
        { color: '#E34A33', value: '' },
        { color: '#FC8D59', value: '-10' },
        { color: '#FDCC8A', value: '' },
        { color: '#FFFFCC', value: '0' },
        { color: '#A1DAB4', value: '' },
        { color: '#31B3BD', value: '10' },
        { color: '#1C9099', value: '' },
        { color: '#066C59', value: '≥20' },
      ],
      '10': [
        { color: '#B30200', value: '≤-20' },
        { color: '#E34A33', value: '' },
        { color: '#FC8D59', value: '-10' },
        { color: '#FDCC8A', value: '' },
        { color: '#FFFFCC', value: '0' },
        { color: '#A1DAB4', value: '' },
        { color: '#31B3BD', value: '10' },
        { color: '#1C9099', value: '' },
        { color: '#066C59', value: '≥20' },
      ],
      '20': [
        { color: '#B30200', value: '≤-40' },
        { color: '#E34A33', value: '' },
        { color: '#FC8D59', value: '-20' },
        { color: '#FDCC8A', value: '' },
        { color: '#FFFFCC', value: '0' },
        { color: '#A1DAB4', value: '' },
        { color: '#31B3BD', value: '20' },
        { color: '#1C9099', value: '' },
        { color: '#066C59', value: '≥40' },
      ],
      '21': [
        { color: '#B30200', value: '≤-40' },
        { color: '#E34A33', value: '' },
        { color: '#FC8D59', value: '-20' },
        { color: '#FDCC8A', value: '' },
        { color: '#FFFFCC', value: '0' },
        { color: '#A1DAB4', value: '' },
        { color: '#31B3BD', value: '20' },
        { color: '#1C9099', value: '' },
        { color: '#066C59', value: '≥40' },
      ],
      '22': [
        { color: '#B30200', value: '≤-40' },
        { color: '#E34A33', value: '' },
        { color: '#FC8D59', value: '-20' },
        { color: '#FDCC8A', value: '' },
        { color: '#FFFFCC', value: '0' },
        { color: '#A1DAB4', value: '' },
        { color: '#31B3BD', value: '20' },
        { color: '#1C9099', value: '' },
        { color: '#066C59', value: '≥40' },
      ],
    },
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
      logEvent(
        'Legend',
        'interacts with legend "soil organic carbon stock"',
        `Clicks on ${typeOptions[index].label}`
      );

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
      logEvent(
        'Legend',
        'interacts with legend "soil organic carbon stock"',
        `Clicks on "${modeOptions[index].label}"`
      );

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
            <GradientBar
              items={LEGEND_ITEMS.historic[layer.extraParams.depth][layer.extraParams.mode]}
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
                    onChange={({ value }) => {
                      logEvent(
                        'Legend',
                        'interacts with legend "soil organic carbon stock"',
                        'Changes soil depth'
                      );
                      onChangeParams(layerGroup.id, { depth: value });
                    }}
                    overflow
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
                  onChange={() => {
                    logEvent(
                      'Legend',
                      'interacts with legend "soil organic carbon stock"',
                      `Changes "year" in "${layer.extraParams.config.settings.type.options[0].label}"`
                    );
                    onChangeParams(layerGroup.id, { period: option.value });
                  }}
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
            <GradientBar items={LEGEND_ITEMS.recent[layer.extraParams.mode]} />
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
            <TabPanel className="react-tabs__tab-panel align-items-end">
              <div className="select d-flex flex-column">
                <label htmlFor="legend-recent-year">Year:</label>
                <Select
                  id="legend-recent-year"
                  className="mt-1"
                  options={typeOptions[1].settings.year.options}
                  value={layer.extraParams.year}
                  onChange={({ value }) => {
                    logEvent(
                      'Legend',
                      'interacts with legend "soil organic carbon stock"',
                      `Changes "year" in "${layer.extraParams.config.settings.type.options[1].label}"`
                    );
                    onChangeParams(layerGroup.id, { year: value });
                  }}
                  overflow
                />
              </div>
            </TabPanel>
            <TabPanel>
              <div className="select d-inline-block mr-4">
                <label htmlFor="legend-recent-from">From:</label>
                <Select
                  id="legend-recent-from"
                  className="ml-2"
                  options={typeOptions[1].settings.year.options.map(o => ({
                    ...o,
                    isDisabled: +o.value >= layer.extraParams.year2,
                  }))}
                  value={`${layer.extraParams.year1}`}
                  onChange={({ value }) => {
                    logEvent(
                      'Legend',
                      'interacts with legend "soil organic carbon stock"',
                      `Changes "year" in "${layer.extraParams.config.settings.type.options[1].label}"`
                    );
                    onChangeParams(layerGroup.id, { year1: +value });
                  }}
                  overflow
                />
              </div>
              <div className="select d-inline-block">
                <label htmlFor="legend-recent-to">To:</label>
                <Select
                  id="legend-recent-to"
                  className="ml-2"
                  options={typeOptions[1].settings.year.options.map(o => ({
                    ...o,
                    isDisabled: +o.value <= layer.extraParams.year1,
                  }))}
                  value={`${layer.extraParams.year2}`}
                  onChange={({ value }) => {
                    logEvent(
                      'Legend',
                      'interacts with legend "soil organic carbon stock"',
                      `Changes "year" in "${layer.extraParams.config.settings.type.options[1].label}"`
                    );
                    onChangeParams(layerGroup.id, { year2: +value });
                  }}
                  overflow
                />
              </div>
            </TabPanel>
          </Tabs>
        </TabPanel>
        <TabPanel>
          <div className="gradient-container">
            <GradientBar
              items={
                layer.extraParams.mode === 'period'
                  ? LEGEND_ITEMS.future.period
                  : LEGEND_ITEMS.future.change[layer.extraParams.scenario]
              }
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
              <div className="select flex-shrink-1 overflow-hidden mr-auto js-soc-stock-scenario">
                <label htmlFor="legend-future-scenario">Soil carbon futures:</label>
                <Select
                  id="legend-future-scenario"
                  className="scenario-select w-100 mt-1"
                  options={typeOptions[2].settings.scenario.options}
                  value={layer.extraParams.scenario}
                  onChange={({ value }) => {
                    logEvent(
                      'Legend',
                      'interacts with legend "soil organic carbon stock"',
                      'Changes "soil carbon futures"'
                    );
                    onChangeParams(layerGroup.id, { scenario: value });
                  }}
                  overflow
                />
              </div>
              <div className="select flex-shrink-0 d-flex flex-column ml-4">
                <label htmlFor="legend-future-year">Year:</label>
                <Select
                  id="legend-future-year"
                  className="mt-1"
                  options={typeOptions[2].settings.year.options}
                  value={layer.extraParams.year}
                  onChange={({ value }) => {
                    logEvent(
                      'Legend',
                      'interacts with legend "soil organic carbon stock"',
                      `Changes "year" in "${layer.extraParams.config.settings.type.options[2].label}"`
                    );
                    onChangeParams(layerGroup.id, { year: value });
                  }}
                  overflow
                />
              </div>
            </TabPanel>
            <TabPanel className="react-tabs__tab-panel align-items-end">
              <div className="select flex-shrink-1 overflow-hidden mr-auto">
                <label htmlFor="legend-future-scenario">Soil carbon futures:</label>
                <Select
                  id="legend-future-scenario"
                  className="scenario-select w-100 mt-1"
                  options={typeOptions[2].settings.scenario.options}
                  value={layer.extraParams.scenario}
                  onChange={({ value }) => {
                    logEvent(
                      'Legend',
                      'interacts with legend "soil organic carbon stock"',
                      'Changes "soil carbon futures"'
                    );
                    onChangeParams(layerGroup.id, { scenario: value });
                  }}
                  overflow
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
                    onChange={({ value }) => {
                      logEvent(
                        'Legend',
                        'interacts with legend "soil organic carbon stock"',
                        `Changes "year" in "${layer.extraParams.config.settings.type.options[2].label}"`
                      );
                      onChangeParams(layerGroup.id, { year: value });
                    }}
                    overflow
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
