import React from 'react';
import PropTypes from 'prop-types';
import {
  Accordion as ReactAccordion,
  AccordionItem as ReactAccordionItem,
  AccordionItemHeading as ReactAccordionItemHeading,
  AccordionItemButton as ReactAccordionItemButton,
  AccordionItemPanel as ReactAccordionItemPanel,
} from 'react-accessible-accordion';

import Icon from 'components/icon';

import './style.scss';

const Accordion = ({ multi, expanded, className, onChange, children }) => (
  <ReactAccordion
    allowMultipleExpanded={multi}
    allowZeroExpanded
    preExpanded={expanded}
    className={['c-accordion', ...(className ? [className] : [])].join(' ')}
    onChange={onChange}
  >
    {children}
  </ReactAccordion>
);

Accordion.propTypes = {
  multi: PropTypes.bool,
  expanded: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
  onChange: PropTypes.func,
  children: PropTypes.node.isRequired,
};

Accordion.defaultProps = {
  multi: true,
  expanded: undefined,
  className: undefined,
  onChange: undefined,
};

const AccordionItem = ({ id, children }) => (
  <ReactAccordionItem uuid={id} className="item">
    {children}
  </ReactAccordionItem>
);

AccordionItem.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const AccordionTitle = ({ 'aria-level': ariaLevel, children }) => (
  <ReactAccordionItemHeading aria-level={ariaLevel} className="title">
    <ReactAccordionItemButton className="button">
      {children}
      <Icon name="bottom-arrow" />
    </ReactAccordionItemButton>
  </ReactAccordionItemHeading>
);

AccordionTitle.propTypes = {
  'aria-level': PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
};

const AccordionPanel = ({ children }) => (
  <ReactAccordionItemPanel className="panel">{children}</ReactAccordionItemPanel>
);

AccordionPanel.propTypes = {
  children: PropTypes.node.isRequired,
};

export { Accordion, AccordionItem, AccordionTitle, AccordionPanel };
