import React from 'react';
import SectionTitle from 'components/section-title';

import './style.scss';

const IntroComponent = () => (
  <div className="p-home-intro">
    <div className="container">
      <div className="intro-title">
        <div className="row">
          <div className="col-sm-11">
            <h1>Soil carbon can help combat climate change.</h1>
          </div>
          <div className="col-sm-10">
            <p>
              Soils Revealed can help you find places with the greatest potential to increase soil
              organic carbon and advance food security, water quality and climate action.
            </p>
          </div>
        </div>
      </div>
      <div className="row">
        <SectionTitle info={{ index: 1, text: 'Why soil carbon?' }} />
      </div>
      <div className="intro-description">
        <div className="row">
          <div className="col-sm-8">
            <p className="lead-text">
              Did you know? Glogally, soils, hold at least two trillion tonnes of organic carbon;
              around three times as much as the atmosphere.
            </p>
          </div>
          <div className="col-sm-4">
            <p>
              But due to agriculture, the world’s soils have lost 130 billion tons of organic
              carbon. That means more carbon in the atmosphere, less productive soil for crops to
              grow in, and reduced ability for soil to clean water.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default IntroComponent;
