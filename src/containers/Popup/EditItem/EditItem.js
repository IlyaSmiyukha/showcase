import React, {
  Fragment,
  Component,
} from 'react';
import PropTypes from 'prop-types';

import {
  connect,
} from 'react-redux';

import withPopup from '@/hocs/withPopup';

import locale from '@/api/locale';

import {editItem} from '@/store/actions/categories';
import {showAddFilePopup} from '@/store/actions/view';
import {filtersAddTags} from '@/store/actions/filters';

import {
  getFiles,
} from '@/store/selectors/files';

import {
  getSettings,
} from '@/store/selectors/revisions';
import {
  getFiltersTags,
} from '@/store/selectors/filters';

import {
  getCardsEmailsList
} from '@/store/selectors/categories'

import {
  checkEmail,
} from '@/helpers';

import Creatable from '@/components/CreatableSelect';
import InputFile from '@/components/InputFile';
import Input from '@/components/Input';
import {
  HSeparator,
} from '@/components/Separators';
import {
  ButtonFlat,
  ButtonNormal,
} from '@/components/Buttons';
import Attachments from '@/components/Attachments';
import CardPermissions from '@/components/CardPermissions';
import Scrollbar from '@/components/Scrollbar';
import DatePicker from '@/components/DatePicker';

import './EditItem.less';

class EditItem extends Component {

  constructor(props) {
    super(props);

    const {
      modalInfo: {
        file,
      },
      group,
    } = props;
    this.state = {
      file_id: file.file_id,
      group_path: group ? group : '',
      name:  file.name ? file.name : '',
      buttonName:  file.buttonName ? file.buttonName : '',
      created: file.created ? file.created : Date.now(),
      owner_data: {
        personName:  file.owner_data.personName ? file.owner_data.personName : '',
        personDescr:  file.owner_data.personDescr ? file.owner_data.personDescr : '',
        personImg: {
          file_id:  file.owner_data.personImg && file.owner_data.personImg.file_id ? file.owner_data.personImg.file_id : '',
        },
      },
      thumbnail: {
        file_id:  file.thumbnail && file.thumbnail.file_id ? file.thumbnail.file_id : '',
      },
      tags: file.tags ? file.tags : [],
      attachments: file.attachments ? file.attachments : [],
      card_id: file.card_id ?  file.card_id : '',
      cardPermissionsType: file.cardPermissionsType ? file.cardPermissionsType : 'Off',
      cardPermissions: file.cardPermissions ? file.cardPermissions : [],
      description: file.description ? file.description : [],
      errors: {
        permissions: false,
        attachments: false,
      },
      published:  !file.published || (file.published && typeof file.published === 'string') ? Date.now() : file.published,
    };
  }

  handleChange = e => {
    const input = e.target;
    this.setState({
      [input.name]: input.value,
    });
  }

  handleChangePerson = e => {
    const input = e.target;
    this.setState({
      owner_data: {
        ...this.state.owner_data,
        [input.name]: input.value,
      },
    });
  }

  handleTagChange = (inputValue) => {
    const tags = inputValue ? inputValue.map(item => item.label) : [];
    this.setState({
      tags,
    });
  }

