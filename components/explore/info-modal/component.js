import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import Modal from 'components/modal';
import Markdown from 'components/markdown';

import './style.scss';

const SOC_STOCK_TABS = {
  historic: 'Historic',
  recent: 'Recent',
  future: 'Future',
};

const Row = ({ name, children }) => (
  <div className="row mb-2">
    <div className="col-3 pl-0">
      <h2>{name}</h2>
    </div>
    <div className="col-9 pr-0">{children}</div>
  </div>
);

Row.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const Content = ({ layer, tab }) => {
  const info = tab ? layer.info[tab] : layer.info;

  return (
    <>
      <div className="intro mb-5">{(tab ? layer.description[tab] : layer.description) ?? '−'}</div>
      <div className="container">
        <Row name="Dataset">
          {info.dataset && info.downloadLink && (
            <a href={info.downloadLink} target="_blank" rel="noopener noreferrer">
              {info.datasetName}
            </a>
          )}
          {(!info.dataset || !info.downloadLink) && '−'}
        </Row>
        <Row name="Function">{info.function ?? '−'}</Row>
        <Row name="Geographic coverage">{info.geoCoverage ?? '−'}</Row>
        <Row name="Spatial resolution">{info.spatialResolution ?? '−'}</Row>
        <Row name="Date of content">{info.contentDate ?? '−'}</Row>
        <Row name="Description">
          {info.description && <Markdown content={info.description} />}
          {!info.description && '−'}
        </Row>
        <Row name="Cautions">
          {info.cautions && <Markdown content={info.cautions} />}
          {!info.cautions && '−'}
        </Row>
        <Row name="Sources">
          {info.sources && (
            <ul>
              {info.sources.map(source => (
                <li key={source}>
                  <Markdown content={source} />
                </li>
              ))}
            </ul>
          )}
          {!info.sources && '−'}
        </Row>
        <Row name="Citation">
          <Markdown content={info.citation ?? '−'} />
        </Row>
        <Row name="License">
          {info.license && info.licenseLink && (
            <a href={info.licenseLink} target="_blank" rel="noopener noreferrer">
              {info.license}
            </a>
          )}
          {info.license && !info.licenseLink && info.license}
          {!info.license && '−'}
        </Row>
      </div>
    </>
  );
};

Content.propTypes = {
  layer: PropTypes.object.isRequired,
  tab: PropTypes.string,
};

Content.defaultProps = {
  tab: null,
};

const InfoModal = ({ layerId, params, layers, onClose }) => {
  const layer = layers[layerId];
  const [selectedTab, setSelectedTab] = useState(params?.tab);

  useEffect(() => {
    setSelectedTab(params?.tab);
  }, [params, setSelectedTab]);

  if (!layer) {
    return null;
  }

  return (
    <Modal open onClose={onClose} title={layer.label} className="c-explore-info-modal">
      {!!layerId && (
        <>
          <h1 className="mb-4">{layer.label}</h1>
          {layerId !== 'soc-stock' && <Content layer={layer} />}
          {layerId === 'soc-stock' && (
            <Tabs
              className="info-modal-tabs"
              selectedIndex={Object.keys(SOC_STOCK_TABS).indexOf(selectedTab)}
              onSelect={index => setSelectedTab(Object.keys(SOC_STOCK_TABS)[index])}
            >
              <TabList>
                {Object.keys(SOC_STOCK_TABS).map(key => (
                  <Tab key={key}>{SOC_STOCK_TABS[key]}</Tab>
                ))}
              </TabList>
              {Object.keys(SOC_STOCK_TABS).map(key => (
                <TabPanel key={key}>
                  <Content layer={layer} tab={key} />
                </TabPanel>
              ))}
            </Tabs>
          )}
        </>
      )}
    </Modal>
  );
};

InfoModal.propTypes = {
  layerId: PropTypes.string,
  params: PropTypes.object,
  layers: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

InfoModal.defaultProps = {
  layerId: null,
  params: null,
};

export default InfoModal;
