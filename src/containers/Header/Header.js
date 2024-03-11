import React, {
  PureComponent,
  Fragment
} from 'react';

import PropTypes from 'prop-types';

import {
  connect,
} from 'react-redux';

import {
  ButtonNormal,
} from '@/components/Buttons';

import {NotificationManager} from 'react-notifications';

import PreviewButton from '@/components/PreviewButton';

import SaveButton from '@/components/SaveButton';
import Dropdown from '@/components/Dropdown';

import SvgIcon from '@/components/SvgIcon';
import moreIcon from '@/assets/images/svg/icons/icon-more.svg';
import userIcon from '@/assets/images/svg/icons/icon-user-add.svg';
import chartIcon from '@/assets/images/svg/icons/icon-chart.svg';

import {
  revisionUpdate,
  revisionUnpublish,
  resetRfcData,
} from '@/store/actions/revisions';

import {
  showPublishPopup,
  showEditPopup,
  showManagePeoplePopup,
  showExportCsvPopup,
  showRestoreRevisionPopup,
  showChangeOwnershipPopup,
  showCreatePopup,
  showFollowersPopup
} from '@/store/actions/view';

import {
  sendStatus,
} from '@/store/actions/managePeople';

import locale from '@/api/locale';

import {
  isCurrentRevisionUpdated,
  getSettings,
  getRevisionState,
  isLoaded,
  isRevisionPublished,
  getOwner,
  getCreatedTime,
  getRevisionsFirstLoad,
  getRevisionsList,
  getRevisionsPublishError,
  isRevisionPublishing,
} from '@/store/selectors/revisions';

import {
  getFooter,
} from '@/store/selectors/footer';

import {
  getShowAnalytics,
} from '@/store/selectors/analytics';

import {
  getHeader,
} from '@/store/selectors/header';

import {
  getCleanCategories,
} from '@/store/selectors/categories';

import {
  getFiltersState,
} from '@/store/selectors/filters';

import {
  getShortcutsState,
} from '@/store/selectors/shortcuts';

import {
  getFiles,
} from '@/store/selectors/files';

import {
  getLayout,
} from '@/store/selectors/layout';


import './Header.less';

class Header extends PureComponent {

  constructor(props) {
    super(props);

    this.timeout = null;
    this.saveClick = null;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.rfcId !== this.props.rfcId) {
      this.props.resetRfcData();
    } else {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        const {
          isSaved,
          isLoaded,
        } = this.props;

        if (!isSaved && isLoaded) {
          this.handleUpdateRevision();
        }
      }, 10000);
    }
  }

  componentDidMount() {
    window.addEventListener('beforeunload', (e) => {
      if (!this.props.isSaved && this.props.rfcId) {
        e.preventDefault();
        e.returnValue = '';
      }
    });
  }

  componentWillUnmount() {
    this.saveData();
    NotificationManager.listNotify = [];
  }

  saveData = async () => {
    const {
      resetRfcData,
      isLoaded,
      isSaved,
      sendStatus,
      rfcId,
    } = this.props;

    sendStatus(0, rfcId);
    resetRfcData();
    if (!isLoaded || isSaved) {
      return;
    }

    clearTimeout(this.timeout);
    await this.handleUpdateRevision();
  }


  handlePublishClick = async () => {
    const {
      isSaved,
      showPublishPopup,
      firstLoad,
    } = this.props;

    const {
      handleUpdateRevision,
    } = this;
    if (!isSaved || firstLoad) {
      await handleUpdateRevision();
    }
    showPublishPopup();
  }

  handleUpdateRevision = async () => {
    const {
      revisionUpdate,
      rfcId,
      settings,
      playerConfig,
      filtersState,
      shortcuts,
      footer,
      header,
      categories,
      layout
    } = this.props;

    const filters = {
      'search-placeholder': filtersState.searchPlaceholder,
      type: 'showcase-filters-and-search',
      id: filtersState.id,
      'filter-items': filtersState.filterItems,
    };

    const settingsList = {...settings};
    delete settingsList.enableIndexing;
    delete settingsList.enableIndexing;

    const blocks = [
      header,
      footer,
      ...categories,
      filters,
      shortcuts,
    ];

    const data = {
      rfc_settings: settingsList,
      blocks,
      playerConfig,
      layout
    }

    try {
      await revisionUpdate({
        rfcId,
        is_editor_active: true,
        data,
      });
    } catch (e) {
      console.log(e);
      throw (e);
    }
  }

  onPreviewClick = async () => {
    await this.handleUpdateRevision();
  }

  openSetting = () => {
    this.props.showEditPopup();
  }

   hanleUnpublish = async () => {
     const {
       revisionUnpublish,
       rfcId,
     } = this.props;

     await revisionUnpublish(rfcId);

     NotificationManager.success(locale.getResource('UnpublishMessage'));
   }

   openCsvModal = () => {
     const {
       rfcId,
       showExportCsvPopup,
       createdTime,
     } =  this.props;

     showExportCsvPopup({
       rfcId,
       createdTime,
     });
   }

   openChangeOwnershipModal = () => {
     const {
       rfcId,
       showChangeOwnershipPopup,
       text,
     } =  this.props;

     showChangeOwnershipPopup({
       rfcId,
       rfcName: text,
     });
   }

   setSaveClick = (saveClick) => {
     this.saveClick = saveClick;
   }

   handleSowAnalytics = () => {
     const {
       openAnalytics,
       navigateTo,
       isShowAnalytics,
       rfcId
     } = this.props;

     if (!isShowAnalytics) {
       openAnalytics(rfcId)
     } else {
       navigateTo(rfcId)
     }
   }

   render() {
     const {
       text,
       rfcId,
       isSaved,
       revision,
       isPublished,
       showManagePeoplePopup,
       currentUserId,
       ownerId,
       revisionsList,
       publishError,
       isPublishing,
       isShowAnalytics,
       group
     } = this.props;

     const previewUrl = `${window.location.origin}/showcase/${revision.rfcData.organization_url}?revision=${revision.revisionId}`;
     return (
       <div className="showcase-header">

         <div className="title">
           {
             !isShowAnalytics ? text : <div className='sc-breadcrumb'>
              <span onClick={this.handleSowAnalytics}>{text}</span>  › Analytics
             </div>
           }
         </div>

         {
           !isShowAnalytics && <Fragment>
             <SaveButton
               setSaveClick={this.setSaveClick}
               rfcId={rfcId}
               isSaved={isSaved}
               onSaveClick={this.handleUpdateRevision}
               error={publishError}
               isPublishing={isPublishing}
             />

             <PreviewButton disabled={!isSaved} url={previewUrl} onClick={this.onPreviewClick} />

             <ButtonNormal
               className="rfc-publish"
               //disabled={currentRevisionPublished}
               onClick={this.handlePublishClick}
             >
               {locale.getResource('Publish')}
             </ButtonNormal>

             {
              //  ownerId === currentUserId &&
               <button className="sc-add-user" onClick={showManagePeoplePopup} data-testid="managePeople">
                 <SvgIcon data={userIcon} />
               </button>
             }

             <button className="sc-add-user" onClick={this.handleSowAnalytics} data-testid="showAnalytics">
               <SvgIcon data={chartIcon} />
             </button>

             <Dropdown
               className="dots"
               activeItem={<SvgIcon className="link-icon" data={moreIcon} testid="dropdown" />}
               itemsList={[
                 {
                   title: locale.getResource('Settings'),
                   onItemClick: this.openSetting,
                 },
                 {
                   title: locale.getResource('Unpublish'),
                   onItemClick: this.hanleUnpublish,
                   hide: !isPublished,
                 },
                 {
                   title: locale.getResource('ExportCsv'),
                   onItemClick: this.openCsvModal,
                 },
                 {
                   title: locale.getResource('RestoreRevision'),
                   onItemClick: this.props.showRestoreRevisionPopup,
                   hide: !revisionsList || revisionsList && revisionsList.length < 2,
                 },
                 {
                   title: locale.getResource('ChangeOwnership'),
                   onItemClick: this.openChangeOwnershipModal,
                   hide:  ownerId !== currentUserId,
                 },
                 {
                  title: locale.getResource('Duplicate'),
                  onItemClick: () => {
                    showCreatePopup({
                      enable_search_indexing: false,
                      group,
                      name: `${text} copy`,
                      rfc_id: rfcId,
                      url: `${text.toLowerCase()}-copy`,
                      duplicate: true
                    })
                  },
                },
                {
                  title: locale.getResource('Followers'),
                  onItemClick: this.props.showFollowersPopup,
                }
               ]}
             />
           </Fragment>
         }
       </div>
     );
   }
}

