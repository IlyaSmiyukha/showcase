import React, {
  PureComponent,
} from 'react';

import classnames from 'classnames';

import enhanceWithClickOutside from 'react-click-outside';

import PropTypes from 'prop-types';

import './Dropdown.less';

class Dropdown extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      showDropdown: false,
    };
  }

  onDropDownClick = e => {
    e.stopPropagation();
    this.setState({
      showDropdown: !this.state.showDropdown,
    });
  }

  onItemClick = (e, item) => {
    item.onItemClick(e);
    this.onDropDownClick(e);
  }

  handleClickOutside() {
    this.setState({
      showDropdown: false,
    });
  }

  render() {

    const {
      itemsList,
      activeItem,
      className,
      right,
    } = this.props;

    const {
      showDropdown,
    } = this.state;

    const classNamesDropdown = classnames({
      'sc-dropdown': true,
      open: showDropdown,
    });

    const classNameMenu = classnames({
      'sc-dropdown-menu': true,
      right,
    });

    const classNameTitle = classnames({
      'sc-dropdown-title': true,
      right,
    });

    return (
      <div className={classNamesDropdown}>
        <div className={`${classNameTitle} ${className || ''}`} onClick={this.onDropDownClick} onTouchStart={this.onDropDownClick}>
          {activeItem}
        </div>
        {showDropdown &&
          <div className={classNameMenu}>
            {
              itemsList.map(item => {
                return !item.hide && item.title !== activeItem && <span key={`sc-dropdown=${item.title}`} onClick={e => this.onItemClick(e, item)}>
                  {item.title}
                </span>;
              })
            }

          </div>
        }
      </div>
    );
  }
}

Dropdown.defaultProps = {
  right: false,
};

Dropdown.propTypes = {
  itemsList: PropTypes.arrayOf(PropTypes.object),
  activeItem: PropTypes.oneOfType([PropTypes.string,
    PropTypes.object]),
  className: PropTypes.string,
  right: PropTypes.bool,
};

export default enhanceWithClickOutside(Dropdown);
