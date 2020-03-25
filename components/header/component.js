import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'lib/routes';
import Icon from 'components/icon';

import './style.scss';

const Header = () => (
  <header className="c-header">
    <div className="container ">
      <div className="row">
        <div className="col-sm-12">
          <nav className="navbar p-0">
            <Link route="home">
              <a className="navbar-brand py-0">
                <Icon name="logo" />
              </a>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  </header>
);

Header.propTypes = {
  pathname: PropTypes.string.isRequired,
};

export default Header;
