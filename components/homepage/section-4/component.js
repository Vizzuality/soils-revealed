import React from 'react';
import PropTypes from 'prop-types';
import { Parallax } from 'react-scroll-parallax';
import Image from 'next/image';

import './style.scss';

const Section4 = ({ configuration }) => (
  <section id={configuration.anchor} className="c-homepage-section-4">
    <div className="container">
      <div className="row">
        <div className="col-sm-12">
          <div className="section-title">{configuration.title}</div>
          <div className="section-description">{configuration.description}</div>
        </div>
        <div className="col-sm-12 col-md-9 offset-md-2 intro">
          That means more carbon in the atmosphere, less productive soil for crops to grow in, and
          reduced ability for soil to retain water.
        </div>
        <div className="col-sm-12 col-md-9 offset-md-2 image">
          <Parallax y={['100px', '-100px']}>
            <Image
              src="/images/homepage-section-4-image.png"
              alt="Illustration of the soils layers"
              width={750}
              height={696}
              layout="responsive"
            />
          </Parallax>
        </div>
      </div>
    </div>
  </section>
);

Section4.propTypes = {
  id: PropTypes.string,
  configuration: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    anchor: PropTypes.string.isRequired,
  }).isRequired,
};

export default Section4;
