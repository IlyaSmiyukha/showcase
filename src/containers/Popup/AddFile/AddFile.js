import React, {
  PureComponent, Fragment,
} from 'react';

import {
  connect,
} from 'react-redux';

import PropTypes from 'prop-types';

import {
  getFiles,
  getMyFilesArray,
  getMyFilesOffset,
  getMyFilesTotal,
  getSharedFilesArray,
  getSharedFilesOffset,
  getSharedFilesTotal,
  getMyFilesSearch,
  getMyFilesSearchOffset,
  getMyFilesSearchTotal,
  getSharedFilesSearch,
  getSharedFilesSearchOffset,
  getSharedFilesSearchTotal,
  getFilesLoader,
  getFolders,
  getUploadingState,
  getProcessingState,
  getMyFilesByType,
  getSharedFilesByType,
  getFoldersList
} from '@/store/selectors/files';

import locale from '@/api/locale';

import withPopup from '@/hocs/withPopup';

import FileTile from '@/components/FileTile';
import Input from '@/components/Input';
import Scrollbar from '@/components/Scrollbar';
import Loader from '@/components/Loader';
import NoSearchResults from '@/components/NoSearchResults';
import BackButton from '@/components/BackButton';
import NoFiles from '@/components/NoFiles';

import Controls from './Partials/Controls';
import Navigation from './Partials/Navigation';
import StockTab from './Partials/StockTab';

import SvgIcon from '@/components/SvgIcon/SvgIcon';
import glassIcon from '@/assets/images/svg/icons/icon-glass.svg';
import closeIcon from '@/assets/images/svg/icons/closeModalBtn.svg';

import {
  getWebPagePreviewUrl,
  addNewItems
} from '@/store/actions/categories';

import {
  getSettings,
} from '@/store/selectors/revisions';

import {
  updateHeaderLogo,
  updateBackground,
  updateButton,
} from '@/store/actions/header';

import {
  updateFooterLogo,
} from '@/store/actions/footer';

import {
  fetchMyFiles,
  fetchSharedFiles,
  fetchFolder,
  clearSearchData,
  fetchFoldersList
} from '@/store/actions/files';

import {
  hideSpecialPopup,
  updatePopupInfo,
} from '@/store/actions/view';

const SCROLL_BOTTOM_LOAD_PX = 250; //px
const SCROLL_BOTTOM_DELAY_MS = 50; //ms

import './AddFile.less';

