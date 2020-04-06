import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

import Icon from 'components/icon';

import './style.scss';

ReactModal.setAppElement('#root');

const Modal = ({ open, onClose, title, children, className }) => (
  <ReactModal
    isOpen={open}
    onRequestClose={onClose}
    contentLabel={title}
    className={['c-modal', ...(className ? [className] : [])].join(' ')}
  >
    <button type="button" className="btn btn-outline-primary close-button" onClick={onClose}>
      <Icon name="close" />
    </button>
    <div className="content">{children}</div>
  </ReactModal>
);

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Modal.defaultProps = {
  className: null,
};

export default Modal;
