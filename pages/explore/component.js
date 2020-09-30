import React from 'react';

import FullscreenPage from 'layout/fullscreen-page';
import Head from 'components/head';
import Explore from 'components/explore';

import './style.scss';

const ExplorePage = () => (
  <FullscreenPage className="p-explore">
    <Head
      title="Explore"
      description="Soils Revealed platform is an interface that allows direct visualization and analysis of global historic and recent soil organic carbon (SOC) change and shows predictions for future changes, in order to support a sustainable ecosystem management."
    />
    <Explore />
  </FullscreenPage>
);

export default ExplorePage;
