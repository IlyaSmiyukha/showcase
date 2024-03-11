import React from 'react';

import PropTypes from 'prop-types';

import classnames from 'classnames';

import './Buttons.less';

const Button = (props) => {
  const {
    onClick,
    disabled,
    type,
    className,
    children,
    leftIcon,
    rightIcon,
    testId,
    role,
  } = props;
  const cssClassName = classnames(className, {
    'has-left-icon': !!leftIcon,
    'has-right-icon': !!rightIcon,
  });

  return <button className={cssClassName}
    onClick={onClick}
    disabled={disabled}
    type={type}
    data-testid={testId}
    role={role}>
    {
      !!leftIcon && (
        leftIcon
      )
    }
    { children }
    {
      !!rightIcon && (
        rightIcon
      )
    }
  </button>;
};

const BUTTON_PROP_TYPES = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  disabled: PropTypes.bool,

  children: PropTypes.node,

  leftIcon: PropTypes.element,
  rightIcon: PropTypes.element,
  role: PropTypes.string,
  testId: PropTypes.string,

  type: PropTypes.oneOf([
    'submit',
    'reset',
    'button',
  ]),

  progress: PropTypes.bool,
};
const BUTTON_DEFAULT_PROPS = {
  onClick: () => { },
  children: null,
  disabled: false,
  className: '',
  type: 'button',
};

Button.propTypes = BUTTON_PROP_TYPES;
Button.defaultProps = BUTTON_DEFAULT_PROPS;

const ButtonNormal = (props) => {
  const newProps = {
    ...props,
    className: classnames(props.className, 'tc-button--normal'),
  };
  return <Button {...newProps}/>;
};
ButtonNormal.propTypes = BUTTON_PROP_TYPES;
ButtonNormal.defaultProps = BUTTON_DEFAULT_PROPS;

const ButtonFlat = (props) => {
  const newProps = {
    ...props,
    className: classnames(props.className, 'tc-button--flat'),
  };
  return <Button {...newProps}/>;
};
ButtonFlat.propTypes = BUTTON_PROP_TYPES;
ButtonFlat.defaultProps = BUTTON_DEFAULT_PROPS;


export { ButtonNormal, ButtonFlat };
