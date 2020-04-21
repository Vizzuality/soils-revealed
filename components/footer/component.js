import React, { useState } from 'react';
import { Link } from 'lib/routes';

import Icon from 'components/icon';
import AboutModal from 'components/about-modal';

import './style.scss';

const Footer = () => {
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  return (
    <>
      <AboutModal open={aboutModalOpen} onClose={() => setAboutModalOpen(false)} />
      <footer className="c-footer">
        <div className="container ">
          <div className="row py-4">
            <div className="col-sm-12">
              <nav className="navbar p-0">
                <div className="row align-items-center">
                  <div className="col-6 col-md-2">
                    <Link route="home">
                      <a className="navbar-brand mb-3 mb-md-0 py-0">
                        <Icon name="logo" />
                      </a>
                    </Link>
                  </div>
                  <div className="col-6 col-md-5">
                    <ul className="navbar-nav">
                      <li>
                        <Link to="explore">
                          <a className="nav-link py-0">Explore map</a>
                        </Link>
                      </li>
                      <li>
                        <button
                          type="button"
                          className="nav-link pb-0"
                          onClick={() => setAboutModalOpen(true)}
                        >
                          About us
                        </button>
                      </li>
                      <li>
                        <button type="button" className="nav-link pb-0" disabled>
                          Contact
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div className="col-12 col-md-5 navbar-text text-uppercase">
                    <a
                      href="https://www.nature.org/en-us/about-us/who-we-are/accountability/terms-of-use/"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Terms of service
                    </a>{' '}
                    and{' '}
                    <a
                      href="https://www.nature.org/en-us/about-us/who-we-are/accountability/privacy-policy/"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Privacy policy
                    </a>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