class AddFile extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      tabName: 'my-files',
      showCaseFiles: [],
      search: '',
      showSearch: '',
      currentFolders: [],
      hideFilesFromRender: false,
      selectedFolders: [],
      activeFolder: ''
    };

    this.scroll = {
      timeoutRef: null,
      lastScrollTop: null,
    };
  }

  switchTab = tabName => {
    if (this.state.search) {
      this.clearSearch();
    }

    this.setState({
      tabName,
      currentFolders: [],
      activeFolder: ''
    });

    if (tabName === 'shared' && !this.props.sharedFiles.length || this.props.modalInfo.acceptType) {
      this.props.fetchSharedFiles({type: this.props.modalInfo.acceptType});
    }
  }

  selectFolder = (id) => {
    if (this.state.search) {
      this.clearSearch();
    }
    this.goToFolder(id, true);
  }

  onItemClick = item => {
    const {
      showCaseFiles,
      selectedFolders,
    } = this.state;

    let ids = [item.file_id];

    if (item.type === 'folder') {
      ids = item.extra.folder.items.filter(folderItem => folderItem.type !== 'folder').map(folderItem => folderItem.id);

      if (this.props.modalInfo.path) {
        return;
      }

      const newFolders = selectedFolders.includes(item.file_id) ? selectedFolders.filter(id => id !== item.file_id) : [...selectedFolders,
        item.file_id];
      this.setState({
        selectedFolders: newFolders,
      });
    }

    if (this.props.modalInfo.path) {
      this.setState({
        showCaseFiles: [ids[0]],
      });
      return;
    }

    const newShowCaseFiles = showCaseFiles.filter(videoId => !ids.includes(videoId));

    this.setState({
      showCaseFiles: newShowCaseFiles.length < showCaseFiles.length ? newShowCaseFiles : [...showCaseFiles,
        ...ids],
    });
  }

  handleClose = () => {
    const {
      hideSpecialPopup,
    } = this.props;
    hideSpecialPopup('addFilePopup');
  }

  onSaveClick = () => {
    const {
      updateBackground,
      updateHeaderLogo,
      updateFooterLogo,
      updateButton,
      addNewItems,
      modalInfo,
      group,
      updatePopupInfo,
      getWebPagePreviewUrl,
      fetchFolder,
      settings,
      rfcId
    } = this.props;

    const {
      showCaseFiles,
      selectedFolders,
    } = this.state;

    selectedFolders.forEach(folderId => {
      fetchFolder({folderId, getFullInfo: true});
    });

    this.handleClose();

    switch (modalInfo.path) {
      case 'background':
        updateBackground(showCaseFiles[0], group);
        return;
      case 'header-logo':
        updateHeaderLogo(showCaseFiles[0], group);
        return;
      case 'footer-logo':
        updateFooterLogo(showCaseFiles[0], group);
        return;
      case 'button':
        updateButton({fileId: showCaseFiles[0]}, group);
        return;
      case 'category':
        updatePopupInfo({thumbnail: {file_id: showCaseFiles[0]}});
        if (settings.externalPreviewImageForLinks) {
          getWebPagePreviewUrl('');
        }
        return;
      case 'category-file':
        updatePopupInfo({file_id: showCaseFiles[0]});
        return;
      case 'category-personImg':
        const data = {
          owner_data: {
            personImg: {
              file_id: showCaseFiles[0],
            },
          },
        };
        updatePopupInfo(data);
        return;
      default:
        addNewItems(modalInfo.categoryId, showCaseFiles, null, group, rfcId);
    }
  }

  handleSearchInputChange = (e) => {
    const value = e.target.value;
    if (!!this.state.search && !value) {
      this.setState({
        showSearch: '',
        search: value,
      });
      this.clearSearch();
      return;
    }
    this.setState({
      search: value,
    });
  }

  handleSearch = (e) => {
    const {
      fetchMyFiles,
      fetchSharedFiles,
      modalInfo
    } = this.props;

    const {
      tabName,
      search,
    } = this.state;
    if (!search) {
      return;
    }

    if (e.keyCode === 13) {
      this.setState({
        showSearch: tabName,
      });

      if (tabName === 'my-files') {
        fetchMyFiles({offset: 0, search: this.state.search, type: modalInfo.acceptType});
      } else if (tabName === 'shared') {
        fetchSharedFiles({offset: 0, search: this.state.search, type: modalInfo.acceptType});
      }
    }

    if (e.keyCode === 27) {
      this.clearSearch();
    }
  }

  onScrollFrame = values => {
    const {
      myFilesOffset,
      myFilesTotal,

      sharedFilesOffset,
      sharedFilesTotal,

      myFilesSearchTotal,
      myFilesSearchOffset,

      sharedFilesSearchTotal,
      sharedFilesSearchOffset,

      folders,
      fetchFolder,
      fetchMyFiles,
      fetchSharedFiles,
      modalInfo,
      myFilesByType
    } = this.props;

    const {
      tabName,
      search,
      currentFolders,
    } = this.state;

    if (!values.scrollTop) {
      return
    }

    const scrollBottom = (values.scrollHeight - values.scrollTop - values.clientHeight);

    if (scrollBottom > SCROLL_BOTTOM_LOAD_PX) {
      clearTimeout(this.scroll.timeoutRef);
      this.scroll.timeoutRef = null;
    }

    if (
      this.scroll.lastScrollTop &&
                (scrollBottom <= SCROLL_BOTTOM_LOAD_PX)
    ) {
      if (!this.scroll.timeoutRef) {
        this.scroll.timeoutRef = setTimeout(() => {
          const currentFolderId = currentFolders.length ?  currentFolders[currentFolders.length - 1] : null;
          const currentFolder = currentFolderId ? folders[currentFolderId] : null;
          if (currentFolder && currentFolder.offset < currentFolder.totalFiles) {
            fetchFolder({offset: currentFolder.offset, folderId: currentFolderId, type: modalInfo.acceptType});
            this.scroll.lastScrollTop = values.scrollTop;
            return;
          }
          if (tabName === 'my-files') {
            if (myFilesTotal > myFilesOffset && !search &&  !modalInfo.acceptType) {
              fetchMyFiles({offset:  myFilesOffset});
            } else {
              fetchMyFiles({offset:  myFilesByType.offset, type: modalInfo.acceptType});
            }
            if (myFilesSearchTotal > myFilesSearchOffset && search) {
              fetchMyFiles({offset:  myFilesSearchOffset, search, type: modalInfo.acceptType});
            }
          } else if (tabName !== 'my-files') {
            if (sharedFilesTotal > sharedFilesOffset && !search) {
              fetchSharedFiles({offset: sharedFilesOffset, search, type: modalInfo.acceptType});
            }
            if (sharedFilesSearchTotal > sharedFilesSearchOffset && search) {
              fetchMyFiles({offset:  sharedFilesSearchOffset, search, type: modalInfo.acceptType});
            }
          }
        }, SCROLL_BOTTOM_DELAY_MS);
      }
    }

    this.scroll.lastScrollTop = values.scrollTop;
  }

  clearSearch = () => {
    this.setState({
      search: '',
      showSearch: '',
    });
    this.props.clearSearchData();
  }

  goToFolder = (id, refresh = false) => {
    const {
      fetchFolder,
      modalInfo,
      pusher
    } = this.props;

    if(this.state.tabName === 'my-files' || !this.state.tabName) {
      this.setState({
        currentFolders: refresh ? [id]: [...this.state.currentFolders,
          id],
        showCaseFiles: [],
        activeFolder: refresh || (!refresh && !this.state.activeFolder) ? id :  this.state.activeFolder,
        tabName: this.state.tabName === 'my-files' ? '' : this.state.tabName
      });
    } else {
      this.setState({
        currentFolders: refresh ? [id]: [...this.state.currentFolders,
          id],
        showCaseFiles: [],
        activeFolder: refresh ? id :  '',
        tabName: refresh ? '' : this.state.tabName
      });
    }

    fetchFolder({folderId: id, type: modalInfo.acceptType});
    if (pusher && pusher.subscribeOnFolderChannel) {
      pusher.subscribeOnFolderChannel(id);
    }
  }

  closeFolder = () => {
    const {
      currentFolders,
      activeFolder,
      tabName
    } = this.state;
    const folders = [...currentFolders];
    folders.pop();
    this.setState({
      currentFolders: folders,
      activeFolder: folders.length && activeFolder ? activeFolder : '',
      tabName: !tabName && !folders.length ?  'my-files' : tabName,
    });
  }

  componentWillUnmount() {
    this.clearSearch();
  }

  componentDidMount() {
    const {
      modalInfo,
      fetchMyFiles,
      fetchFoldersList,
      foldersList
    } = this.props;
    if (modalInfo.acceptType) {
      fetchMyFiles({type: modalInfo.acceptType});
    }
    if(!foldersList.length) {
      fetchFoldersList()
    }
    this.clearSearch();
  }

  static getDerivedStateFromProps(nextProps, prevState){
    if (prevState.currentFolders.filter(id => !Object.keys(nextProps.folders).includes(id)).length && nextProps.showLoader) {
      return {
        hideFilesFromRender: true,
      };
    }
    if (prevState.hideFilesFromRender && !nextProps.showLoader) {
      return {
        hideFilesFromRender: false,
      };
    }
    return null;
  }

  renderSearch = () => {
    const {
      search,
    } = this.state;

    return <div className="showcase-add-popup-search">
      <SvgIcon
        data={glassIcon}
      />
      <Input placeholder="Type to search" type="text" onChange={this.handleSearchInputChange} onKeyDown={this.handleSearch} value={search}/>
      {search &&
        <span className="sc-clear-search" onClick={this.clearSearch}>
          <SvgIcon
            data={closeIcon}
          />
        </span>
      }
    </div>;
  }

  renderFileTabs = () => {
    const {
      showCaseFiles,
      showSearch,
      search,
      tabName,
      currentFolders,
      hideFilesFromRender,
    } = this.state;

    const {
      showLoader,
      modalInfo,
      myFiles,
      myFilesSearch,
      uploadingState,
      processingState,
      sharedFiles,
      sharedFilesSearch,
      folders,
      allFiles,
      group,
      myFilesByType,
      sharedFilesByType
    } = this.props;

    const myFilesList = showSearch === 'my-files' ? myFilesSearch : modalInfo.acceptType ? myFilesByType.files : myFiles;
    const sharedFilesList = showSearch === 'shared' ? sharedFilesSearch : modalInfo.acceptType ? sharedFilesByType.files : sharedFiles;

    let files = [];

    if (tabName === 'my-files') {
      files = myFilesList;
    }

    if (tabName === 'shared') {
      files = sharedFilesList;
    }

    if (currentFolders.length && folders[currentFolders[currentFolders.length - 1]]) {
      files = folders[currentFolders[currentFolders.length - 1]].files;
    }

    const folderId = currentFolders.length ? currentFolders[currentFolders.length - 1] : null;

    return   <Scrollbar
      onScrollFrame={this.onScrollFrame}>
      <div className="sc-add-popup-files">
        {
          !hideFilesFromRender && files.filter(file => modalInfo.acceptType ? modalInfo.acceptType.includes(file.type) : true).map((file) => (
            <FileTile
              key={`tile-${file.file_id}`}
              selected={file.type === 'folder' ?  !!file.extra.folder.items.filter(folderItem => showCaseFiles.includes(folderItem.id) ).length: showCaseFiles.includes(file.file_id)}
              file={file}
              uploadingState={uploadingState}
              processingState={processingState}
              onClick={() => {
                this.onItemClick(file);
              }}
              onDoubleClick={this.goToFolder}
              filesList={allFiles}
              acceptType={modalInfo.acceptType}
            />
          ))
        }
        {
          (!files.length && !showLoader && !showSearch) && <NoFiles
            isMyFiles={tabName === 'my-files'}
            isFolder={!!currentFolders.length}
            group={group}
            folderId={folderId}
            acceptType={modalInfo.acceptType}
          />
        }
        {showLoader && <Loader />}
        {showSearch && !files.length && !showLoader && <NoSearchResults search={search}/>}
      </div>
    </Scrollbar>;
  }

  render() {
    const {
      currentFolders,
      showCaseFiles,
      activeFolder,
      tabName
    } = this.state;

    const {
      foldersList,
      modalInfo,
      group
    } = this.props;
    const folderId = currentFolders.length ? currentFolders[currentFolders.length - 1] : null;

    return <div className="sc-add-popup">
      <Navigation  foldersList={foldersList} 
                   activeFolder={activeFolder} 
                   selectFolder={this.selectFolder}
                   acceptType={modalInfo.acceptType}
                   group={group}
                   folderId={folderId}
                   activeTab={tabName}
                   switchTab={this.switchTab}/>

      <div className="sc-add-popup-content">
        {!currentFolders.length && this.renderSearch()}
        {!!currentFolders.length && <BackButton onClick={this.closeFolder}/>}

        <div className="sc-add-popup-tabs">
          {(tabName === 'my-files' || activeFolder) && this.renderFileTabs()}
          {tabName === 'stock' && <StockTab />}
          {tabName === 'shared' && this.renderFileTabs()}
        </div>

        <Controls handleClose={this.handleClose}
                  onSaveClick={this.onSaveClick}
                  isSaveDisabled={!showCaseFiles.length}
                  saveLabel={modalInfo.buttonLabel}/>
      </div>
    </div>;
  }
}

