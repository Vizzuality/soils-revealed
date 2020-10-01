import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Head from 'components/head';
import Header from 'components/header';
import Footer from 'components/footer';

import Icons from 'components/icons';

import './style.scss';

const StaticPage = ({ className, children }) => (
  <div className={classNames('l-static-page', className)}>
    <Head />
    <Header />
    <main>{children}</main>
    <Footer />
    <Icons />
  </div>
);

StaticPage.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

StaticPage.defaultProps = { className: null };

export default StaticPage;
