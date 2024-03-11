import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';

import {
  connect,
} from 'react-redux';

import withPopup from '@/hocs/withPopup';

import {
  ButtonFlat,
  ButtonNormal,
} from '@/components/Buttons';

import {
  HSeparator,
} from '@/components/Separators';
import Checkbox from '@/components/Checkbox';
import classnames from 'classnames';

//selectors
import {
  getModalInfo,
} from '@/store/selectors/view';

//actions
import {
  updateText,
} from '@/store/actions/revisions';

import {
  updateCategoryTitle,
} from '@/store/actions/categories';

import locale from '@/api/locale';

import './PopupWithCaps.less';

class PopupWithCaps extends Component {

  constructor(props) {
    super(props);
    const {
      modalInfo,
    } = props;
    this.state = {
      value:  modalInfo.value ? modalInfo.value : '',
      caps:   typeof modalInfo.caps === 'undefined' ? true : modalInfo.caps,
    };
  }

  handleSave = () => {
    const {
      modalInfo,
      updateText,
    } = this.props;

    const {
      value,
      caps,
    } = this.state;

    updateCategoryTitle(modalInfo.id, value, caps);
    this.props.onCloseClick();
  }

  handleTextChange = e => {
    this.setState({
      value: e.target.value,
    });
  }

  handleUppercaseChange = () => {
    this.setState({
      caps: !this.state.caps,
    });
  }

  render() {
    const {
      onCloseClick,
      modalInfo,
    } = this.props;

    const {
      caps,
      value,
    } = this.state;

    const textareaClassNames = classnames({
      'sc-with-caps': caps,
      'sc-textarea-with-caps': true,
      'sc-textarea': true,
    });

    return (
      <div className="sc-form-wrapper sc-with-caps-wrap sc-padding-10">
        <div className="sc-param-container">

          <label className="sc-input-label">
            Category title:
          </label>

          <Checkbox
            defaultChecked={caps}
            name="upparcase"
            value="upparcase"
            onChange={this.handleUppercaseChange}>
            {locale.getResource('TitleCaps')}
          </Checkbox>

          <textarea className={textareaClassNames} value={value} onChange={this.handleTextChange} maxLength="255" placeholder={'THIS IS JUST A TITLE...'} />
        </div>

        <HSeparator />

        <div className="sc-buttons-container">
          <ButtonFlat
            className="confirmation-cancel"
            onClick={onCloseClick}
          >
            {locale.getResource('Cancel')}
          </ButtonFlat>

          <ButtonNormal
            className="confirmation-yes"
            onClick={this.handleSave}
          >
            {locale.getResource('Save')}
          </ButtonNormal>
        </div>
      </div>
    );
  }
}

PopupWithCaps.propTypes = {
  modalInfo: PropTypes.object,
  updateText: PropTypes.func,
  onCloseClick: PropTypes.func,
  updateCategoryTitle: PropTypes.func,
  titleText: PropTypes.string,
};

const mapStateToProps = state => ({
  modalInfo: getModalInfo(state),
});

const mapDispatchToProps = {
  updateText,
  updateCategoryTitle,
};

export default connect(mapStateToProps, mapDispatchToProps)(withPopup(PopupWithCaps));
