import React, {
  Fragment,
} from 'react';
import PropTypes from 'prop-types';

import './Input.less';

const Input = props => {
  const {
    label,
    onChange,
    value,
    type,
    placeholder,
    description,
    prefix,
    name,
    onKeyDown,
    readOnly,
    autocomplete,
    id,
    maxLength,
    classNames,
    showCounter,
  } = props;

  return (
    <div className="sc-input-wrapper">
      {
        label && <label className="sc-input-label">
          {label}
        </label>
      }
      {
        description &&
          <p className="sc-input-description">
            {description}
          </p>
      }
      {
        prefix &&
          <span className="sc-input-label">
            {prefix}
          </span>
      }
      {
        showCounter && <div className="sc-characters-counter">{maxLength ? `${maxLength - value.length}/${maxLength}`: value.length} character(s)</div>
      }
      {
        type === 'url'
          ?
          <div className="sc-input sc-input-static">
            <span >
              {`${window.location.origin}/showcase/`}
            </span>
            <input
              onChange={onChange}
              className={`${classNames ? classNames : ''} sc-input-dynamic`}
              type="text"
              value={value}
              name={name}
              id={id}
              autoComplete={autocomplete ? autocomplete : 'off'}
              maxLength={maxLength}
              role="input"
            />
          </div>
          :
          <input
            className={`${classNames ? classNames : ''} sc-input`}
            placeholder={placeholder}
            onChange={onChange}
            type={type}
            value={value}
            name={name}
            onKeyDown={onKeyDown}
            readOnly={readOnly}
            id={id}
            autoComplete={autocomplete ? autocomplete : 'off'}
            maxLength={maxLength}
          />
      }

    </div>
  );
};

Input.defaultProps = {
  type: 'text',
};

Input.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  value: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  description: PropTypes.string,
  prefix: PropTypes.string,
  name: PropTypes.string,
  readOnly: PropTypes.bool,
  autocomplete: PropTypes.string,
  id: PropTypes.string,
  maxLength: PropTypes.number,
  classNames: PropTypes.string,
  showCounter: PropTypes.bool,
};

export default Input;
