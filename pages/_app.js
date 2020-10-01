import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';

import { Router } from 'lib/routes';
import createStore from 'lib/store';
import { updateRoute } from 'modules/routing';
import { logPageView } from 'utils/analytics';
import CookiesNotice from 'components/cookies-notice';
import Analytics from 'components/analytics';

import 'css/index.scss';

const SoilsRevealedApp = ({ Component, pageProps, store }) => {
  useEffect(() => {
    Router.onRouteChangeComplete = () => logPageView();
  }, []);

  return (
    <Provider store={store}>
      {/* The cookies notice must be the first element on the page */}
      <CookiesNotice />
      <Component {...pageProps} />
      <Analytics />
    </Provider>
  );
};

SoilsRevealedApp.getInitialProps = async ({ Component, router, ctx }) => {
  const { asPath } = router;
  const { req, query, store } = ctx;

  const pathname = req ? asPath : ctx.asPath;

  // We save the route in Redux
  if (pathname) {
    store.dispatch(updateRoute({ pathname, query }));
  }

  const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

  return { pageProps };
};

SoilsRevealedApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.any.isRequired,
  store: PropTypes.any.isRequired,
};

export default withRedux(createStore)(SoilsRevealedApp);
