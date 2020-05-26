import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import Modal from 'components/modal';
import Markdown from 'components/markdown';

import './style.scss';

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

const InfoModal = ({ layerId, layers, onClose }) => {
  const layer = useMemo(() => layers[layerId], [layerId, layers]);

  if (!layer) {
    return null;
  }

  return (
    <Modal open onClose={onClose} title={layer.label} className="c-explore-info-modal">
      {!!layerId && (
        <>
          <h1 className="mb-4">{layer.label}</h1>
          <div className="intro mb-5">{layer.description ?? '−'}</div>
          <div className="container">
            <Row name="Dataset">
              {layer.info.dataset && layer.info.downloadLink && (
                <a href={layer.info.downloadLink} target="_blank" rel="noopener noreferrer">
                  {layer.info.datasetName}
                </a>
              )}
              {(!layer.info.dataset || !layer.info.downloadLink) && '−'}
            </Row>
            <Row name="Function">{layer.info.function ?? '−'}</Row>
            <Row name="Geographic coverage">{layer.info.geoCoverage ?? '−'}</Row>
            <Row name="Spatial resolution">{layer.info.spatialResolution ?? '−'}</Row>
            <Row name="Date of content">{layer.info.contentDate ?? '−'}</Row>
            <Row name="Description">
              {layer.info.description && <Markdown content={layer.info.description} />}
              {!layer.info.description && '−'}
            </Row>
            <Row name="Cautions">
              {layer.info.cautions && <Markdown content={layer.info.cautions} />}
              {!layer.info.cautions && '−'}
            </Row>
            <Row name="Sources">
              {layer.info.sources && (
                <ul>
                  {layer.info.sources.map(source => (
                    <li key={source}>
                      <Markdown content={source} />
                    </li>
                  ))}
                </ul>
              )}
              {!layer.info.sources && '−'}
            </Row>
            <Row name="Citation">
              <Markdown content={layer.info.citation ?? '−'} />
            </Row>
            <Row name="License">
              {layer.info.license && layer.info.licenseLink && (
                <a href={layer.info.licenseLink} target="_blank" rel="noopener noreferrer">
                  {layer.info.license}
                </a>
              )}
              {(!layer.info.license || !layer.info.licenseLink) && '−'}
            </Row>
          </div>
        </>
      )}
    </Modal>
  );
};

InfoModal.propTypes = {
  layerId: PropTypes.string,
  layers: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

InfoModal.defaultProps = {
  layerId: null,
};

export default InfoModal;
