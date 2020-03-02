import React from 'react';

import StaticPage from 'layout/static-page';
import Intro from './intro';
import Challenge from './challenge';
import Map from './map';

const HomePage = () => (
  <StaticPage className="p-home">
    <Intro />
    <Challenge />
    <Map />
  </StaticPage>
);

export default HomePage;
