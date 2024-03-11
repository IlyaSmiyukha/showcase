import React, {
  Component,
} from 'react';
import ReactDOM from 'react-dom';


import PropTypes from 'prop-types';

import classnames from 'classnames';

import './withPopup.less';

import SvgIcon from '@/components/SvgIcon/SvgIcon';
import closeIcon from '@/assets/images/svg/icons/closeModalBtn.svg';

const withPopup = WrappedComponent => {

  class Popup extends Component {
    constructor(props) {
      super(props);
      this.container = null;
    }

    componentDidMount() {
      this.container = this.container || document.createElement('div');
      document.body.appendChild(this.container);
      ReactDOM.render(this.renderPopup(), this.container);
    }

    componentDidUpdate() {
      ReactDOM.render(this.renderPopup(), this.container);
    }

    componentWillUnmount() {
      ReactDOM.unmountComponentAtNode(this.container);
    }

    handleClose = () => {
      this.props.refreshOnclose ? document.location.reload() : this.props.onCloseClick();
    }
    renderPopup = () => {
      const {
        titleText,
        onCloseClick,
        wide = false,
        small = false,
        currentClass = '',
      } = this.props;

      const classNamModal = classnames({
        'sc-popup-modal': true,
        wide,
        small,
        [currentClass]: true,
      });

      return (
        <div className="sc-popup">
          <div
            className="sc-popup-wrapper"
          >
            <div className={classNamModal}>
              <div className="sc-popup-header">
                <div className="sc-popup-title">{titleText}</div>
                <div
                  className="sc-popup-close"
                  onClick={this.handleClose}
                >
                  <SvgIcon
                    data={closeIcon}
                    className={'icon-close'}
                  />
                </div>
              </div>
              <div className="sc-popup-body">
                <WrappedComponent {...this.props} />
              </div>
            </div>
          </div>
        </div>
      );
    }

    render = () => '';
  };

  Popup.propTypes = {
    titleText: PropTypes.string,
    onCloseClick: PropTypes.func,
    wide: PropTypes.bool,
    small: PropTypes.bool,
    currentClass: PropTypes.string,
    refreshOnclose:  PropTypes.bool,
  };

  return Popup;
};

export default withPopup;
