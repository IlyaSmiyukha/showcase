import React, {
  PureComponent,
  Fragment,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import moment from 'moment';

import './FileTile.less';

import TileActions from './Parts/TileActions';
import FolderPreview from './Parts/FolderPreview';
import PublishedDate from './Parts/PublishedDate';
import ProcessingFailed from './Parts/ProcessingFailed'
import { noPreview } from './Parts/NoPreview'


import {
  formatDuration,
  getFileType
} from '@/helpers';

class FileTile extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      fileEntity: props.filesList[props.file.file_id],
      fakeProcessing: 0
    };
    this.progressInterval = null
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.filesList[nextProps.file.file_id] && nextProps.filesList[nextProps.file.file_id] !== prevState.fileEntity) {
      return {
        fileEntity: nextProps.filesList[nextProps.file.file_id],
      };
    }
    return null;
  }

  componentDidMount() {
    const {
      fileEntity
    } = this.state;
    if (fileEntity && fileEntity.status === 'processing' && !this.props.processingState[fileEntity.file_id]) {
      this.runFakeProgress()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      fileEntity
    } = this.state;

    if (fileEntity.status !== prevState.fileEntity.status || !this.props.processingState[fileEntity.file_id] > this.state.fakeProcessing) {
      clearInterval(this.progressInterval)
      this.setState({
        fakeProcessing: 0
      })
    }
  }

  runFakeProgress = () => {
    this.progressInterval = setInterval(() => {
      if (this.state.fakeProcessing === 98) {
        clearInterval(this.progressInterval)
      }
      this.setState({fakeProcessing: this.state.fakeProcessing + 1})
    }, 7000)
  }

  getThumb = () => {
    const {
      filesList,
      file,
    } = this.props;

    const currentFile = file.thumbnail ? filesList[file.thumbnail.file_id] : this.state.fileEntity;

    if (file.type === 'link' && file.previewUrl) {
      return file.previewUrl.includes('http') ? file.previewUrl : `//${file.previewUrl}`;
    }

    const thumb = _.get(currentFile, 'urls.thumbs.640x360.status') !== 'failed' && _.get(currentFile, 'urls.thumbs.640x360.url')
      || _.get(currentFile, 'urls.thumbs.400.status') !== 'failed' && _.get(currentFile, 'urls.thumbs.400.url')
      || _.get(currentFile, 'urls.thumbs.300x225.status') !== 'failed' && _.get(currentFile, 'urls.thumbs.300x225.url');

    if (!thumb && (file.type === 'video' || file.type === 'performance' || file.type === 'image')) {
      return noPreview
    }

    return thumb;
  };

  getProgressState = () => {
    const {
      file,
      uploadingState,
      processingState,
      filesList,
    } = this.props;

    let id = file.file_id;
    let status = file.status;

    if (file.thumbnail) {
      id = file.thumbnail.file_id;
      status = filesList[id] ?  filesList[id].status : status;
    }
    let progressState = 0;
    if (status === 'uploading' && uploadingState[id]) {
      progressState = uploadingState[id];
    } else  if (status === 'processing' && processingState[id]) {
      progressState = processingState[id];
    }

    return progressState;
  }

  getFileStatus = () => {
    const {
      file,
      filesList,
    } = this.props;

    const {
      fileEntity,
    } = this.state;

    let progressState = fileEntity ? fileEntity.status === 'uploading' || fileEntity.status === 'processing' : '';

    if (file.thumbnail && file.thumbnail.file_id && filesList[file.thumbnail.file_id]) {
      progressState = filesList[file.thumbnail.file_id].status === 'uploading' || filesList[file.thumbnail.file_id].status === 'processing';
    }

    return progressState;
  }

  getUserImage = () => {
    const {
      file,
      filesList,
    } = this.props;
    let url = '';
    if (_.get(file, 'owner_data.personImg.file_id')) {
      url = _.get(filesList[file.owner_data.personImg.file_id], 'urls.file');
    } else {
      url = _.get(file, 'owner_data.avatar') || _.get(file, 'owner_data.avatar_small');
    }
    return url;
  }

  getFolderInfo = () => {
    const {
      file,
      acceptType
    } = this.props;
    //.filter(item => acceptType && acceptType.length ? acceptType.includes(item.type) : true)
    return file.extra.folder.items.reduce((acc, item) => {
      if (item.type) {
        item.type === 'folder' ? acc.folder++ : acc.file++;
      }
      return acc;
    }, {folder: 0, file: 0});
  }

  componentDidUpdate(prevProps) {
    const {
      file,
    } = this.props;

    if (!prevProps.isDragging && this.props.isDragging && file.type === 'folder') {
      this.props.fetchFolder({folderId: this.props.file.file_id, getFullInfo: true});
    }
  }

  render() {
    const {
      file,
      onDeleteClick,
      editWebItem,
      editItem,
      filesList,
      itemIndex,
      selected,
      onClick,
      isDragging,
      onDoubleClick,
      settings,
      acceptType
    } = this.props;

    const thumb = this.getThumb();
    const fileType = getFileType(file);
    const progressStateFromStore = this.getProgressState();
    const progressState = progressStateFromStore && progressStateFromStore >  this.state.fakeProcessing ? progressStateFromStore : this.state.fakeProcessing;
    const showLoading = this.getFileStatus();
    const title = file.name ? file.name : 'No title';
    const showCategoryUi = !!onDeleteClick || isDragging;
    const personName = _.get(file, 'owner_data.personName', '') ||  `${_.get(file, 'owner_data.first_name', 'No name')} ${_.get(file, 'owner_data.last_name', '')}`;
    const personImg = this.getUserImage();
    const isFolder = file.type === 'folder';
    const folderInfo = isFolder ? this.getFolderInfo() : {};
    const duration = _.get(file, 'extra.video.duration', 0) || _.get(file, 'extra.performance.duration', 0) || _.get(file, 'extra.audio.duration', 0);

    const classNameWrapper =  classnames({
      'sc-tile-wrapper': true,
      'sc-tile-in-category': showCategoryUi,
      selected,
    });

    const classNamesTile = classnames({
      loading: true,
      'sc-file-tile': true,
      'sc-folder-tile': isFolder,
    });

    const classNamePreview = classnames({
      'sc-tile-img-wrapper': true,
      'sc-tile-document': file.type === 'file' || file.type === 'document',
      'sc-tile-webpage': file.type === 'link',
      'sc-tile-project': file.type === 'project',
    });

    const classNamePerson = classnames({
      'sc-person-info': true,
      'sc-person-info-active': showCategoryUi && settings.personSettings,
    });

    return (
      <div
        className={classNameWrapper}
        onDoubleClick={()=> {
          (onDoubleClick && isFolder)? onDoubleClick(file.file_id) : null;
        }}
      >
        <div
          className={classNamesTile}
          onClick={onClick}
        >
          <div className={classNamePreview}>

            {
              isFolder && <FolderPreview file={file} filesList={filesList} folderInfo={folderInfo} acceptType={acceptType}/>
            }

            {
              (!showLoading && thumb) && <img src={thumb} alt="" />
            }

            {
              file.status === 'failed' && <ProcessingFailed />
            }

            {
              showLoading &&
              <Fragment>
                <span  className="sc-uploading-progress" style={{transform:`translateX(${progressState}%)`}}/>
                <span className="sc-uploading">
                  <span>{file.thumbnail ? filesList[file.thumbnail.file_id].status : file.status}</span>
                  <span>{progressState}%</span>
                </span>
              </Fragment>
            }

            {
              !!duration && <div className="sc-timecode">
                <span>{formatDuration(duration)}</span>
              </div>
            }

            {
              (showCategoryUi && !settings.hideCardType) && <div className="sc-file-type">
                {fileType}
              </div>
            }
          </div>

          <div className="sc-title-info-wrapper">
            {
              (!showCategoryUi || showCategoryUi && !settings.hideCardTitle) && <h6 title={title}>{title}</h6>
            }

            {
              showCategoryUi && settings.showCardPublishedDate && <PublishedDate timestamp={file.published}/>
            }

            <p className={classNamePerson}>
              {!isFolder && <Fragment>
                {
                  (showCategoryUi && settings.personSettings) && (
                    <span className="sc-owner-photo">
                      {personImg && <img src={personImg} />}
                    </span>
                  )
                }

                {(!showCategoryUi || (showCategoryUi && settings.personSettings)) &&  <span>
                  <span className="sc-person-name">{personName}</span>
                  {_.get(file, 'owner_data.personDescr') && <span className="sc-person-descr">{ _.get(file, 'owner_data.personDescr', '')}</span>}
                </span>}
              </Fragment>}
            </p>

            {
              !showCategoryUi &&
              <p>
                {!isFolder && <span>{moment.unix(file.created).format('MMM D, YYYY')} | {file.views} views</span>}
                {isFolder && <span>{folderInfo.file} files </span>}
                {!!folderInfo.folder &&<span className="sc-folders-length">| {folderInfo.folder} folders</span>}
                <span className="sc-file-type">
                  {fileType}
                </span>
              </p>
            }

            {showCategoryUi && <TileActions file={file}
              editWebItem={editWebItem}
              editItem={editItem}
              onDeleteClick={() => {
                onDeleteClick(file.card_id, itemIndex);
              }}
              itemIndex={itemIndex}
              fileType={fileType}/>}
          </div>
        </div>
      </div>
    );
  }

};

FileTile.defaultProps = {
  onClick: null,
  onDeleteClick: null,
};

FileTile.propTypes = {
  file: PropTypes.object,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  fetchFolder: PropTypes.func,
  uploadingState: PropTypes.object,
  processingState: PropTypes.object,
  filesList:  PropTypes.object,
  editWebItem: PropTypes.func,
  editItem: PropTypes.func,
  itemIndex: PropTypes.number,
  isDragging: PropTypes.bool,
  settings: PropTypes.object,
  acceptType: PropTypes.array
};

export default FileTile;
