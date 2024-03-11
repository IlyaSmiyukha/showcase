import React from 'react';
import classnames from 'classnames';

import locale from '@/api/locale';
import SvgIcon from '@/components/SvgIcon/SvgIcon';
import folderIcon from '@/assets/images/svg/icons/icon-folder.svg';
import Scrollbar from '@/components/Scrollbar';


const FoldersList = ({foldersList, activeFolder, handleClick}) =>  {
    const classMenuItem = (isSelected) => classnames({
        'sc-add-popup-menu-item': true,
        selected: isSelected,
    });
    return (
        <>
            <div className="sc-add-popup-menu-heading">
                <SvgIcon
                    data={folderIcon}
                />
                {locale.getResource('Folders')}
            </div>
            <Scrollbar className='sc-folders-scrollbar'>
                {
                    foldersList.map(folder =>  <div
                        key={folder.folder_id}
                        className={classMenuItem(activeFolder === folder.folder_id)}
                        onClick={() => handleClick(folder.folder_id)}
                        title={folder.name}
                    >
                        {folder.name}
                    </div>)
                }
            </Scrollbar>
        </>
    );
};


export default FoldersList;
