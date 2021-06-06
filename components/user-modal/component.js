import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import Modal from 'components/modal';

import { createUserEntry, updateUserEntry } from 'utils/airtable';

import Step1 from './content/step1';
import Step2 from './content/step2';

import './style.scss';

const UserModal = ({ open, onClose }) => {
  const [step, setStep] = useState('step1');
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState({
    job_role: '',
    job_role_description: '',
    map_usage: '',
    map_usage_description: '',
    email: '',
  });
  const [userEntryError, setCreateUserEntryError] = useState(null);

  const handleCreateUser = async e => {
    e.preventDefault();
    try {
      const user = await createUserEntry({ ...userData });
      setUserId(user[0].id);
      setStep('step2');
    } catch (e) {
      setCreateUserEntryError(e.message);
    }
  };

  const handleUpdateUser = async e => {
    e.preventDefault();
    try {
      await updateUserEntry(userId, userData);
      onClose();
    } catch (e) {
      setCreateUserEntryError(e.message);
    }
  };

  const userDataUpdate = useCallback(
    (key, value) => {
      if (key === 'job_role_description') {
        setUserData({
          ...userData,
          job_role: 'other',
          [key]: value,
        });
      } else if (key === 'map_usage_description') {
        setUserData({
          ...userData,
          map_usage: 'other',
          [key]: value,
        });
      } else setUserData({ ...userData, [key]: value });
    },
    [userData]
  );

  return (
    <Modal open={open} onClose={onClose} title="User details" className="c-user-modal">
      {step === 'step1' && (
        <Step1
          key="step1"
          user={userId}
          userData={userData}
          handleUserData={userDataUpdate}
          onClick={handleCreateUser}
          error={userEntryError}
        />
      )}
      {step === 'step2' && (
        <Step2
          key="step2"
          userData={userData}
          handleUserData={userDataUpdate}
          onClick={handleUpdateUser}
          error={userEntryError}
        />
      )}
    </Modal>
  );
};

UserModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UserModal;
