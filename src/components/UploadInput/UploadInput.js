import React, {
  PureComponent,
} from 'react';

import PropTypes from 'prop-types';

import './UploadInput.less';

import store from '@/store/store';
import {uploadFile} from '@/store/actions/files';

class UploadInput extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      file: {},
    };
  }

  handleChange = (e) => {
    const file = e.target.files[0];

    const {
      group,
      folderId,
    } = this.props;

    store.dispatch(uploadFile(file, group, folderId));
  }


  render() {

    const acceptType = this.props.acceptType ? this.props.acceptType.reduce((acc, current) => `${acc}${current.includes('video') ? 'video/mp4,video/x-m4v,video/*' : current +'/*'},`, '') : '';

    return (
      <div className="sc-upload-wrap">
        <input type="file" id="sc-upload" onChange={this.handleChange} accept={acceptType}/>
        <label htmlFor="sc-upload">{this.props.children}</label>
      </div>
    );
  }
}

UploadInput.propTypes = {
  acceptType: PropTypes.arrayOf(PropTypes.string),
  group: PropTypes.string,
  folderId: PropTypes.string,
};


export default UploadInput;
