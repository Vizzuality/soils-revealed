import React from 'react';
import PropTypes from 'prop-types';

import Radio from 'components/forms/radio';

import { userTypeOptions, useTypeOptions } from './constants';

const Step1 = ({ onClick, userData, handleUserData, user }) => (
  <section>
    <h4 className="mb-4">Can you tell us a bit about yourself?</h4>
    <h5 className="mt-4">
      In which sector do you work: * (pick the one that brought you to this map)
    </h5>
    <div className="form-group user-modal-radio-input-container">
      {userTypeOptions.map(option => (
        <>
          <Radio
            key={option.slug}
            id={`job-role-${option.slug}`}
            className="mr-4"
            name="job-role"
            checked={option.slug === (userData.job_role || userData.job_role_description)}
            onChange={() => handleUserData('job_role', option.slug)}
          >
            {option.label}
          </Radio>
          {option.slug === 'other' && (
            <>
              <input
                type="text"
                id="job_role_description"
                name="job_role_description"
                className="user-modal-text-input"
                placeholder="insert your profession"
                disabled={option.slug !== 'other'}
                value={userData.job_role_description}
                onChange={({ currentTarget }) =>
                  handleUserData('job_role_description', currentTarget.value)
                }
                required={userData.job_role_description === 'other'}
              />
              <label aria-label="hidden" className="visually-hidden">
                job role description
              </label>
            </>
          )}
        </>
      ))}
    </div>

    <h5 className="mt-4">
      Please tell us what you are using Soils platform for: <sup>*</sup>
    </h5>

    <div className="form-group user-modal-radio-input-container">
      {useTypeOptions.map(option => (
        <>
          <Radio
            key={option.slug}
            id={`map_usage-${option.slug}`}
            className="mr-4"
            name="map-usage"
            checked={option.slug === userData.map_usage}
            onChange={() => handleUserData('map_usage', option.slug)}
          >
            {option.label}
          </Radio>
          {option.slug === 'other' && (
            <>
              <input
                type="text"
                id="map_usage_description"
                name="map_usage_description"
                className="user-modal-text-input"
                value={userData.map_usage_description}
                placeholder="insert your profession"
                disabled={option.slug !== 'other'}
                onChange={e => handleUserData('map_usage_description', e.currentTarget.value)}
                required={userData.map_usage === 'other'}
              />
              <label aria-label="hidden" className="visually-hidden">
                jmap usage description
              </label>
            </>
          )}
        </>
      ))}
    </div>
    <div className="container mt-3">
      <div className="row">
        <div className="col-sm-12 text-left mb-3">
          <p className="user-modal-content-note">*required fields</p>
        </div>
      </div>
    </div>

    <div className="container mt-3">
      <div className="row">
        <div className="col-sm-12 text-center mb-3">
          <button
            type="button"
            className="btn btn-primary btn-fixed-width"
            onClick={() => onClick(userData, user)}
            disabled={
              userData.job_role === '' ||
              (userData.job_role === 'other' && userData.job_role.description === '') ||
              userData.map_usage === '' ||
              (userData.map_usage === 'other' && userData.map_usage.description === '')
            }
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </section>
);

Step1.propTypes = {
  onClick: PropTypes.func.isRequired,
  handleUserData: PropTypes.func.isRequired,
  userData: PropTypes.shape({
    job_role: PropTypes.string,
    job_role_description: PropTypes.string,
    map_usage: PropTypes.string,
    map_usage_description: PropTypes.string,
    email: PropTypes.string,
  }),
  user: PropTypes.string.isRequired,
};

export default Step1;
