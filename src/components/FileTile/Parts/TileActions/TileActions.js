import * as React from 'react';
import PropTypes from 'prop-types';

import SvgIcon from '@/components/SvgIcon/SvgIcon';
import trashIcon from '@/assets/images/svg/icons/icon-trash.svg';
import iconEdit from '@/assets/images/svg/icons/icon-edit.svg';

import './TileActions.less';

const getButtonName = type => {
  let buttonName = '';
  switch (type) {
    case 'pdf':
      buttonName = 'View PDF';
      break;
    case 'link':
      buttonName = 'Open link';
      break;
    case 'video':
    case 'performance':
      buttonName = 'Watch video';
      break;
    case 'audio':
      buttonName = 'Listen audio';
      break;
    default:
      buttonName = 'Download file';
  }

  return buttonName;
};

const TileActions = ({
  file,
  editWebItem,
  editItem,
  onDeleteClick,
  itemIndex,
  fileType,
}) => {

  const buttonName = file.buttonName ? file.buttonName : getButtonName(fileType);

  return (
    <div className="sc-tile-actions-wrap">
      <div className="sc-actions-text">
        <span>{buttonName}</span>
      </div>
      <div className="sc-actions-buttons">
        <div
          className="sc-settings-button"
          role="button"
          onClick={() => {
            file.type === 'link' ? editWebItem(file) : editItem({file, itemIndex});
          }}
        >
          <SvgIcon
            data={iconEdit}
          />
        </div>

        <div
          className="sc-tile-delete-icon"
          onClick={onDeleteClick}
        >
          <SvgIcon
            data={trashIcon}
          />
        </div>
      </div>
    </div>
  );
};

TileActions.propTypes = {
  file: PropTypes.object,
  editWebItem: PropTypes.func,
  editItem: PropTypes.func,
  onDeleteClick: PropTypes.func,
  itemIndex: PropTypes.number,
  fileType: PropTypes.string,
};

export default TileActions;
