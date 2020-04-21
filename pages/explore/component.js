import React from 'react';

import FullscreenPage from 'layout/fullscreen-page';
import Head from 'components/head';
import Explore from 'components/explore';

import './style.scss';

const ExplorePage = () => (
  <FullscreenPage className="p-explore">
    <Head title="Explore" />
    <Explore />
  </FullscreenPage>
);

export default ExplorePage;
