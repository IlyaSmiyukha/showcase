import React from 'react';
import PropTypes from 'prop-types';

import arrowIcon from '@/assets/images/svg/icons/icon-arrow.svg';
import SvgIcon from '@/components/SvgIcon';

import './BackButton.less';

const BackButton = props => {
  return (
    <div className="sc-back-button" onClick={props.onClick}>
      <SvgIcon
        data={arrowIcon}
      />
      Go back
    </div>
  );
};

BackButton.propTypes = {
  onClick: PropTypes.func,
};

export default BackButton;
