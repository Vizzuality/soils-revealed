import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'lib/routes';
import Icon from 'components/icon';
import HeaderContainer from './header-container';

import './style.scss';

const Header = ({ minimal }) => {
  return (
    <header className={['c-header', ...(minimal ? ['-minimal'] : [])].join(' ')}>
      <HeaderContainer minimal={minimal}>
        <nav className="navbar p-0">
          <Link route="home">
            <a className="navbar-brand py-0" aria-label="Soils Revealed">
              <Icon name="logo" />
            </a>
          </Link>
        </nav>
      </HeaderContainer>
    </header>
  );
};

Header.propTypes = {
  pathname: PropTypes.string.isRequired,
  minimal: PropTypes.bool,
};

Header.defaultProps = {
  minimal: false,
};

export default Header;
