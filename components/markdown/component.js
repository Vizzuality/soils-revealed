import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

const Markdown = ({ content }) => <ReactMarkdown source={content} linkTarget="_blank" />;

Markdown.propTypes = {
  content: PropTypes.string.isRequired,
};

export default Markdown;
