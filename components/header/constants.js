const headerLinks = [
  {
    name: 'EXPLORE',
    route: 'explore',
    path: '/explore',
    children: false,
  },
  {
    name: 'DISCOVER',
    route: 'discover',
    path: '/discover',
    children: false,
  },
  {
    name: 'NARRATIVES',
    route: 'narratives',
    path: '/narratives',
    children: [
      {
        name: 'PROJECTS',
        route: 'narratives',
        path: '/narratives',
        tab: 'projects',
      },
      {
        name: 'INSIGHTS',
        route: 'narratives',
        path: '/narratives',
        tab: 'insights',
      },
    ],
  },
  {
    name: 'GET INVOLVED',
    route: 'get-involved',
    path: '/get-involved',
    children: false,
  },
  {
    name: 'ABOUT',
    route: 'about',
    path: '/about',
    children: [
      {
        name: "FAQ'S",
        route: 'about',
        path: '/about',
        tab: 'faqs',
      },
      {
        name: 'CONTACT US',
        route: 'about',
        path: '/about',
        tab: 'contact-us',
      },
    ],
  },
];

export default headerLinks;
