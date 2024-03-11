import React, {
  PureComponent,
  Fragment,
} from 'react';

import {
  connect,
} from 'react-redux';

import PropTypes from 'prop-types';

import { showShortcutsPopup } from '@/store/actions/view';

import {
  getFiles,
  getUploadingState,
  getProcessingState,
} from '@/store/selectors/files';

import {
  deleteShortcut,
} from '@/store/actions/shortcuts';

import SvgIcon  from '@/components/SvgIcon';
import editIcon from '@/assets/images/svg/icons/icon-edit.svg';
import trashIcon from '@/assets/images/svg/icons/icon-trash.svg';

import './ShortcutItem.less';

class ShortcutItem extends PureComponent {

  constructor(props) {
    super(props);
  }

  handleClick = () => {
    this.props.showShortcutsPopup({
      ...this.props.shortcut,
      action: 'edit',
    });
  }

  handleDelete = () => {
    this.props.deleteShortcut(this.props.shortcut.id);
  }

  getProgressState = (state = 0) => {
    const {
      shortcut,
      uploadingState,
      processingState,
    } = this.props;

    if (!shortcut.thumbnail) {
      return state;
    }

    const id = shortcut.thumbnail.file_id;

    let progressState = state;

    if (uploadingState[id]) {
      progressState = uploadingState[id];
    } else  if (processingState[id]) {
      progressState = processingState[id];
    }

    return progressState;
  }

  getFileStatus = () => {
    const {
      shortcut,
      files,
    } = this.props;

    if (!shortcut.thumbnail) {
      return false;
    }

    return files[shortcut.thumbnail.file_id] && (files[shortcut.thumbnail.file_id].status === 'uploading' || files[shortcut.thumbnail.file_id].status === 'processing');
  }

  render() {
    const {
      shortcut,
      files,
    } = this.props;

    const fileId = shortcut.thumbnail ? shortcut.thumbnail.file_id : null;

    const styles= {
      backgroundImage: `url(${_.get(files[fileId] && files[fileId], 'urls.file', '')})`,
    };
    let progressState = 0;
    progressState = this.getProgressState(progressState);
    const showLoading = this.getFileStatus();


    return (
      <div className="sc-shortcut-item"  style={styles}>
        {
          showLoading && <Fragment>
            <span  className="sc-uploading-progress" style={{transform:`translateX(${progressState}%)`}} />
            <span className="sc-uploading">
              <span>file {files[fileId] && files[fileId].status }</span>
              <span>{progressState}%</span>
            </span>
          </Fragment>
        }

        <span className="sc-shortcut-click-overlay" onClick={this.handleClick} data-testid="edit"/>
        <span>{!showLoading && shortcut.name}</span>
        <span className="sc-delete-shortcut" role="button" onClick={this.handleDelete}>
          <SvgIcon
            className="delete-icon"
            data={trashIcon}
          />
        </span>


        <SvgIcon
          className="edit-icon"
          data={editIcon}
        />
      </div>
    );
  }
}

ShortcutItem.propTypes = {
  showShortcutsPopup: PropTypes.func,
  deleteShortcut: PropTypes.func,
  files: PropTypes.object,
  shortcut: PropTypes.object,
  uploadingState: PropTypes.object,
  processingState: PropTypes.object,
};

const mapStateToProps = state => ({
  files: getFiles(state),
  uploadingState: getUploadingState(state),
  processingState: getProcessingState(state),
});

const mapDispatchToProps = {
  showShortcutsPopup,
  deleteShortcut,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShortcutItem);
