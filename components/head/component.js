import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

const HeadComponent = ({ title: customTitle, description: customDescription }) => {
  const title = customTitle ? `${customTitle} | Soils Revealed` : 'Soils Revealed';
  const description = customDescription
    ? customDescription
    : 'Soils Revealed platform is an interface that allows direct visualization and analysis of soil organic carbon (SOC) change and shows predictions for future changes, in order to achieve a sustainable ecosystem management.';
  const imageUrl = 'https://soilsrevealed.org/images/social-media-card.png'; // A complete URL is required by at least Twitter

  return (
    <Head>
      <title key="title">{title}</title>
      <meta key="description" name="description" content={description} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content="Soils Revealed" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
    </Head>
  );
};

HeadComponent.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
};

HeadComponent.defaultProps = {
  title: null,
  description: null,
};

export default HeadComponent;
