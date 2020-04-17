import React from 'react';

import { useDesktop } from 'utils/hooks';
import FullscreenMessage from './fullscreen-message';

import './style.scss';

const Explore = () => {
  const isDesktop = useDesktop();

  return (
    <div className="c-explore">
      {isDesktop ? (
        <FullscreenMessage>Coming soon!</FullscreenMessage>
      ) : (
        <FullscreenMessage>
          This page contains interactive elements (including a map) which are best viewed on a
          larger screen. Please consider accessing it from a computer.
        </FullscreenMessage>
      )}
    </div>
  );
};

export default Explore;
