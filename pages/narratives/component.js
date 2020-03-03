import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'lib/routes';
import classnames from 'classnames';
import StaticPage from 'layout/static-page';
import Head from 'components/head';

import tabLinks from './constants';
import './style.scss';

const NarrativesPage = ({ title, activeTab }) => (
  <StaticPage className="p-narratives">
    <Head title="Narratives" description="???" /> {/* TO - DO: Add description*/}
    <div className="container">
      <div className="hero">
        <div className="row justify-content-between align-items-end">
          <div className="col-5">
            <h2>{title || 'Empowering carbon sequestration.'}</h2>
          </div>
          <div className="col-3">
            <ul className="tabs">
              {tabLinks.map(tab => (
                <li key={tab.name}>
                  <Link key={tab.name} route={tab.route} params={{ tab: tab.params }}>
                    <a
                      className={classnames(
                        'nav-link',
                        activeTab === tab.params ? '-active' : null
                      )}
                    >
                      {tab.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </StaticPage>
);

NarrativesPage.propTypes = {
  title: PropTypes.string,
  activeTab: PropTypes.string.isRequired,
};

NarrativesPage.defaultProps = {
  title: '',
};

export default NarrativesPage;
