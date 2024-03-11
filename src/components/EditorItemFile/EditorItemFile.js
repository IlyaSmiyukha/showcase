import React, {
  PureComponent,
} from 'react';
import PropTypes from 'prop-types';

import SvgIcon  from '@/components/SvgIcon';

import editIcon from '@/assets/images/svg/icons/icon-edit.svg';
import Loader from '@/components/Loader';


import './EditorItemFile.less';

class EditorItemFile extends PureComponent {

  constructor(props) {
    super(props);
  }

  onClick = () => {
  }

  render() {
    const {
      itemType,
      itemUrl,
      onItemClick,
      itemDefaultText,
    } = this.props;

    return (
      <div className={`showcase-edit-item showcase-edit-item-file ${itemType}`} onClick={onItemClick || this.onClick}>
        <div className="edit-icon">
          <SvgIcon
            className="edit-icon"
            data={editIcon}
          />
        </div>
        {itemUrl === 'loading' && <Loader />}
        {itemUrl && itemUrl !== 'loading' && <img className="logo" src={itemUrl} />}
        {!itemUrl && itemDefaultText}
      </div>
    );
  }
}

EditorItemFile.propTypes = {
  onItemClick: PropTypes.func,
  itemType: PropTypes.string,
  itemUrl: PropTypes.string,
  itemDefaultText: PropTypes.string,
};

export default EditorItemFile;
