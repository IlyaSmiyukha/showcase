import React from 'react';
import './Separators.less';
import classnames from 'classnames';

export const HSeparator = (props = {}) => {
  const cssClassName = classnames('hseparator', props.className);
  return <div className={cssClassName} role="separator"/>;
};

export const VSeparator = (props = {}) => {
  const cssClassName = classnames('vseparator', props.className);
  return <div className={cssClassName} role="separator"/>;
};
