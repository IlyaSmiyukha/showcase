import './CreateShowcase.less';

import {
  connect,
} from 'react-redux';

import React, {
  Component,
} from 'react';
import withPopup from '@/hocs/withPopup';
import PropTypes from 'prop-types';

import {
  ButtonFlat,
  ButtonNormal,
} from '@/components/Buttons';

import Input from '@/components/Input';

import locale from '@/api/locale';

import {
  HSeparator,
} from '@/components/Separators';

import Checkbox from '@/components/Checkbox';

import {
  clearRfcError,
  editRfc,
  createRfc,
  duplicateRfc
} from '@/store/actions/rfc';

import {
  updateSettings,
  revisionUpdate,
} from '@/store/actions/revisions';

import {
  getErrortRfc,
  getRfcIsCreating,
} from '@/store/selectors/rfc';

import {
  getSettings,
  getRfcData,
} from '@/store/selectors/revisions';

class CreateShowcase extends Component {

  constructor(props) {
    super(props);

    const {
      isEditMode,
      settings,
      playerConfig,
      rfcData,
      modalInfo
    } = props;
    this.state = {
      name:  isEditMode ? rfcData.name : modalInfo.name || '',
      url: isEditMode ? rfcData.organization_url.split('-') : modalInfo.url ? modalInfo.url.split('-') : '',
      isUrlIdentical: !isEditMode || !modalInfo.duplicate,
      advancedSettings: false,
      settingsList: {
        playerArticleText: isEditMode  ? settings.playerArticleText : playerConfig.playerArticleText,
        playerArticleComments: isEditMode  ? settings.playerArticleComments : playerConfig.playerArticleComments,
        personSettings:  isEditMode  ? settings.personSettings : false,
        showSearch:  isEditMode  ? settings.showSearch : false,
        showFilters:  isEditMode  ? settings.showFilters : false,
        hideCardTitle:  isEditMode  ? settings.hideCardTitle : false,
        hideCardType:  isEditMode  ? settings.hideCardType : false,
        showShortcuts: isEditMode ? settings.showShortcuts : false,
        showFollow: isEditMode ? settings.showFollow : false,
        startScreenAdvanced: isEditMode ? settings.startScreenAdvanced : false,
        startScreenAuthor: isEditMode ? settings.startScreenAuthor : false,
        enableIndexing: isEditMode ? settings.enableIndexing : modalInfo.enableIndexing || false,
        showCardPublishedDate: isEditMode ? settings.showCardPublishedDate : false,
        showShareControl: isEditMode ? settings.showShareControl : false,
        showLikes: isEditMode ? settings.showLikes : false,
        preventCopyOfArticleText: isEditMode ? settings.preventCopyOfArticleText : false,
        downloadArticle: isEditMode ? settings.downloadArticle : false,
        downloadInMoreButton: isEditMode ? settings.downloadInMoreButton : false,
      },
    };
  }

  handleCreateClick = async (name, url) => {
    const {
      createRfc,
      editRfc,
      onCloseClick,
      navigateTo,
      rfcData,
      isEditMode,
      updateSettings,
      revisionUpdate,
      duplicateRfc,
      modalInfo
    } = this.props;

    if (!isEditMode && !modalInfo.duplicate) {
      try {
        const result = await createRfc({
          name,
          type: 'showcase',
          url,
        });

        const settings = {...this.state.settingsList};
        delete settings.enableIndexing;

        if (typeof navigateTo === 'function') {
          await navigateTo(result.rfc_id);
        }

        await revisionUpdate({
          rfcId: result.rfc_id,
          data: {
            rfc_settings: settings,
          },
        });

      } catch (e) {
        console.log(e);
        throw (e);
      }
    } else if(modalInfo.duplicate) {
        const result = await duplicateRfc({
          rfc_id: modalInfo.rfc_id,
          name,
          url,
          enable_search_indexing: this.state.settingsList.enableIndexing,
        });
        if (typeof navigateTo === 'function') {
          await navigateTo(result.rfc_id);
        }
    } else {
      try {
        await editRfc({
          rfc_id: rfcData.rfc_id,
          name,
          url,
          enable_search_indexing: this.state.settingsList.enableIndexing,
        });

      } catch (e) {
        console.log(e);
        throw (e);
      }
    }
    onCloseClick();
    updateSettings(this.state.settingsList, isEditMode);
  }

  onCreateClick = async () => {
    const {
      name,
    } = this.state;

    const url = this.getUrlValue();

    try {
      await this.handleCreateClick(name, url);

    } catch (e) {
      console.log(e);
    }

  }

  handleUpdateSetting = field => {
    const {
      settingsList,
    } = this.state;
    this.setState({
      settingsList: {
        ...settingsList,
        [field]: !settingsList[field],
      },
    });
  }

