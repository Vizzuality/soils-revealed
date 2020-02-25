import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

const HeadComponent = ({ title, description }) => (
  <Head>
    {!title && <title key="title">Soils Revealed</title>}
    {!!title && <title key="title">{`${title} | Soils Revealed`}</title>}
    {description && <meta key="description" name="description" content={description} />}
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
