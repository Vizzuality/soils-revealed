import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Head from 'components/head';
import Header from 'components/header';
import Icons from 'components/icons';
import { Icons as VizzIcons } from 'vizzuality-components';

import './style.scss';

const FullscreenPage = ({ className, children }) => (
  <div className={classNames('l-fullscreen-page', className)}>
    <Head />
    <Header minimal />
    <main>{children}</main>
    <Icons />
    <VizzIcons />
  </div>
);

FullscreenPage.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

FullscreenPage.defaultProps = { className: null };

export default FullscreenPage;
