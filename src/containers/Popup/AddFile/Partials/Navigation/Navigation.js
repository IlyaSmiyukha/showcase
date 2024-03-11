import React from 'react';
import classnames from 'classnames';
import locale from '@/api/locale';

import UploadInput from '@/components/UploadInput';
import FoldersList from '../FoldersList';
import SvgIcon from '@/components/SvgIcon/SvgIcon';
import myFiles from '@/assets/images/svg/icons/my_files_icon.svg';

const Navigation = ({
    foldersList,
    activeFolder,
    selectFolder,
    acceptType,
    group,
    activeTab,
    folderId,
    switchTab
}) =>  {
    const classMenuItem = tab => classnames({
        'sc-add-popup-menu-item': true,
        selected: tab === activeTab,
    });

    return (
        <div className="sc-add-popup-menu">

        <UploadInput acceptType={acceptType} group={group} folderId={folderId}>
          Upload media
        </UploadInput>

        <div className="sc-add-popup-menu-heading">
          <SvgIcon
            data={myFiles}
          />
          {locale.getResource('Files')}
        </div>
        <div
          className={classMenuItem('my-files')}
          onClick={() => switchTab('my-files')}
        >
          {locale.getResource('MyFiles')}
        </div>

        <div
          className={classMenuItem('shared')}
          onClick={() => switchTab('shared')}
        >
          {locale.getResource('SharedWithMe')}
        </div>
        <FoldersList foldersList={foldersList} activeFolder={activeFolder} handleClick={selectFolder}/>
        {/* <div
          className={classMenuItem('stock')}
          onClick={() => this.switchTab('stock')}
        >
          {locale.getResource('FilesFromStock')}
        </div>
        <div className="sc-add-popup-menu-heading">
          <SvgIcon
            data={glassIcon}
          />
          {locale.getResource('Explore')}
        </div>
        <div
          className={classMenuItem('stock')}
          onClick={() => this.switchTab('stock')}
        >
          {locale.getResource('FilesFromStock')}
        </div> */}
      </div>
    );
};

export default Navigation;
