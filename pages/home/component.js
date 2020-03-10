import React from 'react';

import StaticPage from 'layout/static-page';
import Intro from './intro';
import Challenge from './challenge';

const HomePage = () => (
  <StaticPage className="p-home">
    <Intro />
    <Challenge />
  </StaticPage>
);

export default HomePage;
