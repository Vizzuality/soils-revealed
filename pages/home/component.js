import React from 'react';
import StaticPage from 'layout/static-page';
import IntroComponent from './intro';

const HomePage = () => (
  <StaticPage className="p-home">
    <IntroComponent />
  </StaticPage>
);

export default HomePage;
