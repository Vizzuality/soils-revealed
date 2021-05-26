import React from 'react';
import PropTypes from 'prop-types';

const Step2 = ({ userData, handleUserData, onClick }) => (
  <section>
    <h2 className="mb-4 text-center">Thank you!</h2>
    <div className="text-size-base">
      <p>Would you like to hep us to improve this map?</p>
      <p>
        Feedback is really important to us. If you´d like to provide your opinion, write down your
        email and we might invite you for a one-to-one chat session.
      </p>
    </div>
    <div className="user-modal-input">
      <div className="form-group mt-3">
        <input
          type="email"
          id="email"
          // aria-label="insert your email"
          className="form-control user-modal-text-input"
          placeholder="insert your email"
          value={userData.email}
          onChange={({ currentTarget }) => handleUserData('email', currentTarget.value)}
        />
        <label aria-label="hidden" className="visually-hidden">
          email
        </label>
      </div>
      <div className="user-modal-content-note text-center">
        <p>
          Your email address will be used by Simbiotica SL DBA Vizzuality on behalf of The Nature
          Conservancy. We will only be using your email address to contact you in order to conduct
          user research on this website.Your email will not be shared with any thirsd parties. For
          more information and instructions on exercisong your rights on this data please read our{' '}
          <a
            href="https://www.nature.org/en-us/about-us/who-we-are/accountability/privacy-policy/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Privacy policy
          </a>
        </p>
      </div>

      <div className="container mt-3">
        <div className="row">
          <div className="col-sm-12 text-center mb-3">
            <button type="button" className="btn btn-primary btn-fixed-width" onClick={onClick}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

Step2.propTypes = {
  onClick: PropTypes.func.isRequired,
  handleUserData: PropTypes.func.isRequired,
  userData: PropTypes.shape({
    job_role: PropTypes.string,
    job_role_description: PropTypes.string,
    map_usage: PropTypes.string,
    map_usage_description: PropTypes.string,
    email: PropTypes.string,
  }),
};

export default Step2;