  handleUpdateName = (e) => {
    const name = e.target.value;
    const {
      isUrlIdentical,
    } = this.state;
    if (isUrlIdentical) {
      this.setState({
        name,
        url: name.split(' '),
      });
    } else {
      this.setState({
        name,
      });
    }
  }

  handleUpdateUrl = (e) => {
    const url = e.target.value.split('-');
    this.setState({
      url,
      isUrlIdentical: false,
    });
  }

  getUrlValue = () => {
    const {
      url,
    } = this.state;
    return url ? url.join('-').replace(/[^a-zA-Z0-9\-]/g, '').toLowerCase() : '';
  }

  showAdvancedSettings = () => {
    this.setState({
      advancedSettings: true,
    });
  }

  componentWillUnmount() {
    this.props.clearRfcError();
  }

  render() {
    const {
      onCloseClick,
      isEditMode,
      error,
      playerConfig,
      settings,
      isCreating,
      modalInfo
    } = this.props;
    const {
      name,
      advancedSettings,
      settingsList,
    } = this.state;

    const urlValue = this.getUrlValue();
    return (
      <div className="sc-form-wrapper sc-create-showcase sc-padding-10">
        <Input
          label={locale.getResource('ShowcaseName')}
          value={name}
          placeholder={locale.getResource('ShowcaseName')}
          onChange={this.handleUpdateName}
          type="text"
        />

        <Input
          label={locale.getResource('ShowcaseUrl')}
          value={urlValue}
          placeholder={locale.getResource('Url')}
          description={locale.getResource('UrlDescription')}
          onChange={this.handleUpdateUrl}
          type="url"
        />
        {error && <div className="sc-input-error">
          {error}
        </div>}

        {(!advancedSettings && !modalInfo.duplicate) && <div className="sc-show-settings" onClick={this.showAdvancedSettings}>{locale.getResource('ShowAdvancedSettings')}</div>}

        {
          advancedSettings && <>
          <HSeparator />
          <div className="sc-settings-wrap">
            {playerConfig.playerArticleText && <div className="sc-param-container checkbox-conteiner">
              <Checkbox
                defaultChecked={isEditMode  ? settings.playerArticleText : playerConfig.playerArticleText}
                name="playerArticleText"
                value="playerArticleText"
                onChange={this.handleUpdateSetting}>
                {locale.getResource('EnableArticleText')}
              </Checkbox>
            </div>}
            {/*playerConfig.playerArticleComments && <div className="sc-param-container checkbox-conteiner">
              <Checkbox
                defaultChecked={isEditMode  ? settings.playerArticleComments : playerConfig.playerArticleComments}
                name="playerArticleComments"
                value="playerArticleComments"
                onChange={this.handleUpdateSetting}>
                {locale.getResource('EnableArticleComments')}
              </Checkbox>
            </div>*/}
            <div className="sc-param-container checkbox-conteiner">
              <Checkbox
                defaultChecked={settingsList.personSettings}
                name="personSettings"
                value="personSettings"
                onChange={this.handleUpdateSetting}>
                {locale.getResource('EnablePersonSettings')}
              </Checkbox>
            </div>

            <div className="sc-param-container checkbox-conteiner">
              <Checkbox
                defaultChecked={settingsList.hideCardTitle}
                name="hideCardTitle"
                value="hideCardTitle"
                onChange={this.handleUpdateSetting}>
                {locale.getResource('HideCardTitle')}
              </Checkbox>
            </div>

            <div className="sc-param-container checkbox-conteiner">
              <Checkbox
                defaultChecked={settingsList.hideCardType}
                name="hideCardType"
                value="hideCardType"
                onChange={this.handleUpdateSetting}>
                {locale.getResource('HideCardType')}
              </Checkbox>
            </div>

            <div className="sc-param-container checkbox-conteiner">
              <Checkbox
                defaultChecked={settingsList.showSearch}
                name="showSearch"
                value="showSearch"
                onChange={this.handleUpdateSetting}>
                {locale.getResource('EnableSearch')}
              </Checkbox>
            </div>

            <div className="sc-param-container checkbox-conteiner">
              <Checkbox
                defaultChecked={settingsList.showFilters}
                name="showFilters"
                value="showFilters"
                onChange={this.handleUpdateSetting}>
                {locale.getResource('EnableFilters')}
              </Checkbox>
            </div>

            <div className="sc-param-container checkbox-conteiner">
              <Checkbox
                defaultChecked={settingsList.showShortcuts}
                name="showShortcuts"
                value="showShortcuts"
                onChange={this.handleUpdateSetting}>
                {locale.getResource('ShowShortcuts')}
              </Checkbox>
            </div>

            <div className="sc-param-container checkbox-conteiner">
              <Checkbox
                defaultChecked={settingsList.showFollow}
                name="showFollow"
                value="showFollow"
                onChange={this.handleUpdateSetting}>
                {locale.getResource('ShowFollow')}
              </Checkbox>
            </div>

            <div className="sc-param-container checkbox-conteiner">
              <Checkbox
                defaultChecked={settingsList.startScreenAdvanced}
                name="startScreenAdvanced"
                value="startScreenAdvanced"
                onChange={this.handleUpdateSetting}>
                {locale.getResource('StartScreenAdvanced')}
              </Checkbox>
            </div>

            {
              settingsList.startScreenAdvanced &&   <div className="sc-param-container checkbox-conteiner">
                <Checkbox
                  defaultChecked={settingsList.startScreenAuthor}
                  name="startScreenAuthor"
                  value="startScreenAuthor"
                  onChange={this.handleUpdateSetting}>
                  {locale.getResource('StartScreenAuthor')}
                </Checkbox>
              </div>
            }

            <div className="sc-param-container checkbox-conteiner">
              <Checkbox
                defaultChecked={settingsList.enableIndexing}
                name="enableIndexing"
                value="enableIndexing"
                onChange={this.handleUpdateSetting}>
                {locale.getResource('EnableIndexingSetting')}
              </Checkbox>
            </div>

            <div className="sc-param-container checkbox-conteiner">
              <Checkbox
                defaultChecked={settingsList.showCardPublishedDate}
                name="showCardPublishedDate"
                value="showCardPublishedDate"
                onChange={this.handleUpdateSetting}>
                {locale.getResource('showCardPublishedDate')}
              </Checkbox>
            </div>

            <div className="sc-param-container checkbox-conteiner">
              <Checkbox
                defaultChecked={settingsList.showShareControl}
                name="showShareControl"
                value="showShareControl"
                onChange={this.handleUpdateSetting}>
                {locale.getResource('ShowShareControl')}
              </Checkbox>
            </div>

            <div className="sc-param-container checkbox-conteiner">
              <Checkbox
                defaultChecked={settingsList.preventCopyOfArticleText}
                name="preventCopyOfArticleText"
                value="preventCopyOfArticleText"
                onChange={this.handleUpdateSetting}>
                {locale.getResource('PreventCopyOfArticleText')}
              </Checkbox>
            </div>

            <div className="sc-param-container checkbox-conteiner">
              <Checkbox
                defaultChecked={settingsList.showLikes}
                name="showLikes"
                value="showLikes"
                onChange={this.handleUpdateSetting}>
                {locale.getResource('ShowLikesText')}
              </Checkbox>
            </div>

            <div className="sc-param-container checkbox-conteiner">
              <Checkbox
                defaultChecked={settingsList.downloadArticle}
                name="downloadArticle"
                value="downloadArticle"
                onChange={this.handleUpdateSetting}>
                {locale.getResource('ВownloadArticleText')}
              </Checkbox>
            </div>
            
            <div className="sc-param-container checkbox-conteiner">
              <Checkbox
                defaultChecked={settingsList.downloadInMoreButton}
                name="downloadInMoreButton"
                value="downloadInMoreButton"
                onChange={this.handleUpdateSetting}>
                {locale.getResource('DownloadInMoreButtonText')}
              </Checkbox>
            </div>
          </div>
        </>
        }


        <HSeparator />

        <div className="sc-buttons-container">
          <ButtonFlat
            className="confirmation-cancel"
            onClick={onCloseClick}
          >
            {locale.getResource('Cancel')}
          </ButtonFlat>

          <ButtonNormal
            disabled={!name || isCreating}
            className="confirmation-yes"
            onClick={this.onCreateClick}
          >
            {isEditMode ?  locale.getResource('SaveSettings') : modalInfo && modalInfo.duplicate ? locale.getResource('DuplicateShowcase') : locale.getResource('CreateShowcase')}
          </ButtonNormal>
        </div>
      </div>
    );
  }
}

CreateShowcase.propTypes = {
  onCreateClick: PropTypes.func,
  onCloseClick: PropTypes.func,
  updateSettings: PropTypes.func,
  settings: PropTypes.object,
  rfcData: PropTypes.object,
  isEditMode: PropTypes.bool,
  error: PropTypes.string,
  clearRfcError: PropTypes.func,
  playerConfig: PropTypes.object,
  createRfc: PropTypes.func,
  editRfc: PropTypes.func,
  navigateTo: PropTypes.func,
  revisionUpdate: PropTypes.func,
  isCreating: PropTypes.bool,
};


const mapStateToProps = state => ({
  rfcData: getRfcData(state),
  error: getErrortRfc(state),
  settings: getSettings(state),
  isCreating: getRfcIsCreating(state),
});

const mapDispatchToProps = {
  updateSettings,
  clearRfcError,
  createRfc,
  editRfc,
  revisionUpdate,
  duplicateRfc
};

export default connect(mapStateToProps, mapDispatchToProps)(withPopup(CreateShowcase));
