import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';

import Modal from 'components/modal';

import './style.scss';

const JoinUsModal = ({ open, onClose }) => (
  <Modal open={open} onClose={onClose} title="Join us" className="c-join-us-modal">
    <h1 className="mb-4">Join us</h1>

    <p>
      Would you like to help us improve Soils Revealed? We need your assistance to expand
      space-time, predictive modelling analyses of SOC stock changes, the{' '}
      <a href="https://doi.org/10.1111/ejss.12998" target="_blank" rel="noopener noreferrer">
        approach piloted for Argentina
      </a>
      , to the whole globe.
    </p>

    <p>
      Please share your field-measured soil data with the Soils Revealed team. Shared data will be
      safeguarded in the ISRIC World Data Centre (WDC)-Soils repository and standardised according
      to the{' '}
      <a
        href="https://essd.copernicus.org/articles/12/299/2020/"
        target="_blank"
        rel="noopener noreferrer"
      >
        WoSIS
      </a>{' '}
      workflow in accord with the license defined by each{' '}
      <a
        href="https://www.isric.org/explore/wosis/wosis-contributing-institutions-and-experts"
        target="_blank"
        rel="noopener noreferrer"
      >
        data provider
      </a>
      .
    </p>

    <p>
      Prospective data contributors may email{' '}
      <a href="mailto:info@soilsrevealed.org" target="_blank" rel="noopener noreferrer">
        info@soilsrevealed.org
      </a>{' '}
      for details on desired formats and{' '}
      <a
        href="/files/data-sharing-agreement-soils-revealed-isric.pdf"
        target="_blank"
        rel="noopener noreferrer"
      >
        licensing
      </a>
      . Upon registration, new data contributors will be acknowledged below with their logo. Thanks
      for sharing your data!
    </p>

    <p>Present data contributors (through WoSIS):</p>
    <div className="container mt-3">
      <div className="row align-items-center text-center">
        <div className="col-6 col-md-3 pl-md-0">
          <a
            href="https://www.isric.org/explore/wosis/wosis-contributing-institutions-and-experts"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/images/join-us-wosis-present-data-contributors.jpg"
              alt="Location of soil profiles provided with the \'WoSIS September 2019 snapshot\'"
              width={200}
              height={100}
            />
          </a>
        </div>
      </div>
    </div>

    <p className="mt-4">New data contributions from:</p>
    <div className="container mt-3">
      <div className="row align-items-center text-center">
        <div className="col-6 col-md-3 pl-md-0 text-left">
          <a href="https://www.argentina.gob.ar/inta" target="_blank" rel="noopener noreferrer">
            <Image
              src="/images/inta-logo.jpg"
              alt="Instituto Nacional de Tecnología Agropecuaria"
              width={75}
              height={75}
            />
          </a>
        </div>
      </div>
    </div>
  </Modal>
);

JoinUsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default JoinUsModal;
