import React from 'react';

import PropTypes from 'prop-types';

import UploadInput from '@/components/UploadInput';
import SvgIcon from '@/components/SvgIcon/SvgIcon';
import uploadIcon from '@/assets/images/svg/icons/icon-upload.svg';

import './NoFiles.less';

const  NoFiles = props => {
  const {
    isFolder,
    isMyFiles,
    group,
    folderId,
    acceptType,
  } = props;

  return (
    <div className="sc-no-files">
      {
        (isFolder || isMyFiles) && <UploadInput acceptType={acceptType} group={group} folderId={folderId}>
          <SvgIcon
            data={uploadIcon}
          />
          Upload
        </UploadInput>
      }
      {
        isFolder || isMyFiles ?'You have no files uploaded. Start uploading some right now.' : 'Sorry, there are no files on the list.'
      }
    </div>
  );
};

NoFiles.propTypes = {
  isFolder: PropTypes.bool,
  isMyFiles: PropTypes.bool,
  group: PropTypes.string,
  folderId: PropTypes.string,
  acceptType: PropTypes.array,
};

export default NoFiles;
