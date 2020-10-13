import React from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import Icon from 'components/icon';

import './style.scss';

const Section6 = ({ configuration }) => (
  <section id={configuration.anchor} className="c-homepage-section-6">
    <div className="container">
      <div className="row mb-3">
        <div className="col-sm-12">
          <div className="section-title">{configuration.title}</div>
          <div className="section-description">{configuration.description}</div>
        </div>
        <div className="col-sm-12 col-md-8 offset-md-2 tab-intro">Main benefits:</div>
      </div>
      <Tabs>
        <div className="row mb-4">
          <div className="col-sm-12 col-md-8 offset-md-2 tabs">
            <TabList className="react-tabs__tab-list row">
              <Tab className="react-tabs__tab col-4 pl-0">
                <Icon name="climate-change" /> Climate change
              </Tab>
              <Tab className="react-tabs__tab col-4">
                <Icon name="food-security" /> Food security
              </Tab>
              <Tab className="react-tabs__tab col-4 pr-0">
                <Icon name="water-quality" /> Water quality
              </Tab>
            </TabList>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-sm-12 col-md-8 offset-md-2 tab-content">
            <TabPanel>
              Soil use and management have a direct effect on climate change by altering emissions
              of greenhouse gases to the atmosphere. Judicious land management can reduce these
              emissions and remove CO<sub>2</sub> from the atmosphere by storing it in the soil.
            </TabPanel>
            <TabPanel>
              World food crisis looms if greenhouse gas emissions go unchecked. The impacts of
              climate change on land will increase food prices and cause widespread food
              instability. But there are solutions, including maintaining or improving soil organic
              carbon stocks in terrestrial systems through sustainable land management.
            </TabPanel>
            <TabPanel>
              Restorative land use and management practices have many additional benefits to
              enhancing soil organic carbon. These include reduction in sedimentation of waterways
              and reservoirs, biodegradation of pollutants and ultimately improvement in the quality
              of groundwater, rivers and oceans.
            </TabPanel>
          </div>
        </div>
      </Tabs>
    </div>
  </section>
);

Section6.propTypes = {
  id: PropTypes.string,
  configuration: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    anchor: PropTypes.string.isRequired,
  }).isRequired,
};

export default Section6;
