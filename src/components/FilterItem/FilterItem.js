import React from 'react';
import PropTypes from 'prop-types';

import SvgIcon from '@/components/SvgIcon/SvgIcon';
import trashIcon from '@/assets/images/svg/icons/icon-trash.svg';
import editIcon from '@/assets/images/svg/icons/icon-edit.svg';

import './FilterItem.less';

const FilterItem  = props =>  {

  const {
    filter,
    deleteFilter,
    showFiltersPopup,
  } = props;

  const handleDeleteFilter = (e) => {
    e.stopPropagation();
    deleteFilter(filter.id);
  };

  const handleEditItem = () => {
    showFiltersPopup({
      action: 'edit',
      ...filter,
    });
  };

  return (
    <div className="sc-filter-item" onClick={handleEditItem}>
      {filter.name}
      <SvgIcon
        data={editIcon}
        className={'icon-edit'}
      />
      <div className="sc-filter-delete" onClick={handleDeleteFilter} role="button">
        <SvgIcon
          data={trashIcon}
          className={'icon-trash'}
        />
      </div>
    </div>
  );
};

FilterItem.propTypes = {
  filter: PropTypes.object,
  deleteFilter: PropTypes.func,
  showFiltersPopup: PropTypes.func,
};

export default FilterItem;
