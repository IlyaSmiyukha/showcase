import React from 'react';

import PropTypes from 'prop-types';

import locale from '@/api/locale';

import './PreviewButton.less';

export const PreviewButton  = props => {
  return <a href={props.url}
    className={`sc-preview ${props.disabled ? 'sc-preview-disabled' : ''}`}
    target="_blank"
    onClick={props.onClick}
    rel="noreferrer noopener">{locale.getResource('Preview')}</a>;
};

PreviewButton.propTypes = {
  disabled: PropTypes.bool,
  url: PropTypes.string,
  onClick: PropTypes.func,
};
