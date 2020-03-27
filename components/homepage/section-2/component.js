import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const Section2 = ({ configuration }) => (
  <section id={configuration.anchor} className="c-homepage-section-2">
    <div className="container">
      <div className="row">
        <div className="col-sm-12">
          <div className="section-title">{configuration.title}</div>
          <div className="section-description">{configuration.description}</div>
        </div>
        <div className="col-sm-12 col-md-8 offset-md-2 intro">
          Did you know? Globally, soils hold at least two trillion tonnes of organic carbon; around
          three times as much as the atmosphere.
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12 col-md-8 offset-md-2 text-right mt-2">
          <svg width="547" height="203" className="visualization">
            <defs>
              <pattern id="b" width="20" height="20" x="-20" y="-20" patternUnits="userSpaceOnUse">
                <use xlinkHref="#a" transform="scale(.5)" />
              </pattern>
              <image
                id="a"
                width="40"
                height="40"
                xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABGdBTUEAALGN5fIAKQAAAOJJREFUWAntl+EJwyAUhLUjlM7TDtE5O0Q6T2aozQsGAvJQ65dS6PknEJ/HeZ+ihtDR0vNyS9N5tm/HMLcU1UPFFsuoHiomc+6KqnegJFAxYa3TcytQEqiYsLrQ6h0oCVSMxmpZ/OzZmie7nolmdLQdRSKOGrPxZi6k1yPE0z1e52lUc683qsXeSvJksWV3FNY1wdHoZO7TBJWckmtIAF0mqNhiHtVDxWSuYW15JSgJVExYPWYN/1ESqNhfYTVS2OWQTi7r6U1ilHqb7YntjdM7tqjXBisiafyh5BqDKsq+ndwb1zckkQuos6sAAAAASUVORK5CYII="
              />
            </defs>
            <g fill="none" fillRule="evenodd">
              <g transform="translate(345 1)" stroke="#FFC112" strokeWidth="2">
                <circle fill="url(#b)" cx="100.5" cy="100.5" r="100.5" />
                <circle fill="#87341E" cx="100.5" cy="155.5" r="45.5" />
              </g>
              <text transform="translate(-7 1)">
                <tspan x="39" y="123">
                  Carbon in the Atmosphere:{' '}
                </tspan>{' '}
                <tspan x="107.578" y="143">
                  860 billion tons
                </tspan>
              </text>
              <text transform="translate(-7 1)">
                <tspan x="40.367" y="47">
                  Organic Carbon in Soils:{' '}
                </tspan>{' '}
                <tspan x="6.762" y="67">
                  2400 billion tons / 0-200 cm
                </tspan>
              </text>
              <path strokeWidth="2" d="M348.346 53H244M399.346 129H245" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  </section>
);

Section2.propTypes = {
  id: PropTypes.string,
  configuration: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    anchor: PropTypes.string.isRequired,
  }).isRequired,
};

export default Section2;
