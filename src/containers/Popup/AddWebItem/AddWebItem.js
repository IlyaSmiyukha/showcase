import React, {
  Fragment,
  Component,
} from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid-random';

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

import {
  getSettings,
} from '@/store/selectors/revisions';

import {
  getFetchedLinkPreview,
  getCardsEmailsList
} from '@/store/selectors/categories';

import {getFiles} from '@/store/selectors/files';
import {
  getFiltersTags,
} from '@/store/selectors/filters';

import {
  getUsers,
} from '@/store/selectors/users';

import {
  addWebPage,
  getWebPagePreviewUrl,
} from '@/store/actions/categories';

import {filtersAddTags} from '@/store/actions/filters';
import {
  showAddFilePopup,
  updatePopupInfo,
} from '@/store/actions/view';

import Attachments from '@/components/Attachments';
import Scrollbar from '@/components/Scrollbar';
import CardPermissions from '@/components/CardPermissions';
import Creatable from '@/components/CreatableSelect';
import DatePicker from '@/components/DatePicker';

import {
  checkEmail,
} from '@/helpers';

import './AddWebItem.less';


class AddWebItem extends Component {

  constructor(props) {
    super(props);

    const {
      modalInfo,
      group,
      files,
      currentUserId,
      users,
    } = props;

    const isPreviewValid = modalInfo.thumbnail && modalInfo.thumbnail.file_id && files[modalInfo.thumbnail.file_id];
    const currentUser = users[currentUserId];
    this.state = {
      fields: {
        group_path: group ? group : '',
        name:  modalInfo.name ? modalInfo.name : '',
        url:  modalInfo.url ? modalInfo.url : '',
        type: 'link',
        buttonName: modalInfo.buttonName ? modalInfo.buttonName : 'Open link',
        created: modalInfo.created ? modalInfo.created : Date.now(),
        published: !modalInfo.published || (modalInfo.published && typeof modalInfo.published === 'string') ? Date.now() : modalInfo.published,
        linkID: modalInfo.linkID ? modalInfo.linkID : uuid(),
        tags: modalInfo.tags ? modalInfo.tags : [],
        thumbnail: {
          file_id:  isPreviewValid ? modalInfo.thumbnail.file_id : '',
        },
        owner_data: {
          ...currentUser,
          personName:  _.get(modalInfo, 'owner_data.personName', ''),
          personDescr: _.get(modalInfo, 'owner_data.personDescr', ''),
          first_name: _.get(modalInfo, 'owner_data.first_name', currentUser.first_name),
          last_name: _.get(modalInfo, 'owner_data.last_name',  currentUser.last_name),
          personImg: {
            file_id:  _.get(modalInfo, 'owner_data.personImg.file_id', ''),
          },
        },
        attachments: modalInfo.attachments ? modalInfo.attachments : [],
        card_id: modalInfo.card_id ?  modalInfo.card_id : '',
        cardPermissionsType: modalInfo.cardPermissionsType ? modalInfo.cardPermissionsType : 'Off',
        cardPermissions: modalInfo.cardPermissions ? modalInfo.cardPermissions : [],
        previewUrl:  modalInfo.previewUrl ? modalInfo.previewUrl : '',
        description:  modalInfo.description ? modalInfo.description : '',
      },
      errors: {
        name: '',
        thumbnail: '',
        url: '',
        attachmetns: '',
        permissions: false,
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

  handleChangePerson = e => {
    const input = e.target;
    this.setState({
      fields: {
        ...this.state.fields,
        owner_data: {
          ...this.state.fields.owner_data,
          [input.name]: input.value,
        },
      },
    });
  }

  handleSave = () => {
    const {
      fields,
    } = this.state;

    const webPage = {...fields};

    const {
      addWebPage,
      filtersAddTags,
      onCloseClick,
      modalInfo,
    } = this.props;

    const errorAttachments =  webPage.attachments.length ? !!webPage.attachments.filter(attachment => !attachment.name || !attachment.url || !attachment.type).length : false;
    const errors = {
      name: fields.name ? '' : locale.getResource('WebItemNameError'),
      url: !fields.url ? locale.getResource('WebItemnUrlError') : '',
      thumbnail: !fields.thumbnail.file_id && !fields.previewUrl ? locale.getResource('WebItemPreviewError') : '',
      attachments: errorAttachments ? 'Please fill attachments!' : '',
      permissions: fields.cardPermissionsType === 'OnNoRequest' && !fields.cardPermissions.length,
    };

    if (errors.name || errors.url ||  errors.thumbnail || errors.attachments || errors.permissions) {
      this.setState({
        errors,
      });
      return;
    }

    if (!webPage.owner_data.personImg.file_id) {
      delete webPage.owner_data.personImg.file_id;
    }

    if (!fields.thumbnail.file_id) {
      delete webPage.thumbnail;
    }

    addWebPage({
      categoryId: modalInfo.categoryId,
      webPage,
    });

    if (fields.tags.length) {
      filtersAddTags(fields.tags);
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

  handleTagChange = (inputValue) => {
    const tags = inputValue ? inputValue.map(item => item.label) : [];
    this.setState({
      fields: {
        ...this.state.fields,
        tags,
      },
    });
  }

  clearErrors = () => {
    this.setState({
      errors: {
        label: '',
        thumbnail: '',
        url: '',
      },
    });
  }

  updateAttachments = attachments => {
    this.setState({
      fields: {
        ...this.state.fields,
        attachments,
      },
      errors: {
        ...this.state.errors,
        attachments: '',
      },
    });
  }

  permissionTypeChange = type => {
    this.setState({
      fields: {
        ...this.state.fields,
        cardPermissionsType: type,
      },
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
      fields: {
        ...this.state.fields,
        cardPermissions: _.uniq(emails),
      },
      errors: {
        ...this.state.errors,
        permissions: false,
      },
    });
  }

  static getDerivedStateFromProps(nextProps, prevState){
    const {
      modalInfo,
    } = nextProps;

    if (modalInfo.thumbnail && modalInfo.thumbnail.file_id !== prevState.fields.thumbnail.file_id) {
      return {
        fields: {
          ...prevState.fields,
          thumbnail: {
            file_id: modalInfo.thumbnail.file_id,
          },
        },
        errors: {
          label: '',
          thumbnail: '',
          url: '',
        },
      };
    }

    if (_.get(modalInfo, 'owner_data.personImg') && modalInfo.owner_data.personImg !== prevState.fields.owner_data.personImg) {
      return {
        fields: {
          ...prevState.fields,
          owner_data: {
            ...prevState.fields.owner_data,
            personImg: modalInfo.owner_data.personImg,
          },
        },
      };
    }
    return null;
  }

  getPreviewUrl = () => {
    this.props.getWebPagePreviewUrl(this.state.fields.url);
    this.props.updatePopupInfo({thumbnail: {file_id: ''}});
  }

  handlePublishedChange = published => {
    this.setState({
      fields: {
        ...this.state.fields,
        published,
      },
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.fetchedLinkPreview !== prevProps.fetchedLinkPreview
      ||  _.get(this.props.modalInfo, 'thumbnail.file_id') !== _.get(prevProps.modalInfo, 'thumbnail.file_id')) {
      this.setState({
        fields: {
          ...this.state.fields,
          previewUrl: this.props.fetchedLinkPreview || '',
        },
      });
    }
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
      fields,
      errors,
    } = this.state;
    const fileName = fields.thumbnail && fields.thumbnail.file_id && files[fields.thumbnail.file_id].name ? `${files[fields.thumbnail.file_id].name}.${files[fields.thumbnail.file_id].original_filename.split('.').pop()}` : '';
    const fileNameForPerson = fields.owner_data.personImg && fields.owner_data.personImg.file_id && files[fields.owner_data.personImg.file_id] ? files[fields.owner_data.personImg.file_id].original_filename : '';

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
              value={fields.name}
              type="text"
              onChange={this.handleChange}
              placeholder={'Type title here…'}
              label={'Title'}
              name="name"
              showCounter={true}
              maxLength={settings.fieldsLimits.cardTitle}
            />
            {!!errors.name && <div className="sc-input-error">
              {errors.name}
            </div>}

            <div className="sc-input-wrapper">
              <label className="sc-input-label">
                Description
              </label>
              <div className="sc-characters-counter">{settings.fieldsLimits.cardDescription ? `${settings.fieldsLimits.cardDescription - fields.description.length}/${settings.fieldsLimits.cardDescription}`: fields.description.length} character(s)</div>
              <textarea className="sc-textarea" value={fields.description} onChange={this.handleChange} name="description" placeholder={'Type description here…'} maxLength={settings.fieldsLimits.cardDescription ? settings.fieldsLimits.cardDescription : null}/>
            </div>

            <Input
              value={fields.url}
              type="text"
              onChange={this.handleChange}
              placeholder={'Type link URL here…'}
              label={'URL'}
              name="url"
            />
            {!!errors.url && <div className="sc-input-error">
              {errors.url}
            </div>}

            <Input
              value={fields.buttonName}
              type="text"
              onChange={this.handleChange}
              placeholder={'Type text button label here…'}
              label={'Button name'}
              name="buttonName"
            />

            {
              settings.externalPreviewImageForLinks && <div className="sc-fetch-url">
                <Input
                  value={fields.previewUrl}
                  type="text"
                  onChange={this.handleChange}
                  placeholder={'Type preview url here…'}
                  label={'Preview image url'}
                  name="previewUrl"
                  disabled={!fields.url}
                />
                <ButtonNormal
                  className="confirmation-yes"
                  disabled={!fields.url}
                  onClick={this.getPreviewUrl}
                >
                  Get preview
                </ButtonNormal>
              </div>
            }

            <InputFile
              onClick={this.handleAddImage}
              buttonName={fields.file_id ? 'Change preview image' : 'Choose preview image'}
              fileName={fields.thumbnail.file_id ? fileName : 'No image chosen'}
            />
            {!!errors.thumbnail && <div className="sc-input-error">
              {errors.thumbnail}
            </div>}



            {
              canEditPerson &&  <Fragment>
                <HSeparator />

                <Input
                  value={fields.owner_data.personName}
                  type="text"
                  onChange={this.handleChangePerson}
                  placeholder={'Type person name here…'}
                  label={'Person name'}
                  name="personName"
                  maxLength={150}
                />

                <Input
                  value={fields.owner_data.personDescr}
                  type="text"
                  onChange={this.handleChangePerson}
                  placeholder={'Type person description here…'}
                  label={'Person description'}
                  name="personDescr"
                  maxLength={150}
                />

                <InputFile
                  onClick={this.handleChangePersonImage}
                  buttonName={fields.owner_data.personImg && fields.owner_data.personImg.file_id? 'Change person image' : 'Choose person image'}
                  fileName={fields.owner_data.personImg && fields.owner_data.personImg.file_id ? fileNameForPerson : 'No image chosen'}
                />
              </Fragment>
            }

            <HSeparator />
            <DatePicker timestamp={fields.published} handlePublishedChange={this.handlePublishedChange}/>

            <HSeparator />
            <label className="sc-input-label">
                Tags
            </label>
            <Creatable
              options={tagsList}
              className={'sc-select'}
              onChange={value => this.handleTagChange(value)}
              isMulti={true}
              isClearable={false}
              formatCreateLabel={label => `Add tag ${label}`}
              noOptionsMessage={() => 'Type to add tags'}
              placeholder={locale.getResource('TagsPlaceholder')}
              value={fields.tags.map(tag => ({
                label: tag,
                value: tag,
              }))}/>

            <HSeparator />
            <Attachments attachments={fields.attachments} updateAttachments={this.updateAttachments}/>
            {!!errors.attachments && <div className="sc-input-error">
              {errors.attachments}
            </div>}

            <CardPermissions
              active={fields.cardPermissionsType}
              permissions={fields.cardPermissions}
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

AddWebItem.propTypes = {
  showAddFilePopup:  PropTypes.func,
  onCloseClick: PropTypes.func,
  filtersAddTags: PropTypes.func,
  addWebPage: PropTypes.func,
  getWebPagePreviewUrl: PropTypes.func,
  updatePopupInfo: PropTypes.func,
  group: PropTypes.string,
  files: PropTypes.object,
  modalInfo: PropTypes.object,
  settings: PropTypes.object,
  allTagsList: PropTypes.array,
  fetchedLinkPreview: PropTypes.string,
  currentUserId: PropTypes.string,
  users: PropTypes.object,
};

const mapStateToProps = state => ({
  files: getFiles(state),
  settings: getSettings(state),
  allTagsList: getFiltersTags(state),
  fetchedLinkPreview: getFetchedLinkPreview(state),
  users: getUsers(state),
  cardsEmailsList: getCardsEmailsList(state)
});

const mapDispatchToProps = {
  addWebPage,
  showAddFilePopup,
  filtersAddTags,
  getWebPagePreviewUrl,
  updatePopupInfo,
};

export default connect(mapStateToProps, mapDispatchToProps)(withPopup(AddWebItem));
