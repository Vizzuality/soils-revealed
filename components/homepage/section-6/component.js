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
                <Icon name="soil-health" /> Soil health
              </Tab>
            </TabList>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-sm-12 col-md-8 offset-md-2 tab-content">
            <TabPanel>
              Soil use and management have a direct effect on climate change by altering emissions
              of &apos;greenhouse gases&apos; to the atmosphere. Judicious land management can
              reduce these emissions and safeguard ecosystem services and soil health.
            </TabPanel>
            <TabPanel>
              World food crisis looms if greenhouse gas emissions go unchecked. The impacts of
              climate change on land will increase food prices and risk widespread food instability.
              But there are solutions, including maintaining or improving carbon stocks in
              terrestrial systems through sustainable land management.
            </TabPanel>
            <TabPanel>
              Soil health is determined by numerous soil properties, in particular soil organic
              matter. Organic matter can be increased through judicious land management practices.
              It enhances nutrient and water holding capacity, and improves soil structure. Managing
              for increased soil carbon can enhance productivity, soil biodiversity and
              environmental quality. Increased soil organic matter levels can also help reduce
              atmospheric CO2 emissions that contribute to climate change.
            </TabPanel>
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
