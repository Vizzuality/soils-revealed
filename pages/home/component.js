import React from 'react';
import dynamic from 'next/dynamic';
import { ParallaxProvider } from 'react-scroll-parallax';

import StaticPage from 'layout/static-page';
import Section1 from 'components/homepage/section-1';
import Section2 from 'components/homepage/section-2';
import Section3 from 'components/homepage/section-3';
import Section4 from 'components/homepage/section-4';
import Section5 from 'components/homepage/section-5';
import Section6 from 'components/homepage/section-6';
import Section7 from 'components/homepage/section-7';

import './style.scss';

const DepthVisualization = dynamic(() => import('components/homepage/depth-visualization'), {
  ssr: false,
});

export const DEPTH_ITEMS = [
  {
    title: 'Depth 0-15 cm',
    description: 'Soil Organic Carbon: 498 Pg',
    anchor: 'section-1',
  },
  {
    title: 'Depth 0-30 cm',
    description: 'Soil Organic Carbon: 755 Pg',
    anchor: 'section-2',
  },
  {
    title: 'Depth 0-50 cm',
    description: 'Soil Organic Carbon: 993 Pg',
    anchor: 'section-3',
  },
  {
    title: 'Depth 0-100 cm',
    description: 'Soil Organic Carbon: 1,408 Pg',
    anchor: 'section-4',
  },
  {
    title: 'Depth 0-150 cm',
    description: 'Soil Organic Carbon: 1,778 Pg',
    anchor: 'section-5',
  },
  {
    title: 'Depth 0-200 cm',
    description: 'Soil Organic Carbon: 2,060 Pg',
    anchor: 'section-6',
  },
];

const HomePage = () => (
  <StaticPage className="p-home">
    <ParallaxProvider>
      <Section1 />
      {/* The position of the DepthVisualization component cannot be changed. It needs to be here so
        it seems it belongs to the Section2 component (both the styles of Section1 and Section2 have
        hacks for it to work)
      */}
      <DepthVisualization items={DEPTH_ITEMS} />
      <Section2 configuration={DEPTH_ITEMS[0]} />
      <Section3 configuration={DEPTH_ITEMS[1]} />
      <Section4 configuration={DEPTH_ITEMS[2]} />
      <Section5 configuration={DEPTH_ITEMS[3]} />
      <Section6 configuration={DEPTH_ITEMS[4]} />
      <Section7 configuration={DEPTH_ITEMS[5]} />
    </ParallaxProvider>
  </StaticPage>
);

export default HomePage;
