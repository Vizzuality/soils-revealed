import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Header from 'components/header';
import Footer from 'components/footer';
import Icons from 'components/icons';

import './style.scss';

const StaticPage = ({ className, children }) => (
  <div className={classNames('l-simple-page', className)}>
    <Header />
    <div className="l-static-page">{children}</div>
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