AddFile.propTypes = {
  addNewItems: PropTypes.func,
  fetchMyFiles: PropTypes.func,
  fetchSharedFiles: PropTypes.func,
  fetchFolder: PropTypes.func,
  updateBackground: PropTypes.func,
  updateHeaderLogo: PropTypes.func,
  updateFooterLogo: PropTypes.func,
  clearSearchData: PropTypes.func,
  hideSpecialPopup: PropTypes.func,
  updateButton:  PropTypes.func,
  myFiles: PropTypes.arrayOf(PropTypes.object),
  myFilesOffset: PropTypes.number,
  myFilesTotal: PropTypes.number,
  sharedFiles: PropTypes.arrayOf(PropTypes.object),
  sharedFilesTotal: PropTypes.number,
  sharedFilesOffset: PropTypes.number,
  myFilesSearch: PropTypes.arrayOf(PropTypes.object),
  myFilesSearchOffset: PropTypes.number,
  myFilesSearchTotal: PropTypes.number,
  sharedFilesSearch: PropTypes.arrayOf(PropTypes.object),
  sharedFilesSearchTotal: PropTypes.number,
  sharedFilesSearchOffset: PropTypes.number,
  allFiles: PropTypes.object,
  modalInfo: PropTypes.object,
  group: PropTypes.string,
  showLoader: PropTypes.bool,
  updatePopupInfo: PropTypes.func,
  folders: PropTypes.object,
  myFilesByType: PropTypes.object,
  sharedFilesByType: PropTypes.object,
  foldersList: PropTypes.array,

  getWebPagePreviewUrl:  PropTypes.func,
  uploadingState: PropTypes.object,
  processingState: PropTypes.object,
  settings: PropTypes.object,
  pusher:  PropTypes.object,
};

