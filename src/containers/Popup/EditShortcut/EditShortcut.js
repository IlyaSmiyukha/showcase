import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid-random';

import {
  connect,
} from 'react-redux';

import withPopup from '@/hocs/withPopup';

import locale from '@/api/locale';

import InputFile from '@/components/InputFile';
import Input from '@/components/Input';
import {
  HSeparator,
} from '@/components/Separators';
import {
  ButtonFlat,
  ButtonNormal,
} from '@/components/Buttons';
import SelectComponent from '@/components/Select';

import { showAddFilePopup } from '@/store/actions/view';

import {
  addShortcut,
  editShortcut,
} from '@/store/actions/shortcuts';

import {
  getFiles,
} from '@/store/selectors/files';

import {
  getCategoriesForShortcuts,
} from  '@/store/selectors/categories';

import './EditShortcut.less';


class EditShortcut extends Component {

  constructor(props) {
    super(props);

    const {
      modalInfo,
      group,
      categories,
      files,
    } = props;

    const isCategoryValid = modalInfo.actions && !!categories.find(category => category.value === modalInfo.actions.scroll_to);
    const isPreviewValid = modalInfo.thumbnail && modalInfo.thumbnail.file_id && !!files[modalInfo.thumbnail.file_id];

    this.state = {
      fields: {
        name:  modalInfo.name ? modalInfo.name : '',
        group,
        thumbnail: {
          file_id:  isPreviewValid ? modalInfo.thumbnail.file_id : '',
        },
        actions:  isCategoryValid ? modalInfo.actions : {
          scroll_to: '',
        },
        id: modalInfo.id ? modalInfo.id : uuid(),
      },
      errors: {
        name: false,
        thumbnail: false,
        actions: false,
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
      errors: {
        ...this.state.errors,
        name: false,
      },
    });
  }

  handleOptionChange = inputValue => {
    this.setState({
      fields: {
        ...this.state.fields,
        actions: {
          scroll_to:  inputValue.value,
        },
      },
      errors: {
        ...this.state.errors,
        actions: false,
      },
    });
  }

  handleSave = () => {
    const {
      onCloseClick,
      modalInfo,
      addShortcut,
      editShortcut,
    } = this.props;

    const item = {
      ...this.state.fields,
    };

    if (!item.name || !item.thumbnail.file_id || !item.actions.scroll_to) {
      this.setState({
        errors: {
          name: !item.name,
          thumbnail: !item.thumbnail.file_id,
          actions: !item.actions.scroll_to,
        },
      });
      return;
    }

    if (modalInfo.action === 'add') {
      addShortcut(item);
    } else {
      editShortcut({shortcut: item, id: item.id});
    }

    onCloseClick();
  }

  handleAddImage = () => {
    this.props.showAddFilePopup({
      acceptType: ['image',
        'folder'],
      path: 'category',
      modalTitle:'Add image',
      buttonLabel:  'Choose image',
      categoryId: this.props.modalInfo.categoryId,
    });
  }

  static getDerivedStateFromProps(nextProps, prevState){
    const {
      modalInfo,
      files,
    } = nextProps;
    const isPreviewValid = modalInfo.thumbnail && modalInfo.thumbnail.file_id && !!files[modalInfo.thumbnail.file_id];

    if (isPreviewValid && modalInfo.thumbnail !== prevState.thumbnail) {
      return {
        fields: {
          ...prevState.fields,
          thumbnail: modalInfo.thumbnail,
        },
        errors: {
          ...prevState.errors,
          thumbnail: false,
        },
      };
    }
    return null;
  }

  render() {
    const {
      onCloseClick,
      files,
      categories,
    } = this.props;

    const {
      fields,
      errors,
    } = this.state;
    const isPreviewIsset = fields.thumbnail && fields.thumbnail.file_id && files[fields.thumbnail.file_id];

    const fileName = isPreviewIsset ? files[fields.thumbnail.file_id].original_filename : '';
    return (
      <div className="sc-form-wrapper sc-padding-10">
        <div className="sc-param-container">
          <Input
            value={fields.name}
            type="text"
            onChange={this.handleChange}
            placeholder={'Type shortcut title here…'}
            label={'Title'}
            name="name"
          />
          {errors.name && <div className="sc-input-error">
            Please fill name!
          </div>}

          <InputFile
            onClick={this.handleAddImage}
            buttonName={isPreviewIsset ? 'Change preview image' : 'Choose preview image'}
            fileName={fields.thumbnail.file_id ? fileName : 'No image chosen'}
          />

          {errors.thumbnail && <div className="sc-input-error">
            Please choose image!
          </div>}

          <label className="sc-input-label">Select category</label>
          <SelectComponent
            options={categories}
            onChange={this.handleOptionChange}
            value={categories.find(category => category.value === fields.actions.scroll_to)}
            isSearchable={false}
            isClearable={false}
            className={'sc-select'}
            noOptionsMessage={() => 'No categories found'}
          />
          {errors.actions && <div className="sc-input-error">
            Please select category!
          </div>}
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

EditShortcut.propTypes = {
  showAddFilePopup:  PropTypes.func,
  onCloseClick: PropTypes.func,
  group: PropTypes.string,
  files: PropTypes.object,
  modalInfo: PropTypes.object,
  categories:  PropTypes.array,
  addShortcut: PropTypes.func,
  editShortcut: PropTypes.func,
};

const mapStateToProps = state => ({
  files: getFiles(state),
  categories: getCategoriesForShortcuts(state),
});

const mapDispatchToProps = {
  showAddFilePopup,
  addShortcut,
  editShortcut,
};

export default connect(mapStateToProps, mapDispatchToProps)(withPopup(EditShortcut));
