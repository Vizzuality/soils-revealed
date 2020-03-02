import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'lib/routes';
import classNames from 'classnames';
import Icon from 'components/icon';

import headerLinks from './constants';

import './style.scss';

const Header = ({ pathname }) => (
  <header className="c-header">
    <div className="container ">
      <div className="row">
        <div className="col-sm-12">
          <nav className="navbar navbar-expand-md">
            <Link route="home">
              <a className="nav-link">
                <img src="/images/logo.png" alt="Soils Reavealed logo" />
              </a>
            </Link>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav ml-auto">
                {headerLinks &&
                  headerLinks.map(link => (
                    <li
                      key={link.name}
                      className={classNames(
                        'nav-item',
                        link.children ? 'dropdown' : null,
                        pathname.startsWith(link.path) ? '-active' : null
                      )}
                    >
                      {!link.children ? (
                        <Link route={link.route}>
                          <a className="nav-link">{link.name}</a>
                        </Link>
                      ) : (
                        <div className="dropdown-container">
                          <span
                            className={classNames(
                              'nav-link',
                              pathname.startsWith(link.path) ? '-active' : null
                            )}
                          >
                            {link.name}
                          </span>

                          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            {link.children.map(child => (
                              <Link
                                key={child.name}
                                route={child.route}
                                params={{ tab: child.tab }}
                              >
                                <a className="nav-link">{child.name}</a>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
              </ul>
              <div className="nav-item login">
                <Icon name="login" />
              </div>
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
