import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';

import makeStore from 'lib/store';
import { setRoutes } from 'modules/routes/actions';

import 'css/index.scss';

const SoilsRevealedApp = ({ Component, pageProps, store }) => {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

SoilsRevealedApp.getInitialProps = async ({ Component, router, ctx }) => {
  const { asPath } = router;
  const { req, store, query } = ctx;

  const pathname = req ? asPath : ctx.asPath;

  // We save the route in Redux
  if (pathname) {
    store.dispatch(setRoutes({ pathname, query }));
  }

  const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

  return { pageProps };
};

SoilsRevealedApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.any.isRequired,
  store: PropTypes.any.isRequired,
};

export default withRedux(makeStore)(SoilsRevealedApp);
