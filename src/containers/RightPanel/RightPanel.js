import React, {
  PureComponent,
  Fragment,
} from 'react';

import {
  connect,
} from 'react-redux';

import PropTypes from 'prop-types';

import locale from '@/api/locale';

import classnames from 'classnames';

import Dropdown from '@/components/Dropdown';
import FileTile from '@/components/FileTile';
import Scrollbar from '@/components/Scrollbar';
import Loader from '@/components/Loader';

import {
  Droppable,
  Draggable,
} from 'react-beautiful-dnd';

import {
  getFiles,
  getMyFilesArray,
  getSharedFilesArray,
  getMyFilesOffset,
  getSharedFilesOffset,
  getMyFilesTotal,
  getSharedFilesTotal,
  getFilesLoader,
  getMyFilesSearch,
  getMyFilesSearchOffset,
  getMyFilesSearchTotal,
  getSharedFilesSearch,
  getSharedFilesSearchOffset,
  getSharedFilesSearchTotal,
  getFolders,
  getUploadingState,
  getProcessingState,
  getSearchQuery,
} from '@/store/selectors/files';

import {
  getSettings,
} from '@/store/selectors/revisions';

import {
  fetchMyFiles,
  fetchSharedFiles,
  fetchFolder,
  clearSearchData,
} from '@/store/actions/files';

import Input from '@/components/Input';
import NoSearchResults from '@/components/NoSearchResults';
import BackButton from '@/components/BackButton';
import NoFiles from '@/components/NoFiles';

import SvgIcon from '@/components/SvgIcon/SvgIcon';
import glassIcon from '@/assets/images/svg/icons/icon-glass.svg';
import closeIcon from '@/assets/images/svg/icons/closeModalBtn.svg';

const SCROLL_BOTTOM_LOAD_PX = 250; //px
const SCROLL_BOTTOM_DELAY_MS = 50; //ms

import './RightPanel.less';

const getItemStyle = (isDragging, draggableStyle) => {
  return isDragging ? draggableStyle : {};
};

const fileTileClassName = dragging => (classnames({
  'file-tile-wrapper': true,
  'file-tile-draggable': dragging,
}));


