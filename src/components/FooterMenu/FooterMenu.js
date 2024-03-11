import React from 'react';

import PropTypes from 'prop-types';

import SvgIcon  from '@/components/SvgIcon';
import editIcon from '@/assets/images/svg/icons/icon-edit.svg';
import trashIcon from '@/assets/images/svg/icons/icon-trash.svg';

import './FooterMenu.less';


const FooterMenu= props =>  {
  const {
    menu,
    onClick,
    onDeleteClick,
  } = props;

  return (
    <div className="sc-footer-menu-item" >
      <h4>{menu.name}</h4>
      <ul>
        {
          menu.links.map((link, i) => <li key={i}>{link.title}</li>)
        }
      </ul>

      <span className="sc-delete-menu" data-testid={'delete-menu'} onClick={() => onDeleteClick(menu.id)}>
        <SvgIcon
          className="delete-icon"
          data={trashIcon}
        />
      </span>

      <div className="sc-click-overlay" data-testid={'edit-menu'}  onClick={() => onClick(menu)} />

      <SvgIcon
        className="edit-icon"
        data={editIcon}
      />
    </div>
  );
};

FooterMenu.propTypes = {
  onClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  menu: PropTypes.object,
};

export default FooterMenu;
