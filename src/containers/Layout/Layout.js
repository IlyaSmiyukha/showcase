import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tooltip } from 'react-tippy';

import { getLayout } from '@/store/selectors/layout';
import { getCategories } from '@/store/selectors/categories';
import { getSettings } from '@/store/selectors/revisions';
import {
  addColumn,
  splitToRows,
  sortRows,
  deleteRow
} from '@/store/actions/layout';

import locale from '@/api/locale';

import Category from '@/containers/Category';
import Dropdown from '@/components/Dropdown';
import SvgIcon from '@/components/SvgIcon';
import moreIcon from '@/assets/images/svg/icons/icon-more.svg';

import './Layout.less';

const Layout = props =>  {
  const dispatch = useDispatch();

  const layout = useSelector(state => getLayout(state))
  const categories = useSelector(state => getCategories(state))
  const settings = useSelector(state => getSettings(state))

  const addNewColumn = (row) => {
    dispatch(addColumn(row))
  }

  const handleSplitToRows = (row) => {
    dispatch(splitToRows(row))
  }

  const sortRow = ({position, moveTo, row, changeRow}) => {
    const categoriesIds = row.columns.map(column => column.blockId);
    const moveCategoriesCount = changeRow.columns.length
    dispatch(sortRows(position, moveTo, categoriesIds, moveCategoriesCount))
  }

  const handleDeleteRow = (row) => {
    dispatch(deleteRow(row))
  }

  return <>
    {
      layout.rows.map((row, i) => <div className={`${row.columns.length === 2 ? 'sc-row sc-row-multiply': 'sc-row'}`} key={row.id}>
        {
          row.columns.map(column => {
           const category =  categories.find(category => column.blockId === category.id)

           return category ?
                  <div className={`sc-column ${row.columns.length === 2 ? 'sc-col-6': 'sc-col-12'}`}
                       key={`category-${column.id}`}>
                     <Category
                       totalCat={categories.length - 1}
                       settings={settings}
                       rowId={row.id}
                       columnId={column.id}
                       isTwoColumns={row.columns.length === 2}
                       {...category}
                     />
                   </div>
                   : null
          })
        }
        <div className='sc-row-controls'>
          <Tooltip
            title="Switch to one column layout"
            position="bottom"
            className="sc-tooltip"
            theme="light"
          >
            <button className='sc-layout-btn sc-layout-btn-column-1'
                    onClick={() => handleSplitToRows(row)}
                    disabled={row.columns.length === 1}
            />
          </Tooltip>
          <Tooltip
            title="Switch to two column layout"
            position="bottom"
            className="sc-tooltip"
            theme="light"
          >
            <button className='sc-layout-btn sc-layout-btn-column-2'
                    onClick={() => addNewColumn(row)}
                    disabled={row.columns.length === 2}
            />
          </Tooltip>


          <Dropdown
            className="dots"
            activeItem={<SvgIcon className="link-icon" data={moreIcon} testid="category-dropdown"/>}
            itemsList={[{
              title: locale.getResource('Delete'),
              onItemClick: () => {handleDeleteRow(row)},
            },
            {
              title: locale.getResource('MoveRowUp'),
              onItemClick: () => {sortRow({
                position: i, 
                moveTo: -1, 
                row,
                changeRow: layout.rows[i - 1]
              })},
              hide: i === 0
            },
            {
              title: locale.getResource('MoveRowDown'),
              onItemClick: () => {sortRow({
                position: i, 
                moveTo: 1, 
                row,
                changeRow: layout.rows[i + 1]
              })},
              hide: i === layout.rows.length - 1
            }]} />
        </div>
      </div>)
    }
  </>;
};

export default Layout;
