import React from 'react';

import PropTypes from 'prop-types';
import classnames from 'classnames';

import SvgIcon from '@/components/SvgIcon';
import arrowIcon from '@/assets/images/svg/icons/icon-arrow.svg';

import './SliderArrow.less';

const arrowClassname = flipped => (classnames({
  'sc-arrow-icon': true,
  flipped,
}));

const SliderArrow = (props) => {
  const {
    flipped,
    onClick,
    display,
  } = props;

  return display ? <div
    className={arrowClassname(flipped)}
    role="button"
    onClick={(e) => {
      onClick ? onClick(e, flipped) : null;
    }}
  >
    <SvgIcon
      data={arrowIcon}
    />
  </div> : null;


};

SliderArrow.propTypes = {
  display: PropTypes.bool,
  flipped: PropTypes.bool,
  onClick: PropTypes.func,
};

export default SliderArrow;
