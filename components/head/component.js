import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

const HeadComponent = ({ title, description }) => (
  <Head>
    <title key="title">{title ? `${title} | Soils Revealed` : 'Soils Revealed'}</title>
    <meta
      key="description"
      name="description"
      content={
        description
          ? description
          : 'Soils Revealed platform is an interface that allows direct visualization and analysis of soil organic carbon (SOC) change and shows predictions for future changes, in order to achieve a sustainable ecosystem management.'
      }
    />
  </Head>
);

HeadComponent.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
};

HeadComponent.defaultProps = {
  title: null,
  description: null,
};

export default HeadComponent;
