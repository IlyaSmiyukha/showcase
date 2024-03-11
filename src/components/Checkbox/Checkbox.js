import React, {
  PureComponent,
} from 'react';

import PropTypes from 'prop-types';

import './Checkbox.less';

import classnames from 'classnames';

class Checkbox extends PureComponent {
  constructor(props) {
    super(props);

    const {
      defaultChecked,
    } = props;

    this.state = {
      checked: !!defaultChecked,
    };
  }

  onInputChange = event => {
    const {
      name,
      value,

      onChange,
    } = this.props;

    const checked = !!event.target.checked;

    this.setState({
      checked,
    });

    if (typeof onChange === 'function') {
      onChange.call(onChange, name, value, checked);
    }
  }

  render() {
    const {
      name,
      children,

      disabled,
      className,
      style,
      id,
    } = this.props;

    const {
      checked,
    } = this.state;

    const _className = classnames(className, {
      disabled: disabled,
    });
    const _style = style || null;

    const CHECKBOX_ID = id || `input-checkbox-${name}`;

    return (
      <div className={`sc-checkbox ${_className}`} style={_style}>
        <label className="sc-checkbox-label" htmlFor={CHECKBOX_ID}>
          <input className="sc-input-checkbox"
            type="checkbox"
            defaultChecked={checked}
            name={name}
            onChange={this.onInputChange}
            id={CHECKBOX_ID}
            disabled={disabled}
          />
          <span className="sc-view-checkbox" />
          {
            children && (
              <span className="sc-view-label">{children}</span>
            )
          }
        </label>
      </div>
    );
  }
}

Checkbox.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  defaultChecked: PropTypes.bool.isRequired,

  disabled: PropTypes.bool,
  children: PropTypes.node,
  label: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  onChange: PropTypes.func,
};

Checkbox.defaultProps = {};

export default Checkbox;
