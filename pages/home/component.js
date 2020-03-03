import React from 'react';

import StaticPage from 'layout/static-page';
import Intro from './intro';
import Challenge from './challenge';
import Map from './map';
import Images from './images';

const HomePage = () => (
  <StaticPage className="p-home">
    <Intro />
    <Challenge />
    <Map />
    <Images />
  </StaticPage>
);

export default HomePage;
