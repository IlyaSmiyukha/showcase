import React, {
  Fragment,
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
import Input from '@/components/Input';
import InputFile from '@/components/InputFile';
import {
  HSeparator,
} from '@/components/Separators';

import locale from '@/api/locale';

import {getButton} from '@/store/selectors/header';
import {updateButton} from '@/store/actions/header';

import {
  showAddFilePopup,
} from '@/store/actions/view';

import './AddButton.less';
import SvgIcon  from '@/components/SvgIcon';
import arrowIcon from '@/assets/images/svg/icons/icon-arrow-down.svg';

import {
  getFiles,
} from '@/store/selectors/files';

class AddButton extends Component {

  constructor(props) {
    super(props);

    const {
      button,
      group,
    } = props;
    this.state = {
      fields: {
        group_path: group ? group : '',
        action: button && button.action ? button.action : 'open_webpage',
        label: button && button.label ? button.label : '',
        fileId:  button && button.file_id ? button.file_id : '',
        url: button && button.url ? button.url : '',
      },
      errors: {
        label: '',
        fileId: '',
        url: '',
      },
    };
  }

  handleChange = e => {
    const input = e.target;
    this.setState({
      fields: {
        ...this.state.fields,
        [input.name]: input.value,
      },
    });
    this.clearErrors();
  }

  handleSave = () => {
    const {
      fields,
    } = this.state;
    const errors = {
      label: fields.label ? '' : locale.getResource('BtnNameError'),
      url: fields.action === 'open_webpage' && !fields.url ? locale.getResource('BtnUrlError') : '',
      fileId: fields.action === 'open_video' && !fields.fileId ? locale.getResource('BtnIdError') : '',
    };

    if (errors.label || errors.url || errors.fileId) {
      this.setState({
        errors,
      });
      return;
    }

    this.props.updateButton(this.state.fields);
    this.props.onCloseClick();
  }

  handleDeleteBtn = () => {
    this.props.updateButton({
      label: '',
    });
    this.props.onCloseClick();
  }

  handleAddVideo = () => {
    this.props.showAddFilePopup({
      path:'button',
      modalTitle:'Add file to button',
      buttonLabel:  'Choose file',
    });
  }

  clearErrors = () => {
    this.setState({
      errors: {
        label: '',
        fileId: '',
        url: '',
      },
    });
  }

  static getDerivedStateFromProps(nextProps, prevState){
    if (nextProps.button.file_id && nextProps.button.file_id !== prevState.fields.fileId) {
      return {
        fields: {
          ...prevState.fields,
          fileId: nextProps.button.file_id,
          url: '',
        },
      };
    }
    return null;
  }

  render() {
    const {
      onCloseClick,
      files,
    } = this.props;

    const {
      fields,
      errors,
    } = this.state;

    const isOpenWebpage = fields.action === 'open_webpage';
    const showClearbtn = !!fields.url || !!fields.fileId || !!fields.label;
    return (
      <div className="sc-form-wrapper sc-padding-10">
          <Input
            value={fields.label}
            type="text"
            onChange={this.handleChange}
            placeholder={'Type button name here…'}
            label={'Name'}
            name="label"
          />
          {!!errors.label && <div className="sc-input-error">
            {errors.label}
          </div>}
          <label className="sc-input-label">Action</label>
          <div className="sc-input-wrapper sc-input-wrapper-select">
            <select  onChange={this.handleChange} name="action" value={fields.action} className="sc-input">
              <option value="open_webpage">Open link in new tab</option>
              <option value="open_video">Open file</option>
            </select>
            <SvgIcon
              className="arrow-icon"
              data={arrowIcon}
            />
          </div>
          {
            isOpenWebpage && <Fragment>
              <Input
                value={fields.url}
                type="text"
                onChange={this.handleChange}
                placeholder={'Type button URL here…'}
                label={'URL'}
                name="url"
              />
              {!!errors.url && <div className="sc-input-error">
                {errors.url}
              </div>}
            </Fragment>
          }

          {
            !isOpenWebpage && <Fragment>
              <InputFile
                onClick={this.handleAddVideo}
                buttonName={fields.fileId ? 'Change file' : 'Choose file'}
                fileName={fields.fileId && files[fields.fileId] ? files[fields.fileId].name : 'No file chosen'}
              />
              {!!errors.fileId && <div className="sc-input-error">
                {errors.fileId}
              </div>}
            </Fragment>
          }


        <HSeparator />

        <div className="sc-buttons-container">
          <span>
            {showClearbtn &&  <ButtonFlat
              className="confirmation-remove"
              onClick={this.handleDeleteBtn}
            >
              {locale.getResource('RemoveButton')}
            </ButtonFlat>}
          </span>

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

AddButton.propTypes = {
  showAddFilePopup:  PropTypes.func,
  onCloseClick: PropTypes.func,
  updateButton: PropTypes.func,
  button: PropTypes.object,
  group: PropTypes.string,
  files: PropTypes.object,
};

const mapStateToProps = state => ({
  button: getButton(state),
  files: getFiles(state),
});

const mapDispatchToProps = {
  updateButton,
  showAddFilePopup,
};

export default connect(mapStateToProps, mapDispatchToProps)(withPopup(AddButton));
