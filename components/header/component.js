import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'lib/routes';
import classNames from 'classnames';

import './style.scss';

const Header = ({ pathname }) => (
  <header className="l-header">
    <div className="container ">
      <div className="row">
        <div className="col-sm-12 col-md-10 offset-md-1">
          <nav className="navbar navbar-expand-md">
            <Link route="home">
              <a className={classNames('nav-link', pathname === '/' ? '-active' : null)}>
                Soils Revealed
              </a>
            </Link>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link route="about">
                    <a
                      className={classNames(
                        'nav-link',
                        pathname.startsWith('/about') ? '-active' : null
                      )}
                    >
                      About
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
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
