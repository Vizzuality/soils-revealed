import React from 'react';
import { Link } from 'lib/routes';
import Button from 'components/button';

import footerLinks from './constants';

import './style.scss';

const Footer = () => (
  <div className="c-footer">
    <ul className="footer-cards" style={{ backgroundImage: 'url(images/footerBackground.png)' }}>
      <div className="container">
        <div className="row">
          {footerLinks.map(link => (
            <div key={link.name} className="col-sm-4">
              <li key={link.name}>
                <h2>{link.name}</h2>
                <Button className="-primary">
                  <Link route={link.route}>
                    <a>{link.title}</a>
                  </Link>
                </Button>
              </li>
            </div>
          ))}
        </div>
      </div>
    </ul>
  </div>
);

export default Footer;
