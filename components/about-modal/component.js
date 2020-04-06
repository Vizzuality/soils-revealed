import React from 'react';
import PropTypes from 'prop-types';

import Modal from 'components/modal';

import './style.scss';

const AboutModal = ({ open, onClose }) => (
  <Modal open={open} onClose={onClose} title="About Soils Revealed" className="c-about-modal">
    <h1 className="mb-4">About Soils Revealed</h1>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut at lacinia ligula, eu placerat
      magna. Sed bibendum metus sed enim posuere, eu congue nunc fermentum. Vestibulum sit amet diam
      condimentum, aliquet eros nec, blandit neque. Duis tortor massa, consectetur sed sem ut,
      commodo egestas orci. Curabitur libero metus, pulvinar non neque id, tempor pellentesque
      lectus. Aenean dignissim vestibulum orci quis condimentum. Fusce congue, dui vitae semper
      feugiat, nisl est tincidunt ex, ut imperdiet tellus arcu at leo.{' '}
    </p>
    <h2 className="mb-4">Our partners</h2>
    <div className="container">
      <div className="row text-center mb-md-5">
        <div className="col-12 col-md-6 mb-4 mb-md-0">
          <img src="/images/tnc-logo.svg" alt="The Nature Conservancy" />
        </div>
        <div className="col-12 col-md-6 mb-4 mb-md-0">
          <img src="/images/cornell-university-logo.svg" alt="Cornell University" />
        </div>
      </div>
      <div className="row text-center">
        <div className="col-12 col-md-6 mb-4 mb-md-0">
          <img src="/images/isric-logo.svg" alt="ISRIC" />
        </div>
        <div className="col-12 col-md-6">
          <img src="/images/whrc-logo.svg" alt="Woods Hole Research Center" />
        </div>
      </div>
    </div>
  </Modal>
);

AboutModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AboutModal;
