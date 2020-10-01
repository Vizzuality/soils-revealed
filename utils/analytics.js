import ReactGA from 'react-ga';

let gaInitialiazed = false;
let previousPage = null;

export const initGA = () => {
  if (gaInitialiazed) {
    return;
  }

  if (process.env.NODE_ENV === 'production') {
    if (process.env.GOOGLE_ANALYTICS_KEY) {
      ReactGA.initialize(process.env.GOOGLE_ANALYTICS_KEY);
      gaInitialiazed = true;
    } else {
      console.error('Google analytics key missing.');
    }
  } else {
    console.info('[GA] Init');
    gaInitialiazed = true;
  }
};

export const logPageView = () => {
  if (!gaInitialiazed) {
    return;
  }

  const page = window.location.pathname;

  if (process.env.NODE_ENV === 'production') {
    if (process.env.GOOGLE_ANALYTICS_KEY && previousPage !== page) {
      ReactGA.set({ page });
      ReactGA.pageview(page);
      previousPage = page;
    }
  } else {
    if (previousPage !== page) {
      console.log(`[GA] Page view: ${page}`);
      previousPage = page;
    }
  }
};

export const logEvent = (category = '', action = '', label = '') => {
  if (!gaInitialiazed) {
    return;
  }

  if (process.env.NODE_ENV === 'production') {
    if (process.env.GOOGLE_ANALYTICS_KEY && category && action) {
      ReactGA.event({ category, action, ...(label ? { label } : {}) });
    }
  } else {
    console.info(`[GA] Event: ${category}, ${action}, ${label}`);
  }
};

export default {
  initGA,
  logPageView,
  logEvent,
};
