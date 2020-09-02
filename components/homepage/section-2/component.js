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
        <div className="col-sm-12 col-md-8 offset-md-2 text-right mt-4 mt-lg-5">
          <svg viewBox="0 0 671 203" className="visualization">
            <defs>
              <pattern
                id="b"
                width="19.932"
                height="19.932"
                x="-19.932"
                y="-19.932"
                patternUnits="userSpaceOnUse"
              >
                <use xlinkHref="#a" transform="scale(.4983)" />
              </pattern>
              <image
                id="a"
                width="40"
                height="40"
                xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABGdBTUEAALGN5fIAKQAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAKKADAAQAAAABAAAAKAAAAABZLkSWAAABQUlEQVRYCe2X2xHCIBBFs1RiMVbiWJZjJRZjJcEszu6EJMDySNgP8hMkeDi5iABMgstaC/P385pm++DmBt7mdn8CgOU6YSGHBylmDizFwue5vKhgLiwlWMILCpbAYoKlvEPBUlhIsIa3E6yBHQnW8jzBWthWsAWPBVvA1oKteE6wFYwEW/KgJQwFW/NMrxWC0o7d8WVNj+UrJkXPaCQMVUwXra3cX6RAchjeX1CpHL6D0ZocBexm8dlbJuosdl8PK7dbRpb/qLlSUAjBTtkfCny8JpfKLZvhrASvlsNkxII95MSCveREgj3lkoK95aKCGuSCglrkDgU1ye0Etcl5ghrlWFCrnBPULIeC40xSuwUbZxL8HeVc2zkxziTS9LbJue+NM4kgvlByNPvFW37sKwUT+HhNJDyxoATm9Z74IOX9ADNrcsT1gAKIAAAAAElFTkSuQmCC"
              />
              <path d="M535.346 118.5H222" id="d" />
              <filter
                x="-1.8%"
                y="-500%"
                width="103.5%"
                height="1100%"
                filterUnits="objectBoundingBox"
                id="c"
              >
                <feMorphology
                  radius="3"
                  operator="dilate"
                  in="SourceAlpha"
                  result="shadowSpreadOuter1"
                />
                <feOffset in="shadowSpreadOuter1" result="shadowOffsetOuter1" />
                <feMorphology radius="3.5" in="SourceAlpha" result="shadowInner" />
                <feOffset in="shadowInner" result="shadowInner" />
                <feComposite
                  in="shadowOffsetOuter1"
                  in2="shadowInner"
                  operator="out"
                  result="shadowOffsetOuter1"
                />
                <feColorMatrix
                  values="0 0 0 0 0.529411765 0 0 0 0 0.203921569 0 0 0 0 0.117647059 0 0 0 1 0"
                  in="shadowOffsetOuter1"
                />
              </filter>
              <path d="M484.346 42.5H221" id="f" />
              <filter
                x="-2.1%"
                y="-500%"
                width="104.2%"
                height="1100%"
                filterUnits="objectBoundingBox"
                id="e"
              >
                <feMorphology
                  radius="3"
                  operator="dilate"
                  in="SourceAlpha"
                  result="shadowSpreadOuter1"
                />
                <feOffset in="shadowSpreadOuter1" result="shadowOffsetOuter1" />
                <feMorphology radius="3.5" in="SourceAlpha" result="shadowInner" />
                <feOffset in="shadowInner" result="shadowInner" />
                <feComposite
                  in="shadowOffsetOuter1"
                  in2="shadowInner"
                  operator="out"
                  result="shadowOffsetOuter1"
                />
                <feColorMatrix
                  values="0 0 0 0 0.529411765 0 0 0 0 0.203921569 0 0 0 0 0.117647059 0 0 0 1 0"
                  in="shadowOffsetOuter1"
                />
              </filter>
            </defs>
            <g fill="none" fillRule="evenodd">
              <g transform="translate(469 1)" stroke="#FDDDBA" strokeWidth="2">
                <circle fillOpacity=".5" fill="url(#b)" cx="100.5" cy="100.5" r="100.5" />
                <circle fill="#87341E" cx="100.5" cy="155.5" r="45.5" />
              </g>
              <text
                fontFamily="RobotoMono-Medium, Roboto Mono Medium"
                fontSize="14"
                transform="translate(0 1)"
              >
                <tspan x="0" y="123" fill="#FFF">
                  Carbon in the Atmosphere:{' '}
                </tspan>{' '}
                <tspan x="0" y="143" fill="#FDE1C2">
                  860 billion tons
                </tspan>
              </text>
              <text
                fontFamily="RobotoMono-Medium, Roboto Mono Medium"
                fontSize="14"
                transform="translate(0 1)"
              >
                <tspan x="0" y="47" fill="#FFF">
                  Organic Carbon in Soils:{' '}
                </tspan>{' '}
                <tspan x="0" y="67" fill="#FDE5C9">
                  2400 billion tons / 0-200 cm
                </tspan>
              </text>
              <g strokeDasharray="3,3" transform="translate(0 1)">
                <use fill="#000" filter="url(#c)" xlinkHref="#d" />
                <use stroke="#FDDDBA" xlinkHref="#d" />
              </g>
              <g strokeDasharray="3,3" transform="translate(0 1)">
                <use fill="#000" filter="url(#e)" xlinkHref="#f" />
                <use stroke="#FDDDBA" xlinkHref="#f" />
              </g>
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
