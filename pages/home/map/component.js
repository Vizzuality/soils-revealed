import React from 'react';
import { Link } from 'lib/routes';
import Modal from 'components/modal';
import FootNoteComponent from 'components/foot-note';
import Button from 'components/button';

import './style.scss';

const MapComponent = () => (
  <div className="c-home-map">
    <Modal isOpen={true}>
      <div className="map-background">
        <FootNoteComponent info={{ number: 2, text: 'Discover' }} />
        <h2>Areas to Wacth</h2>
        <p>As well as estimating actual carbon storage, we’ve predicted the potential amount of carbon our soils could hold. Using that, you can see the areas where our action can make the biggest impact. </p>
        <div className="buttons">
          <Button className="-secondary">
            {/* TO DO: change to the correct route when we get it */}
            <Link route='/about'>
              <a>Areas to watch</a>
            </Link>
          </Button>
          <Button className="-primary">
            <Link route='/discover'>
              <a>Discover</a>
            </Link>
          </Button>
        </div>
      </div>
    </Modal>
  </div>
);

export default MapComponent;
