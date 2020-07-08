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
            {layers[layerId].paramsConfig.settings.type.options.map(option => (
              <Tab key={option.value}>{option.label}</Tab>
            ))}
          </TabList>
          {layers[layerId].paramsConfig.settings.type.options.map(option => (
            <TabPanel key={option.value}>
              {layers[layerId].description[option.value]}
              <button
                type="button"
                className="btn btn-sm btn-link"
                onClick={() =>
                  onClickInfo({
                    id: layerId,
                    tab: option.value,
                  })
                }
              >
                <Icon name="info" /> More information
              </button>
            </TabPanel>
          ))}
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
