import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import Icon from 'components/icon';

import './style.scss';

const Description = ({ layers, layerId, onClickInfo }) => {
  const [previousLayerId, setPreviousLayerId] = useState(layerId);
  const [selectedTabIndex, setSelectedTabIndex] = useState(1); // The tab 1 is the Recent one

  // Whenever the layer ID changes, we reset the selected tab
  useEffect(() => {
    if (previousLayerId !== layerId) {
      setSelectedTabIndex(1);
      setPreviousLayerId(layerId);
    }
  }, [previousLayerId, layerId, setSelectedTabIndex, setPreviousLayerId]);

  if (!layerId || !layers[layerId].description) {
    return null;
  }

  return (
    <div className="c-layers-tab-description">
      {layerId !== 'soc-stock' && (
        <>
          {layers[layerId].description}
          <button
            type="button"
            className="btn btn-sm btn-link"
            onClick={() => onClickInfo({ id: layerId })}
          >
            <Icon name="info" /> More information
          </button>
        </>
      )}
      {layerId === 'soc-stock' && (
        <Tabs
          className="description-tabs"
          selectedIndex={selectedTabIndex}
          onSelect={index => setSelectedTabIndex(index)}
        >
          <TabList>
            <Tab>Historic</Tab>
            <Tab>Recent</Tab>
            <Tab>Future</Tab>
          </TabList>
          <TabPanel>
            {layers[layerId].description.historic}
            <button
              type="button"
              className="btn btn-sm btn-link"
              onClick={() => onClickInfo({ id: layerId, tab: 'historic' })}
            >
              <Icon name="info" /> More information
            </button>
          </TabPanel>
          <TabPanel>
            {layers[layerId].description.recent}
            <button
              type="button"
              className="btn btn-sm btn-link"
              onClick={() => onClickInfo({ id: layerId, tab: 'recent' })}
            >
              <Icon name="info" /> More information
            </button>
          </TabPanel>
          <TabPanel>
            {layers[layerId].description.future}
            <button
              type="button"
              className="btn btn-sm btn-link"
              onClick={() => onClickInfo({ id: layerId, tab: 'future' })}
            >
              <Icon name="info" /> More information
            </button>
          </TabPanel>
        </Tabs>
      )}
    </div>
  );
};

Description.propTypes = {
  layers: PropTypes.object.isRequired,
  layerId: PropTypes.string,
  onClickInfo: PropTypes.func.isRequired,
};

Description.defaultProps = {
  layerId: null,
};

export default Description;
