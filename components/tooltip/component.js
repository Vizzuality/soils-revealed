import React from 'react';
import PropTypes from 'prop-types';
import ReactTippy from '@tippy.js/react';

import './style.scss';

const Tooltip = props => {
  const mergeProps = {
    interactive: true,
    placement: 'top',
    popperOptions: { modifiers: { flip: { enabled: false } } },
    trigger: 'click',
    arrow: true,
    theme: 'light',
    ...props,
  };
  const { children } = mergeProps;

  return <ReactTippy {...mergeProps}>{children}</ReactTippy>;
};

/** @type {any} */
Tooltip.propTypes = { children: PropTypes.element.isRequired };

export default Tooltip;
