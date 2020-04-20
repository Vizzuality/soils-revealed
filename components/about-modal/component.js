import React from 'react';
import PropTypes from 'prop-types';

import Modal from 'components/modal';

import './style.scss';

const AboutModal = ({ open, onClose }) => (
  <Modal open={open} onClose={onClose} title="About Soils Revealed" className="c-about-modal">
    <h1 className="mb-4">About Soils Revealed</h1>
    <p>
      Soils Revealed is a platform for visualizing how past and future management changes soil
      organic carbon stocks globally. It is based on the best, and sometimes only, available soil
      data, information about the environment and computer simulations over time. Projections for
      the coming decades are based on scenarios issued by the Intergovernmental Panel on Climate
      Change (IPCC).
    </p>
    <p>
      The platform provides a novel and dynamic way of displaying, and comparing areas with greatest
      potential to increase soil organic carbon and advance food security, soil health and climate
      action. Potential partners are encouraged to join this international effort to help gradually
      improve the platform.
    </p>
    <p>The project involved collaboration with the following partners:</p>
    <div className="container mt-3">
      <div className="row align-items-center ">
        <div className="col-6 col-md-3 pl-md-0 mb-4 mb-md-0">
          <a href="https://www.nature.org" target="_blank" rel="noopener noreferrer">
            <img src="/images/tnc-logo.svg" alt="The Nature Conservancy" />
          </a>
        </div>
        <div className="col-6 col-md-3 mb-4 mb-md-0">
          <a href="https://www.cornell.edu" target="_blank" rel="noopener noreferrer">
            <img src="/images/cornell-university-logo.svg" alt="Cornell University" />
          </a>
        </div>
        <div className="col-6 col-md-3">
          <a href="https://www.isric.org" target="_blank" rel="noopener noreferrer">
            <img src="/images/isric-logo.svg" alt="ISRIC" />
          </a>
        </div>
        <div className="col-6 col-md-3 pr-md-0">
          <a href="https://whrc.org" target="_blank" rel="noopener noreferrer">
            <img src="/images/whrc-logo.svg" alt="Woods Hole Research Center" />
          </a>
        </div>
      </div>
    </div>
    <h2 className="mt-5 mb-3">Methods in brief</h2>
    <p>
      The historic SOC changes in agricultural lands are derived from Sanderman et al. (2017) who
      used a data-driven statistical model and the HYDE v3.2 historic land-use dataset (Klein
      Goldewijk et al., 2017). Recent changes in SOC stocks are assessed using actual soil carbon
      data from national archives, a statistical space-time method for mapping SOC stocks, using
      Argentina as a pilot region (Heuvelink et al., submitted). Future carbon changes are predicted
      using scenarios from IPCC (2019).
    </p>
  </Modal>
);

AboutModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AboutModal;
