import React, {
  Component,
  Fragment,
} from 'react';

import {
  connect,
} from 'react-redux';

import PropTypes from 'prop-types';

//components
import CreateShowcase from '@/containers/Popup/CreateShowcase';
import AddHyperlinks from '@/containers/Popup/AddHyperlinks';
import PopupWithCaps from '@/containers/Popup/PopupWithCaps';
import EditTextPopup from '@/containers/Popup/EditTextPopup';
import AddButton from '@/containers/Popup/AddButton';
import AddFile from '@/containers/Popup/AddFile';
import Publish from '@/containers/Popup/Publish';
import Published from '@/containers/Popup/Published';
import AddWebItem from '@/containers/Popup/AddWebItem';
import EditItem from '@/containers/Popup/EditItem';
import Filters from '@/containers/Popup/Filters';
import EditShortcut from '@/containers/Popup/EditShortcut';
import FooterMenu from '@/containers/Popup/FooterMenu';
import ManagePeople from '@/containers/Popup/ManagePeople';
import SomeoneEditing from '@/containers/Popup/SomeoneEditing';
import ExportCsv from '@/containers/Popup/ExportCsv';
import RestoreRevision from '@/containers/Popup/RestoreRevision';
import ChangeOwnership from '@/containers/Popup/ChangeOwnership';
import CardDelete from '@/containers/Popup/CardDelete';
import ShowcaseDelete from '@/containers/Popup/ShowcaseDelete';
import AnalyticsDate from '@/containers/Popup/AnalyticsDate';
import Followers from '@/containers/Popup/Followers';

//actions
import {
  hidePopup,
  hideSpecialPopup,
} from '@/store/actions/view';

//selectors
import {
  createPopupActive,
  editPopupActive,
  hyperlinksPopupActive,
  withCapsPopupActive,
  buttonPopupActive,
  editTextPopupActive,
  addFilePopupActive,
  publishActive,
  publishedActive,
  webItemPopupActive,
  editItemPopupActive,
  filtersPopupActive,
  shortcutsPopupActive,
  footerMenuPopupActive,
  managePeoplePopupActive,
  someoneEditingActive,
  exportCsvPopupActive,
  restoreRevisionPopupActive,
  changeOwnershipPopupActive,
  cardDeletePopupActive,
  getDeleteShowcasePopupActive,
  getAnalyticsDatePopupActive,
  getShowFollowerePopupActive,

  getModalInfo,
} from '@/store/selectors/view';

class PopupContainer extends Component {
  constructor(props) {
    super(props);
  }

  handleClosePopupClick = () => {
    const {
      hidePopup,
    } = this.props;

    hidePopup();
  }

  hideaddFilePopup = () => {
    const {
      hideSpecialPopup,
    } = this.props;
    hideSpecialPopup('addFilePopup');
  }

