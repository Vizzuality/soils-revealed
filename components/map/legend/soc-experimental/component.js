import React from 'react';
import PropTypes from 'prop-types';
import { LegendItemTypes, LegendItemTimeStep } from 'vizzuality-components';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { Select } from 'components/forms';

import './style.scss';

const LEGEND_ITEMS = {
  timeseries: {
    stock: [
      { color: '#E18D67', value: '5' },
      { color: '#CB5A3A', value: '' },
      { color: '#9D4028', value: '50' },
      { color: '#6D2410', value: '' },
      { color: '#380E03', value: '200' },
    ],
    concentration: [
      { color: '#E18D67', value: '5' },
      { color: '#CB5A3A', value: '' },
      { color: '#9D4028', value: '30' },
      { color: '#6D2410', value: '' },
      { color: '#380E03', value: '75' },
    ],
  },
  change: {
    stock: [
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
    concentration: [
      { color: '#B30200', value: '-5' },
      { color: '#E34A33', value: '' },
      { color: '#FC8D59', value: '' },
      { color: '#FDCC8A', value: '' },
      { color: '#FFFFCC', value: '0' },
      { color: '#A1DAB4', value: '' },
      { color: '#31B3BD', value: '' },
      { color: '#1C9099', value: '' },
      { color: '#066C59', value: '5' },
    ],
  },
};

const SOCExperimentalLegend = ({ layerGroup, onChangeParams }) => {
  const layer = layerGroup.layers[0];

  const depthOptions = Object.keys(layer.extraParams.config.depths).map(key => ({
    label: layer.extraParams.config.depths[key],
    value: key,
  }));

  const yearOptions = Array(
    layer.extraParams.config.years[1] - layer.extraParams.config.years[0] + 1
  )
    .fill(null)
    .map((_, index) => ({
      label: `${layer.extraParams.config.years[0] + index}`,
      value: `${layer.extraParams.config.years[0] + index}`,
    }));

  return (
    <div className="c-map-legend-soc-experimental">
      <div className="gradient-container">
        <LegendItemTypes
          activeLayer={{
            legendConfig: {
              type: 'gradient',
              items: LEGEND_ITEMS[layer.extraParams.mode][layer.extraParams.type],
            },
          }}
        />
        <div className="unit">(t C/ha)</div>
      </div>

      <Tabs
        selectedIndex={layer.extraParams.mode === 'timeseries' ? 0 : 1}
        onSelect={index =>
          onChangeParams(layerGroup.id, { mode: index === 0 ? 'timeseries' : 'change' })
        }
      >
        <TabList>
          <Tab>Time Series</Tab>
          <Tab>Change</Tab>
          <div className="depth-dropdown">
            {layer.extraParams.type === 'stock' && (
              <>
                Soil depth:
                <span className="d-inline-block ml-1 font-weight-bold">0-30 cm</span>
              </>
            )}
            {layer.extraParams.type === 'concentration' && (
              <>
                <label htmlFor="legend-depth">Soil depth:</label>
                <Select
                  id="legend-depth"
                  className="ml-2"
                  options={depthOptions}
                  value={`${layer.extraParams.depth}`}
                  onChange={({ value }) => onChangeParams(layerGroup.id, { depth: +value })}
                />
              </>
            )}
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
            handleChange={dates => onChangeParams(layerGroup.id, { year: +dates[1].split('-')[0] })}
          />
        </TabPanel>
        <TabPanel>
          <div className="change-year d-inline-block mr-4">
            <label htmlFor="legend-from">From:</label>
            <Select
              id="legend-from"
              className="ml-2"
              options={yearOptions.map(o => ({
                ...o,
                disabled: +o.value >= layer.extraParams.year2,
              }))}
              value={`${layer.extraParams.year1}`}
              onChange={({ value }) => onChangeParams(layerGroup.id, { year1: +value })}
            />
          </div>
          <div className="change-year d-inline-block">
            <label htmlFor="legend-to">To:</label>
            <Select
              id="legend-to"
              className="ml-2"
              options={yearOptions.map(o => ({
                ...o,
                disabled: +o.value <= layer.extraParams.year1,
              }))}
              value={`${layer.extraParams.year2}`}
              onChange={({ value }) => onChangeParams(layerGroup.id, { year2: +value })}
            />
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

SOCExperimentalLegend.propTypes = {
  layerGroup: PropTypes.object.isRequired,
  onChangeParams: PropTypes.func.isRequired,
};

export default SOCExperimentalLegend;
