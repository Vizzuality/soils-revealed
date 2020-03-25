import React from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { Link } from 'lib/routes';
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
        <div className="col-sm-12 col-md-8 offset-md-2 tab-intro">Main challenges:</div>
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
              Changing how we manage our soils, to increase the amount of organic carbon stored,
              could be one important and immediately actionable way to limit Climate Change,
              increase Food Security and improve Water Quality.
            </TabPanel>
            <TabPanel>Food security</TabPanel>
            <TabPanel>Water quality</TabPanel>
          </div>
        </div>
      </Tabs>
      <div className="row">
        <div className="col-sm-12 col-md-8 offset-md-2">
          <Link route="about">
            <a className="btn btn-primary btn-fixed-width">About</a>
          </Link>
        </div>
      </div>
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
