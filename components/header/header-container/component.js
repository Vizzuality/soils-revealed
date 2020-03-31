import React from 'react';
import PropTypes from 'prop-types';

const HeaderContainer = ({ minimal, children }) => {
  if (minimal) {
    return <>{children}</>;
  }
  return (
    <div className="container ">
      <div className="row">
        <div className="col-sm-12">{children}</div>
      </div>
    </div>
  );
};

HeaderContainer.propTypes = {
  minimal: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired,
};

export default HeaderContainer;