class RightPanel extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isMyFiles: true,
      showSearch: '',
      search: '',
      currentFolders: [],
      hideFilesFromRender: false,
    };

    this.scroll = {
      timeoutRef: null,
      lastScrollTop: null,
    };
  }

  onDropDownItemClick = () => {
    if (this.state.search) {
      this.clearSearch();
    }
    this.setState({
      isMyFiles: !this.state.isMyFiles,
      currentFolders: [],
    }, () => {
      if (!this.state.isMyFiles && !this.props.sharedFiles.length) {
        this.props.fetchSharedFiles({});
      }
    });

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
      fetchSharedFiles,
      fetchMyFiles,
      fetchFolder,
    } = this.props;
    const {
      isMyFiles,
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
            fetchFolder({offset: currentFolder.offset, folderId: currentFolderId});
            this.scroll.lastScrollTop = values.scrollTop;
            return;
          }
          if (isMyFiles) {
            if (myFilesTotal > myFilesOffset && !search) {
              fetchMyFiles({offset:  myFilesOffset});
            }
            if (myFilesSearchTotal > myFilesSearchOffset && search) {
              fetchMyFiles({offset:  myFilesSearchOffset, search});
            }
          } else if (!isMyFiles) {
            if (sharedFilesTotal > sharedFilesOffset && !search) {
              fetchSharedFiles({offset: sharedFilesOffset, search});
            }
            if (sharedFilesSearchTotal > sharedFilesSearchOffset && search) {
              fetchSharedFiles({offset:  sharedFilesSearchOffset, search});
            }
          }
        }, SCROLL_BOTTOM_DELAY_MS);
      }
    }

    this.scroll.lastScrollTop = values.scrollTop;
  }

  handleSearchInputChange = (e) => {
    this.setState({
      search: e.target.value,
    });

    if (!e.target.value) {
      this.setState({
        showSearch: '',
      });
    }
  }

  handleSearch = (e) => {
    const {
      fetchMyFiles,
      fetchSharedFiles,
    } = this.props;

    const {
      isMyFiles,
      search,
    } = this.state;

    if (e.keyCode === 13) {

      this.setState({
        showSearch: isMyFiles ? 'mine' : 'shared',
      });
      isMyFiles ? fetchMyFiles({offset: 0, search}) : fetchSharedFiles({offset: 0, search});
    }

    if (e.keyCode === 27) {
      this.clearSearch();
    }
  }

  clearSearch = () => {
    this.setState({
      search: '',
      showSearch: '',
    });
    this.props.clearSearchData();
  }

  goToFolder = (folderId) => {
    const {
      fetchMyFiles,
      folders,
      fetchFolder,
    } = this.props;

    this.setState({
      currentFolders: [...this.state.currentFolders,
        folderId],
    });

    fetchFolder({folderId});
  }

  closeFolder = () => {
    this.setState({
      currentFolders: this.state.currentFolders.slice(0, -1),
    });
  }

  static getDerivedStateFromProps(nextProps, prevState){
    if (prevState.currentFolders.filter(id => !Object.keys(nextProps.folders).includes(id)).length && nextProps.showLoader) {
      return {
        hideFilesFromRender: true,
      };
    }
    if (prevState.hideFilesFromRender && (!nextProps.showLoader)) {
      return {
        hideFilesFromRender: false,
      };
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.searchQuery && !this.props.searchQuery) {
      this.setState({
        search: '',
        showSearch: '',
      });
    }
  }

  renderHeader = () => {
    const { isMyFiles } = this.state;

    return (
      <div className="showcase-right-panel-header" >

        <Dropdown activeItem={isMyFiles ? locale.getResource('MyFiles') : locale.getResource('SharedVideos')}
          itemsList={[{
            title: locale.getResource('MyFiles'),
            onItemClick: this.onDropDownItemClick,
          },
          {
            title: locale.getResource('SharedVideos'),
            onItemClick: this.onDropDownItemClick,
          }]} />
      </div>
    );
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

  renderFilesTab = isMyFiles => {
    const {
      showSearch,
      search,
      currentFolders,
      hideFilesFromRender,
    } = this.state;

    const {
      showLoader,
      myFilesSearch,
      sharedFilesSearch,
      myFiles,
      sharedFiles,
      uploadingState,
      processingState,
      folders,
      allFiles,
      settings,
      group,
    } = this.props;

    const myFilesShow = showSearch === 'mine' ? myFilesSearch : myFiles;
    const sharedFilesShow = showSearch === 'shared' ? sharedFilesSearch : sharedFiles;

    let files = isMyFiles ? myFilesShow : sharedFilesShow;
    if (currentFolders.length && folders[currentFolders[currentFolders.length - 1]]) {
      files = folders[currentFolders[currentFolders.length - 1]].files;
    }

    const folderId = currentFolders.length ? currentFolders[currentFolders.length - 1] : null;

    return (
      <Scrollbar onScrollFrame={this.onScrollFrame}>
        <Droppable
          droppableId={'new'}
          isDropDisabled={true}
        >
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {
                !hideFilesFromRender && files.map((item, index) => (
                  <Draggable
                    key={item.file_id}
                    draggableId={item.file_id}
                    index={index}
                  >
                    {
                      (provided, snapshot) => (
                        <Fragment>
                          <div className={fileTileClassName(snapshot.isDragging)}>
                            {
                              (snapshot.isDragging) && (
                                <div className="file-tile-clone">
                                  <FileTile
                                    file={item}
                                    uploadingState={uploadingState}
                                    processingState={processingState}
                                    onDoubleClick={this.goToFolder}
                                    filesList={allFiles}
                                    settings={settings}
                                    fetchFolder={this.props.fetchFolder}
                                  />
                                </div>
                              )
                            }
                            {
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                              >
                                <FileTile
                                  file={item}
                                  uploadingState={uploadingState}
                                  isDragging={snapshot.isDragging}
                                  processingState={processingState}
                                  onDoubleClick={this.goToFolder}
                                  filesList={allFiles}
                                  settings={settings}
                                  fetchFolder={this.props.fetchFolder}
                                />
                              </div>
                            }
                          </div>
                        </Fragment>

                      )
                    }
                  </Draggable>
                ))
              }
              {showLoader && <Loader />}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        {
          (!files.length && !showLoader && !showSearch) && <NoFiles
            isMyFiles={isMyFiles}
            isFolder={!!currentFolders.length}
            group={group}
            folderId={folderId}
          />
        }
        {showSearch && !showLoader && (isMyFiles ? !myFilesShow.length : !sharedFilesShow.length) && <NoSearchResults search={search}/>}
      </Scrollbar>
    );
  }

  render() {
    const {
      isMyFiles,
      currentFolders,
    } = this.state;

    return (
      <div className="showcase-right-panel">
        {this.renderHeader()}
        <div className="showcase-right-panel-content">
          {!currentFolders.length && this.renderSearch()}
          {!!currentFolders.length && <BackButton onClick={this.closeFolder}/>}
          {this.renderFilesTab(isMyFiles)}
        </div>
      </div>
    );
  }
}

