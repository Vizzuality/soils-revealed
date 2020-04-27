import React from 'react';
import PropTypes from 'prop-types';

import { Switch } from 'components/forms';
import InfoButton from 'components/info-button';

import './style.scss';

const ExploreExperimentalDatasetToggle = ({ basemap }) => {
  const invert = basemap === 'dark' || basemap === 'satellite' || basemap === 'landsat';

  return (
    <div
      className={['c-explore-experimental-dataset-toggle', ...(invert ? ['-invert'] : [])].join(
        ' '
      )}
    >
      <Switch id="explore-experimental-dataset-toggle" className="-transparent" disabled>
        Experimental dataset{' '}
        <InfoButton>
          Facere illo deleniti dolorem ut. Vero saepe quisquam dolor beatae. Debitis sit blanditiis
          vero tenetur quo earum sed aut.
        </InfoButton>
      </Switch>
    </div>
  );
};

ExploreExperimentalDatasetToggle.propTypes = {
  basemap: PropTypes.string.isRequired,
};

export default ExploreExperimentalDatasetToggle;
