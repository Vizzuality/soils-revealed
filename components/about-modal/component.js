import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';

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
    <p>The project involves collaboration with the following partners:</p>
    <div className="container mt-3">
      <div className="row align-items-center text-center">
        <div className="col-6 col-md-3 pl-md-0 mb-4 mb-md-0">
          <a href="https://www.nature.org" target="_blank" rel="noopener noreferrer">
            <Image
              src="/images/tnc-logo.svg"
              alt="The Nature Conservancy"
              width={147}
              height={42}
            />
          </a>
        </div>
        <div className="col-6 col-md-3 mb-4 mb-md-0">
          <a href="https://www.cornell.edu" target="_blank" rel="noopener noreferrer">
            <Image
              src="/images/cornell-university-logo.svg"
              alt="Cornell University"
              width={100}
              height={100}
            />
          </a>
        </div>
        <div className="col-6 col-md-3">
          <a href="https://www.isric.org" target="_blank" rel="noopener noreferrer">
            <Image src="/images/isric-logo.svg" alt="ISRIC" width={62} height={100} />
          </a>
        </div>
        <div className="col-6 col-md-3 pr-md-0">
          <a href="https://www.woodwellclimate.org/" target="_blank" rel="noopener noreferrer">
            <Image
              src="/images/wcrc-logo.png"
              alt="Woodwell Climate Research Center"
              width={185}
              height={78}
            />
          </a>
        </div>
      </div>
    </div>
    <p className="mt-4">Designed and developed by:</p>
    <div className="container mt-3">
      <div className="row align-items-center text-center">
        <div className="col-6 col-md-3 pl-md-0">
          <a href="https://www.vizzuality.com/" target="_blank" rel="noopener noreferrer">
            <Image src="/images/vizzuality-logo.svg" alt="Vizzuality" width={147} height={34} />
          </a>
        </div>
      </div>
    </div>
    <h2 className="mt-5 mb-3">Methods in brief</h2>
    <p>
      The historic soil organic carbon changes in agricultural lands are derived using a data-driven
      statistical model and the HYDE historic land-use dataset. Recent changes in soil organic
      carbon stocks are assessed using a UNCCD modified IPCC approach, while future soil organic
      carbon changes are predicted using a spatial implementation of IPCC improved management
      scenarios. In addition, a novel approach was used to model recent soil organic carbon change
      in Argentina as a pilot region. This modelling uses actual soil carbon data from national
      archives, and a statistical space-time method for mapping SOC stocks. A global implementation
      of this approach is on-going. More detailed information about the methods with references to
      the scientific literature is provided in the info buttons for each method under &apos;Explore
      Map&apos;.
    </p>
  </Modal>
);

AboutModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AboutModal;