RightPanel.propTypes = {
  myFiles: PropTypes.arrayOf(PropTypes.object),
  sharedFiles: PropTypes.arrayOf(PropTypes.object),
  allFiles: PropTypes.object,
  dragData: PropTypes.object,
  fetchMyFiles: PropTypes.func,
  fetchSharedFiles: PropTypes.func,
  fetchFolder: PropTypes.func,
  clearSearchData: PropTypes.func,
  myFilesOffset: PropTypes.number,
  sharedFilesOffset: PropTypes.number,
  myFilesTotal: PropTypes.number,
  sharedFilesTotal: PropTypes.number,
  showLoader: PropTypes.bool,
  myFilesSearch: PropTypes.arrayOf(PropTypes.object),
  myFilesSearchOffset: PropTypes.number,
  myFilesSearchTotal: PropTypes.number,
  sharedFilesSearch: PropTypes.arrayOf(PropTypes.object),
  sharedFilesSearchTotal: PropTypes.number,
  sharedFilesSearchOffset: PropTypes.number,
  folders: PropTypes.object,
  searchQuery: PropTypes.string,

  uploadingState: PropTypes.object,
  processingState: PropTypes.object,
  settings:  PropTypes.object,
  group: PropTypes.string,
};

const mapStateToProps = state => ({
  myFiles: getMyFilesArray(state),
  sharedFiles: getSharedFilesArray(state),
  allFiles: getFiles(state),
  myFilesOffset: getMyFilesOffset(state),
  sharedFilesOffset: getSharedFilesOffset(state),
  myFilesTotal: getMyFilesTotal(state),
  sharedFilesTotal: getSharedFilesTotal(state),
  showLoader: getFilesLoader(state),
  myFilesSearch: getMyFilesSearch(state),
  myFilesSearchOffset: getMyFilesSearchOffset(state),
  myFilesSearchTotal: getMyFilesSearchTotal(state),
  sharedFilesSearch: getSharedFilesSearch(state),
  sharedFilesSearchOffset: getSharedFilesSearchOffset(state),
  sharedFilesSearchTotal: getSharedFilesSearchTotal(state),
  folders: getFolders(state),
  settings: getSettings(state),
  uploadingState: getUploadingState(state),
  processingState: getProcessingState(state),
  searchQuery: getSearchQuery(state),
});

const mapDispatchToProps = {
  fetchMyFiles,
  fetchSharedFiles,
  fetchFolder,
  clearSearchData,
};

export default connect(mapStateToProps, mapDispatchToProps)(RightPanel);
