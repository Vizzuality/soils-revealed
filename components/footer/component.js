import React from 'react';
import { Link } from 'lib/routes';

import footerLinks from './constants';

import './style.scss';

const Footer = () => (
  <div className="c-footer">
    <ul className="footer-cards">
      <div className="container">
        <div className="row">
          {footerLinks.map(link => (
            <div key={link.name} className="col-sm-4">
              <li key={link.name}>
                <h2>{link.name}</h2>
                <Link route={link.route}>
                  <a className="c-button -primary">{link.title}</a>
                </Link>
              </li>
            </div>
          ))}
        </div>
      </div>
    </ul>
  </div>
);

export default Footer;
