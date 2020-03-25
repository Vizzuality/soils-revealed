import React from 'react';
import StaticPage from 'layout/static-page';
import Head from 'components/head';

const ExplorePage = () => (
  <StaticPage className="p-explore">
    <Head title="Explore" />
    <div className="container">
      <div className="row">
        <div className="col-sm-12">
          <div className="alert alert-primary" role="alert">
            Coming soon!
          </div>
        </div>
      </div>
    </div>
  </StaticPage>
);

export default ExplorePage;