Header.propTypes = {
  text: PropTypes.any,
  showPublishPopup: PropTypes.func,
  showEditPopup: PropTypes.func,
  showManagePeoplePopup: PropTypes.func,
  showExportCsvPopup: PropTypes.func,
  revisionUnpublish: PropTypes.func,
  resetRfcData: PropTypes.func,
  sendStatus: PropTypes.func,
  revisionUpdate: PropTypes.func,
  showRestoreRevisionPopup: PropTypes.func,
  showChangeOwnershipPopup:  PropTypes.func,
  currentRevisionPublished: PropTypes.bool,
  rfcId: PropTypes.string,
  revision: PropTypes.object,
  isLoaded: PropTypes.bool,
  files: PropTypes.object,
  settings: PropTypes.object,
  isSaved: PropTypes.bool,
  isPublished: PropTypes.bool,
  organizationId: PropTypes.string,
  group: PropTypes.string,
  playerConfig: PropTypes.object,
  filtersState: PropTypes.object,
  shortcuts: PropTypes.object,
  currentUserId: PropTypes.string,
  ownerId: PropTypes.string,
  footer: PropTypes.object,
  header: PropTypes.object,
  categories: PropTypes.array,
  createdTime: PropTypes.number,
  firstLoad: PropTypes.bool,
  revisionsList: PropTypes.array,
  publishError: PropTypes.bool,
  isPublishing: PropTypes.bool,
  showCreatePopup: PropTypes.func,
  showFollowersPopup: PropTypes.func,
};

const mapStateToProps = state => ({
  revision: getRevisionState(state),
  isLoaded: isLoaded(state),
  files: getFiles(state),
  isSaved: isCurrentRevisionUpdated(state),
  settings: getSettings(state),
  isPublished: isRevisionPublished(state),
  filtersState: getFiltersState(state),
  shortcuts: getShortcutsState(state),
  ownerId: getOwner(state),
  footer: getFooter(state),
  createdTime: getCreatedTime(state),
  header: getHeader(state),
  firstLoad: getRevisionsFirstLoad(state),
  revisionsList: getRevisionsList(state),
  categories: getCleanCategories(state),
  publishError: getRevisionsPublishError(state),
  isPublishing: isRevisionPublishing(state),
  isShowAnalytics: getShowAnalytics(state),
  layout: getLayout(state)
});

const mapDispatchToProps = {
  showEditPopup,
  revisionUpdate,
  showPublishPopup,
  revisionUnpublish,
  resetRfcData,
  showManagePeoplePopup,
  sendStatus,
  showExportCsvPopup,
  showRestoreRevisionPopup,
  showChangeOwnershipPopup,
  showCreatePopup,
  showFollowersPopup
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