const mapStateToProps = state => ({
  myFiles: getMyFilesArray(state),
  myFilesOffset: getMyFilesOffset(state),
  myFilesTotal: getMyFilesTotal(state),
  sharedFiles: getSharedFilesArray(state),
  sharedFilesOffset: getSharedFilesOffset(state),
  sharedFilesTotal: getSharedFilesTotal(state),
  myFilesSearch: getMyFilesSearch(state),
  myFilesSearchOffset: getMyFilesSearchOffset(state),
  myFilesSearchTotal: getMyFilesSearchTotal(state),
  sharedFilesSearch: getSharedFilesSearch(state),
  sharedFilesSearchOffset: getSharedFilesSearchOffset(state),
  sharedFilesSearchTotal: getSharedFilesSearchTotal(state),
  allFiles: getFiles(state),
  showLoader: getFilesLoader(state),
  folders: getFolders(state),
  settings: getSettings(state),
  uploadingState: getUploadingState(state),
  processingState: getProcessingState(state),
  myFilesByType: getMyFilesByType(state),
  sharedFilesByType: getSharedFilesByType(state),
  foldersList: getFoldersList(state)
});

const mapDispatchToProps = {
  updateHeaderLogo,
  updateFooterLogo,
  updateBackground,
  fetchMyFiles,
  fetchSharedFiles,
  fetchFolder,
  clearSearchData,
  updateButton,
  hideSpecialPopup,
  updatePopupInfo,
  getWebPagePreviewUrl,
  addNewItems,
  fetchFoldersList
};

export default connect(mapStateToProps, mapDispatchToProps)(withPopup(AddFile));
