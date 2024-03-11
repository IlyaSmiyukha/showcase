import React from 'react';
import PropTypes from 'prop-types';

import SvgIcon from '@/components/SvgIcon/SvgIcon';
import iconFolder from '@/assets/images/svg/icons/icon-folder.svg';

import './FolderPreview.less';

const FolderPreview = ({ filesList, file, acceptType }) => {

  const getThumb = id => {
    const file = filesList[id];
    let thumb = '';

    if (file)  {
      const thumb16x9 = _.get(file, 'urls.thumbs.427x240.status') !== 'failed' && _.get(file, 'urls.thumbs.427x240.url');
      const thumb300x225 = _.get(file, 'urls.thumbs.300x225.status') !== 'failed' && _.get(file, 'urls.thumbs.300x225.url');
      thumb = thumb16x9 || thumb300x225;
    }
    return thumb;
  }

  const folderFiles = _.get(file, 'extra.folder.items', []).filter(item => acceptType && acceptType.length ? acceptType.includes(item.type) : item.type );
  const folderHasFiles = !!folderFiles.length;
  const firstThumb = folderFiles[0] ? getThumb(folderFiles[0].id) : '';
  const secondThumb = folderFiles[1] ? getThumb(folderFiles[1].id) : '';

  return (
    <div className="sc-folder-preview-wrap">
      <div className="sc-folder-preview-left">
        {(!folderHasFiles || !firstThumb) &&  <SvgIcon
          data={iconFolder}
        />}
        {firstThumb && <img src={firstThumb} />}
      </div>
      {
        (folderHasFiles && folderFiles.length >= 2) &&
        <div className="sc-folder-preview-right">
          <div className="sc-folder-preview-right-top">
            { !secondThumb &&  <SvgIcon
              data={iconFolder}
            />}
            {secondThumb && <img src={secondThumb} />}
          </div>
          {folderFiles.length >= 3 && <div className="sc-folder-preview-right-bottom">
            +{folderFiles.length - 2}
          </div>}
        </div>
      }

    </div>
  );
}


FolderPreview.propTypes = {
  file: PropTypes.object,
  filesList: PropTypes.object,
  acceptType: PropTypes.array
};

export default FolderPreview;