  handleSave = () => {
    const {
      onCloseClick,
      modalInfo,
      filtersAddTags,
    } = this.props;

    const item = {
      ...this.state,
    };

    const errorsAttachments = item.attachments.length && item.attachments.filter(attachment => !attachment.name || !attachment.url || !attachment.type);
    const errorsAcess = item.cardPermissionsType === 'OnNoRequest' && !item.cardPermissions.length;

    if (errorsAttachments.length || errorsAcess) {
      this.setState({
        errors: {
          attachments: errorsAttachments,
          permissions: errorsAcess,
        },
      });
      return;
    }

    if (!item.thumbnail.file_id) {
      delete item.thumbnail;
    }

    if (item.owner_data.personImg && !item.owner_data.personImg.file_id) {
      delete item.owner_data.personImg;
    }

    delete item.errors;

    this.props.editItem({
      categoryId: modalInfo.categoryId,
      index: modalInfo.itemIndex,
      item,
    });
    if (item.tags.length) {
      filtersAddTags(item.tags);
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

  handleFileChange = () => {
    this.props.showAddFilePopup({
      path: 'category-file',
      modalTitle:'Change file',
      buttonLabel:  'Choose file',
      categoryId: this.props.modalInfo.categoryId,
    });
  }

  handleChangePersonImage = () => {
    this.props.showAddFilePopup({
      acceptType: ['image',
        'folder'],
      path: 'category-personImg',
      modalTitle:'Add image',
      buttonLabel:  'Choose image',
      categoryId: this.props.modalInfo.categoryId,
    });
  }

  updateAttachments = attachments => {
    this.setState({
      attachments,
      errors: {
        ...this.state.errors,
        attachments: false,
      },
    });
  }

  permissionTypeChange = type => {
    this.setState({
      cardPermissionsType: type,
      errors: {
        ...this.state.errors,
        permissions: false,
      },
    });
  }

  permissionListChange = value => {
    const emails = value.reduce((acc, item) => {
      const {value} = item;
      if (value.includes(';') || value.includes(',')) {
        acc = [...acc, ...value.replace(/\s/g, '').split(/;|,/).filter(item => checkEmail(item))]
      } else {
        acc = [...acc, value]
      }
      return acc
    }, [])
    
    this.setState({
      cardPermissions: _.uniq(emails),
      errors: {
        ...this.state.errors,
        permissions: false,
      },
    });
  }

  handlePublishedChange = timestamp => {
    this.setState({
      published: timestamp,
    });
  }

  static getDerivedStateFromProps(nextProps, prevState){
    const {
      modalInfo,
    } = nextProps;
    if (modalInfo.thumbnail && modalInfo.thumbnail !== prevState.thumbnail) {
      return {
        thumbnail: modalInfo.thumbnail,
      };
    }
    if (modalInfo.file_id && modalInfo.file_id !== prevState.file_id) {
      return {
        file_id: modalInfo.file_id,
      };
    }
    if (modalInfo.owner_data && modalInfo.owner_data.personImg && modalInfo.owner_data.personImg !== prevState.owner_data.personImg) {
      return {
        owner_data: {
          ...prevState.owner_data,
          personImg: modalInfo.owner_data.personImg,
        },
      };
    }
    return null;
  }

  render() {
    const {
      onCloseClick,
      files,
      settings,
      allTagsList,
      cardsEmailsList
    } = this.props;

    const {
      thumbnail,
      name,
      buttonName,
      owner_data,
      tags,
      attachments,
      errors,
      cardPermissionsType,
      cardPermissions,
      file_id,
      description,
      published,
    } = this.state;
    const fileName = thumbnail && thumbnail.file_id && files[thumbnail.file_id] ? files[thumbnail.file_id].original_filename : '';
    const fileNameForPerson = owner_data.personImg && owner_data.personImg.file_id && files[owner_data.personImg.file_id] ? files[owner_data.personImg.file_id].original_filename : '';
    const canEditPerson = settings.personSettings;

    const tagsList = allTagsList.map(tag => ({
      label: tag,
      value: tag,
    }));

    return (
      <div className="sc-form-wrapper sc-edit-item-modal">
        <div className="sc-param-container">
          <Scrollbar autoHeight
            autoHeightMin={280}
            autoHeightMax={'70vh'}>
            <Input
              value={name}
              type="text"
              onChange={this.handleChange}
              placeholder={'Type title here…'}
              label={'Title'}
              name="name"
              maxLength={settings.fieldsLimits.cardTitle}
              showCounter={true}
            />

            <div className="sc-input-wrapper">
              <label className="sc-input-label">
                Description
              </label>
              <div className="sc-characters-counter">{settings.fieldsLimits.cardDescription ? `${settings.fieldsLimits.cardDescription - description.length}/${settings.fieldsLimits.cardDescription}`: description.length} character(s)</div>
              <textarea className="sc-textarea" value={description} onChange={this.handleChange} name="description" placeholder={'Type description here…'} maxLength={settings.fieldsLimits.cardDescription ? settings.fieldsLimits.cardDescription : null}/>
            </div>

            <InputFile
              onClick={this.handleFileChange}
              buttonName="Change file"
              fileName={files[file_id].name}
            />

            <Input
              value={buttonName}
              type="text"
              onChange={this.handleChange}
              placeholder={'Type text button label here…'}
              label={'Button name'}
              name="buttonName"
              maxLength={150}
            />

            <InputFile
              onClick={this.handleAddImage}
              buttonName={thumbnail && thumbnail.file_id ? 'Change preview image' : 'Choose preview image'}
              fileName={thumbnail.file_id ? fileName : 'No image chosen'}
            />

            {
              canEditPerson &&  <Fragment>
                <HSeparator />

                <Input
                  value={owner_data.personName}
                  type="text"
                  onChange={this.handleChangePerson}
                  placeholder={'Type person name here…'}
                  label={'Person name'}
                  name="personName"
                  maxLength={150}
                />

                <Input
                  value={owner_data.personDescr}
                  type="text"
                  onChange={this.handleChangePerson}
                  placeholder={'Type person description here…'}
                  label={'Person description'}
                  name="personDescr"
                  maxLength={150}
                />

                <InputFile
                  onClick={this.handleChangePersonImage}
                  buttonName={owner_data.personImg && owner_data.personImg.file_id? 'Change person image' : 'Choose person image'}
                  fileName={owner_data.personImg && owner_data.personImg.file_id ? fileNameForPerson : 'No image chosen'}
                />
              </Fragment>
            }

            <HSeparator />
            <DatePicker timestamp={published || null} handlePublishedChange={this.handlePublishedChange}/>

            <HSeparator />

            <label className="sc-input-label">
              Tags
            </label>
            <Creatable
              options={tagsList}
              isMulti={true}
              isSearchable={true}
              isClearable={false}
              value={tags.map(tag => ({
                label: tag,
                value: tag,
              }))}
              onChange={value => this.handleTagChange(value)}
              placeholder={locale.getResource('TagsPlaceholder')}
              className={'sc-select'}
              formatCreateLabel={label => `Add tag ${label}`}
            />


            <HSeparator />
            <Attachments attachments={attachments} updateAttachments={this.updateAttachments}/>
            {!!errors.attachments && <div className="sc-input-error">
                Please fill attachments!
            </div>}

            <HSeparator />
            <CardPermissions
              active={cardPermissionsType}
              permissions={cardPermissions}
              onTypeChange={this.permissionTypeChange}
              onPersonsChange={this.permissionListChange}
              showError={errors.permissions}
              emailsList={cardsEmailsList}
            />

          </Scrollbar>
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

EditItem.propTypes = {
  showAddFilePopup:  PropTypes.func,
  onCloseClick: PropTypes.func,
  filtersAddTags:  PropTypes.func,
  editItem: PropTypes.func,
  group: PropTypes.string,
  files: PropTypes.object,
  modalInfo: PropTypes.object,
  settings: PropTypes.object,
  allTagsList: PropTypes.array,
};

const mapStateToProps = state => ({
  files: getFiles(state),
  settings: getSettings(state),
  allTagsList: getFiltersTags(state),
  cardsEmailsList: getCardsEmailsList(state)
});

const mapDispatchToProps = {
  editItem,
  showAddFilePopup,
  filtersAddTags,
};

export default connect(mapStateToProps, mapDispatchToProps)(withPopup(EditItem));
