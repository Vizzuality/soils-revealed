import React, { useState, useCallback } from 'react';
import { Parallax } from 'react-scroll-parallax';
import Image from 'next/image';

import { Link } from 'lib/routes';
import { logEvent } from 'utils/analytics';
import AboutModal from 'components/about-modal';
import JoinUsModal from 'components/join-us-modal';

import './style.scss';

const Section1 = () => {
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [joinUsModalOpen, setJoinUsModalOpen] = useState(false);

  const onClickExplore = useCallback(() => {
    logEvent('Homepage', 'click on calls to action buttons', 'explore map (top of page)');
  }, []);

  const onClickAbout = useCallback(() => {
    logEvent('Homepage', 'click on calls to action buttons', 'about us (top of page)');
    setAboutModalOpen(true);
  }, [setAboutModalOpen]);

  const onClickJoinUs = useCallback(() => {
    logEvent('Homepage', 'click on calls to action buttons', 'join us (top of page)');
    setJoinUsModalOpen(true);
  }, [setJoinUsModalOpen]);

  return (
    <>
      <AboutModal open={aboutModalOpen} onClose={() => setAboutModalOpen(false)} />
      <JoinUsModal open={joinUsModalOpen} onClose={() => setJoinUsModalOpen(false)} />
      <section className="c-homepage-section-1">
        <div className="scroll-text-container">
          <div className="container text-center">
            <div className="row mb-5">
              <div className="col title">Soil carbon can help combat climate change.</div>
            </div>
            <div className="row mb-4">
              <div className="col intro">
                We are tracking soil carbon change and have predicted the potential amount of carbon
                our soils could hold. Using that, you can see the areas where action can make the
                biggest impact.
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-sm-12 col-md-auto mb-3 mb-md-0">
                <Link to="explore">
                  <a className="btn btn-primary btn-fixed-width" onClick={onClickExplore}>
                    Explore map
                  </a>
                </Link>
              </div>
              <div className="col-sm-12 col-md-auto mb-3 mb-md-0">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-fixed-width"
                  onClick={onClickAbout}
                >
                  About us
                </button>
              </div>
              <div className="col-sm-12 col-md-auto">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-fixed-width"
                  onClick={onClickJoinUs}
                >
                  Join us
                </button>
              </div>
            </div>
          </div>
          <div className="scroll-text">
            <Parallax y={['20px', '-20px']}>
              <Image
                src="/images/shovel-arrow.svg"
                alt="Bottom arrow"
                width={22}
                height={62}
                layout="fixed"
                className="shovel-image"
              />
            </Parallax>
            <span className="ml-3 text-left">Scroll to discover</span>
          </div>
        </div>
      </section>
    </>
  );
};

export default Section1;
