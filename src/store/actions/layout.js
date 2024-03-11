import store from '@/store/store';
import * as types from '@/store/types/layout';
import uuid from 'uuid-random';

import {
  addNewCategory,
  deleteCategory
} from '@/store/actions/categories'

export const getLeyout = data => {
  return {
    type: types.getLeyout.SUCCESS,
    payload: data,
  };
};

export const addRow = () => {
  return {
    routine: types.addRow,
    promise: client => new Promise(async (resolve, reject) => {
      try {
        const category = {
          id:  uuid(),
          type: 'showcase-category',
          title: '',
          items: [],
          caps: true,
        }

        await store.dispatch(addNewCategory(category))

        resolve({
          id: uuid(),
          columns: [{
            id: uuid(),
            type: 'category',
            blockId: category.id,
            col: 12
          }]
        });
      } catch (error) {
        reject(error);
      }
    }),
  };
};

export const deleteRow = (row) => {
  return {
    routine: types.deleteRow,
    promise: client => new Promise(async (resolve, reject) => {
      try {
        row.columns.forEach(async (column) => {
          await store.dispatch(deleteCategory(column.blockId))
        });

        resolve(row.id);
      } catch (error) {
        reject(error);
      }
    }),
  };
};

export const addColumn = (row) => {
  return {
    routine: types.addColumn,
    promise: client => new Promise(async (resolve, reject) => {
      try {
        const category = {
          id:  uuid(),
          type: 'showcase-category',
          title: '',
          items: [],
          caps: true,
        }

        await store.dispatch(addNewCategory(category))

        resolve({
          ...row,
          columns: [
            {
              ...row.columns[0],
              col: 6
            },
            {
              id: uuid(),
              type: 'category',
              blockId: category.id,
              col: 6
            }
          ]
        });
      } catch (error) {
        reject(error);
      }
    }),
  };
};

export const deleteColumn = (rowId, columnId) => {
  return {
    type: types.deleteColumn.SUCCESS,
    payload: {
      rowId,
      columnId
    }
  };
};

export const splitToRows = (row) => {
  return {
    routine: types.splitToRows,
    promise: client => new Promise(async (resolve, reject) => {
      try {
        const column = row.columns.pop();
        resolve({
          oldRow: {
            ...row,
            columns: [{
              ...row.columns[0],
              col: 12
            }]
          },
          newRow: {
            id: uuid(),
            columns: [{
              ...column,
              col: 12
            }]
          }
        })
      } catch (error) {
        reject(error);
      }
    }),
  };
};

export const sortRows = (id, moveTo, categoriesIds, moveCategoriesCount) => {
  return{
    type: types.sortRows.SUCCESS,
    payload: {id, moveTo, categoriesIds, moveCategoriesCount},
  };
};
