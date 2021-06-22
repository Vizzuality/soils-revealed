import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Radio from 'components/forms/radio';

import { userTypeOptions, useTypeOptions } from './constants';

const Step1 = ({ onClick, userData, handleUserData, error }) => (
  <form onSubmit={e => onClick(e)}>
    <h1 className="h4 mb-4">Can you tell us a bit about yourself?</h1>
    <p className="h5 mt-4">
      In which sector do you work: * (pick the one that brought you to this map)
    </p>
    <div className="form-group user-modal-radio-input-container">
      {userTypeOptions.map(option => (
        <Fragment key={option.slug}>
          <Radio
            key={option.slug}
            id={`job-role-${option.slug}`}
            className="mr-4"
            name="job-role"
            checked={option.slug === (userData.job_role || userData.job_role_description)}
            onChange={() => handleUserData('job_role', option.slug)}
            required
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
                aria-label="insert your profession"
                disabled={option.slug !== 'other'}
                value={userData.job_role_description}
                onChange={({ currentTarget }) =>
                  handleUserData('job_role_description', currentTarget.value)
                }
                required={userData.job_role_description === 'other'}
              />
            </>
          )}
        </Fragment>
      ))}
    </div>

    <p className="h5 mt-4">
      Please tell us what you are using Soils platform for: <sup>*</sup>
    </p>

    <div className="form-group user-modal-radio-input-container">
      {useTypeOptions.map(option => (
        <Fragment key={option.slug}>
          <Radio
            key={option.slug}
            id={`map_usage-${option.slug}`}
            className="mr-4"
            name="map-usage"
            checked={option.slug === userData.map_usage}
            onChange={() => handleUserData('map_usage', option.slug)}
            required
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
                aria-label="insert your profession"
                disabled={option.slug !== 'other'}
                onChange={e => handleUserData('map_usage_description', e.currentTarget.value)}
                required={userData.map_usage === 'other'}
              />
            </>
          )}
        </Fragment>
      ))}
    </div>
    <div className="container mt-3">
      <div className="row">
        <div className="col-sm-12 text-left mb-3">
          <p className="user-modal-content-note">*required fields</p>
        </div>
      </div>
    </div>

    {error && (
      <p className="alert alert-danger" role="alert">
        Unable to create user entry, please try again.
      </p>
    )}
    <div className="container mt-3">
      <div className="row">
        <div className="col-sm-12 text-center mb-3">
          <button
            type="submit"
            className="btn btn-primary btn-fixed-width"
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
  </form>
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
  user: PropTypes.string,
  error: PropTypes.string,
};

Step1.defaultProps = {
  user: null,
  error: null,
};

export default Step1;