  render() {
    const {
      showCreatePopup,
      showEditPopup,
      hyperlinksPopupActive,
      withCapsPopupActive,
      buttonPopupActive,
      editTextPopup,
      addFilePopupActive,
      publishRevisionActive,
      publishedActive,
      webItemPopupActive,
      editItemPopupActive,
      filtersPopupActive,
      shortcutsPopupActive,
      footerMenuPopupActive,
      managePeoplePopupActive,
      exportCsvPopupActive,
      restoreRevisionPopupActive,
      changeOwnershipPopupActive,
      cardDeletePopupActive,
      deleteShowcasePopupActive,
      analyticsDatePopupActive,
      followersPopupActive,

      modalInfo = {},
      navigateTo,
      playerConfig,
      group,
      rfcId,
      organizationId,
      someoneEditingActive,
      currentUserId,
      pusher,
      sharingAnyoneWithTheLink,
      sharingAnyoneWithTheLinkAndPassword
    } = this.props;

    return (
      <Fragment>

        {
          (showCreatePopup || showEditPopup) &&
          <CreateShowcase
            onCloseClick={this.handleClosePopupClick}
            titleText={showEditPopup? 'Settings' : modalInfo && modalInfo.duplicate ? 'Duplicate ShowCase' : 'Create new ShowCase'}
            isEditMode={showEditPopup}
            navigateTo={navigateTo}
            playerConfig={playerConfig}
            modalInfo={modalInfo}
          />
        }

        {
          hyperlinksPopupActive && <AddHyperlinks
            small={true}
            wide={false}
            onCloseClick={this.handleClosePopupClick}
            titleText={`menu items`}
          />
        }

        {
          withCapsPopupActive && <PopupWithCaps
            small={true}
            wide={false}
            onCloseClick={this.handleClosePopupClick}
            titleText={modalInfo.textType === 'heading' ? 'Showcase heading' : 'Edit category title'}
          />
        }

        {
          buttonPopupActive && <AddButton
            small={true}
            wide={false}
            onCloseClick={this.handleClosePopupClick}
            titleText={`button settings`}
            group={group}
          />
        }

        {
          editTextPopup && <EditTextPopup
            small={false}
            wide={false}
            onCloseClick={this.handleClosePopupClick}
            titleText={`Showcase ${modalInfo.modalName}`}
            modalInfo={modalInfo}
          />
        }

        {
          addFilePopupActive &&
          <AddFile
            wide={true}
            group={group}
            currentClass="add-file-modal"
            titleText={modalInfo.modalTitle}
            modalInfo={modalInfo}
            onCloseClick={this.hideaddFilePopup}
            pusher={pusher}
            rfcId={rfcId}
          />
        }

        {
          publishRevisionActive &&
          <Publish
            small={true}
            wide={false}
            rfcId={rfcId}
            organizationId={organizationId}
            onCloseClick={this.handleClosePopupClick}
            titleText="Publish your showcase"
            group={group}
            sharingAnyoneWithTheLink={sharingAnyoneWithTheLink}
            sharingAnyoneWithTheLinkAndPassword={sharingAnyoneWithTheLinkAndPassword}
          />
        }

        {
          publishedActive &&
          <Published
            small={true}
            onCloseClick={this.handleClosePopupClick}
            url={modalInfo.url}
            titleText="Publish your showcase"
          />
        }

        {
          webItemPopupActive && <AddWebItem
            small={true}
            wide={false}
            onCloseClick={this.handleClosePopupClick}
            titleText={`Add link`}
            group={group}
            modalInfo={modalInfo}
            currentUserId={currentUserId}
          />
        }

        {
          editItemPopupActive && <EditItem
            small={true}
            wide={false}
            onCloseClick={this.handleClosePopupClick}
            titleText={`Edit item`}
            group={group}
            modalInfo={modalInfo}
          />
        }

        {
          filtersPopupActive && <Filters
            small={true}
            wide={false}
            onCloseClick={this.handleClosePopupClick}
            modalInfo={modalInfo}
            titleText={`filter items`} />
        }

        {
          shortcutsPopupActive && <EditShortcut
            small={true}
            wide={false}
            onCloseClick={this.handleClosePopupClick}
            group={group}
            modalInfo={modalInfo}
            titleText={`edit shortcut`}/>
        }

        {
          footerMenuPopupActive && <FooterMenu
            small={true}
            wide={false}
            onCloseClick={this.handleClosePopupClick}
            modalInfo={modalInfo}
            titleText={`edit menu`}/>
        }

        {
          managePeoplePopupActive && <ManagePeople
            small={false}
            wide={false}
            onCloseClick={this.handleClosePopupClick}
            modalInfo={modalInfo}
            titleText={`invite and manage people`}
            rfcId={rfcId}/>
        }

        {
          someoneEditingActive && <SomeoneEditing
            small={true}
            wide={false}
            onCloseClick={this.handleClosePopupClick}
            modalInfo={modalInfo}
            titleText={modalInfo.modalTitle ? modalInfo.modalTitle : `Another person is using the editor`}
            currentUserId={currentUserId}
            refreshOnclose={true}
          />
        }

        {
          exportCsvPopupActive && <ExportCsv
            small={true}
            wide={false}
            onCloseClick={this.handleClosePopupClick}
            modalInfo={modalInfo}
            group={group}
            titleText={'Export CSV report'}
          />
        }

        {
          restoreRevisionPopupActive && <RestoreRevision
            small={true}
            wide={false}
            onCloseClick={this.handleClosePopupClick}
            group={group}
            titleText={'Restore'}
          />
        }

        {
          changeOwnershipPopupActive && <ChangeOwnership
            small={true}
            wide={false}
            onCloseClick={this.handleClosePopupClick}
            modalInfo={modalInfo}
            group={group}
            titleText={'Change owner'}
            navigateTo={navigateTo}
            currentUserId={currentUserId}
          />
        }

        {
          cardDeletePopupActive && <CardDelete
            small={true}
            wide={false}
            onCloseClick={this.handleClosePopupClick}
            modalInfo={modalInfo}
            group={group}
            titleText={'Delete card'}
          />
        }

        {
          deleteShowcasePopupActive && <ShowcaseDelete
            small={true}
            wide={false}
            onCloseClick={this.handleClosePopupClick}
            modalInfo={modalInfo}
            titleText={'Delete showcase'}
          />
        }

        {
          analyticsDatePopupActive && <AnalyticsDate
            small={true}
            wide={false}
            onCloseClick={this.handleClosePopupClick}
            modalInfo={modalInfo}
            titleText={'Choose analytics period'}
          />
        }

        {
          followersPopupActive && <Followers
           small={false}
           wide={false}
           onCloseClick={this.handleClosePopupClick}
           titleText={'Followers'}
           rfcId={rfcId}
         />
        }

      </Fragment>
    );
  }
}

