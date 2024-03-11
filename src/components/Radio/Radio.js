import React, {
  useState,
} from 'react';

import PropTypes from 'prop-types';

import './Radio.less';

import classnames from 'classnames';

const Radio = props => {
  const [checked, setChecked] = useState(props.defaultChecked);

  const {
    name,
    children,
    value,

    disabled,
    className,
    style,
    id,
  } = props;

  const onInputChange = event => {
    setChecked(!!event.target.checked)

    if (typeof props.onChange === 'function') {
      props.onChange.call(props.onChange, name, value, event.target.checked);
    }
  }

  const classNames = classnames(className, {
    'sc-radio': true,
    disabled: disabled,
  });

  const RADIO_ID = id || `input-radio-${name}`;

  return (
    <div className={classNames}>
      <input className="sc-input-radio"
        type="radio"
        defaultChecked={checked}
        name={name}
        onChange={onInputChange}
        id={RADIO_ID}
        value={value}
        />
      <label className="sc-radio-label" htmlFor={RADIO_ID}>
          {children}
      </label>
    </div>
  );

}

Radio.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  defaultChecked: PropTypes.bool.isRequired,

  disabled: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,

  onChange: PropTypes.func,
};


export default Radio;
