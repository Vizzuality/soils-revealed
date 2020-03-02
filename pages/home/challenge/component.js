import React from 'react';
import SectionTitle from 'components/section-title';
import Icon from 'components/icon';

import './style.scss';

const Challenge = () => (
  <div className="p-home-challenge">
    <div className="container">
      <div className="row">
        <SectionTitle info={{ index: 2, text: 'Main challenge' }} />
      </div>
      <div className="row">
        <div className="col-sm-8">
          <div className="description">
            <h2>
              Changing how we manage our soils, to increase the amount of organic carbon stored,
              could be{' '}
              <span>
                one important and immediately actionable way to limit Climate Change, increase Food
                Security and improve Water Quality.
              </span>
            </h2>
            <Icon name="search" className="-big" />
          </div>
        </div>
        <div className="col-sm-4">
          <div className="contact">
            <Icon name="arrow-right" className="-big" />
            <h2>will you join us?</h2>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Challenge;