PopupContainer.propTypes = {
  //actions
  hidePopup: PropTypes.func,
  hideSpecialPopup: PropTypes.func,

  //actions from parent
  navigateTo: PropTypes.func,

  //props
  hyperlinksPopupActive: PropTypes.bool,
  withCapsPopupActive: PropTypes.bool,
  buttonPopupActive: PropTypes.bool,
  editTextPopup: PropTypes.bool,
  showCreatePopup: PropTypes.bool,
  showEditPopup: PropTypes.bool,
  addFilePopupActive: PropTypes.bool,
  publishRevisionActive: PropTypes.bool,
  publishedActive: PropTypes.bool,
  webItemPopupActive:  PropTypes.bool,
  editItemPopupActive: PropTypes.bool,
  filtersPopupActive: PropTypes.bool,
  shortcutsPopupActive: PropTypes.bool,
  footerMenuPopupActive: PropTypes.bool,
  managePeoplePopupActive: PropTypes.bool,
  someoneEditingActive: PropTypes.bool,
  exportCsvPopupActive: PropTypes.bool,
  restoreRevisionPopupActive: PropTypes.bool,
  changeOwnershipPopupActive: PropTypes.bool,
  cardDeletePopupActive: PropTypes.bool,
  deleteShowcasePopupActive: PropTypes.bool,
  analyticsDatePopupActive: PropTypes.bool,
  followersPopupActive: PropTypes.bool,
  modalInfo: PropTypes.object,

  //props from parent
  playerConfig: PropTypes.object,
  group: PropTypes.string,
  rfcId: PropTypes.string,
  organizationId: PropTypes.string,
  currentUserId: PropTypes.string,
  pusher:  PropTypes.object,
};

const mapStateToProps = state => ({
  hyperlinksPopupActive: hyperlinksPopupActive(state),
  withCapsPopupActive: withCapsPopupActive(state),
  buttonPopupActive: buttonPopupActive(state),
  editTextPopup: editTextPopupActive(state),
  showCreatePopup: createPopupActive(state),
  showEditPopup: editPopupActive(state),
  addFilePopupActive: addFilePopupActive(state),
  publishRevisionActive: publishActive(state),
  publishedActive: publishedActive(state),
  webItemPopupActive: webItemPopupActive(state),
  editItemPopupActive: editItemPopupActive(state),
  filtersPopupActive: filtersPopupActive(state),
  shortcutsPopupActive: shortcutsPopupActive(state),
  footerMenuPopupActive: footerMenuPopupActive(state),
  managePeoplePopupActive: managePeoplePopupActive(state),
  someoneEditingActive: someoneEditingActive(state),
  exportCsvPopupActive: exportCsvPopupActive(state),
  restoreRevisionPopupActive: restoreRevisionPopupActive(state),
  changeOwnershipPopupActive: changeOwnershipPopupActive(state),
  cardDeletePopupActive: cardDeletePopupActive(state),
  deleteShowcasePopupActive: getDeleteShowcasePopupActive(state),
  analyticsDatePopupActive: getAnalyticsDatePopupActive(state),
  followersPopupActive: getShowFollowerePopupActive(state),
  modalInfo: getModalInfo(state),
});

const mapDispatchToProps = {
  hidePopup,
  hideSpecialPopup,
};

export default connect(mapStateToProps, mapDispatchToProps)(PopupContainer);
