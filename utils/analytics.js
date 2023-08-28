let previousPage = null;

export const logPageView = () => {
  if (!window['gtag']) {
    return;
  }

  const page = window.location.pathname;

  if (process.env.NODE_ENV === 'production') {
    if (process.env.GOOGLE_ANALYTICS_KEY && previousPage !== page) {
      window.gtag('config', process.env.GOOGLE_ANALYTICS_KEY, {
        page_path: page,
      });
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
  if (!window['gtag']) {
    return;
  }

  if (process.env.NODE_ENV === 'production') {
    if (process.env.GOOGLE_ANALYTICS_KEY && category && action) {
      window.gtag('event', category, { action, label });
    }
  } else {
    console.info(`[GA] Event: ${category}, ${action}, ${label}`);
  }
};

export default {
  logPageView,
  logEvent,
};
