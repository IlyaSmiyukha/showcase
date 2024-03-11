import * as types from '@/store/types/layout';
import uuid from 'uuid-random';

import {
  resetRfcData,
  revisionFetchInitialData
} from '@/store/types/revisions';

const initialState = {
  rows: [
    {
      "id": uuid(),
      "columns": [
        {
          "id": uuid(),
          "type": "category",
          "blockId": '0',
          "col": 12
        },
      ]
    },
  ]
};

export default function layout(state = initialState, action) {
  switch (action.type) {
    case revisionFetchInitialData.SUCCESS: {
      const {
        layout
      } = action.result;
      return layout.rows.length ? {
        ...state,
        ...layout,
      } : state;
    }

    case types.addRow.SUCCESS: {
      return {
        ...state,
        rows: [
          ...state.rows,
          action.result
        ]
      };
    }

    case types.deleteRow.SUCCESS: {
      return {
        ...state,
        rows: state.rows.filter(row => row.id !== action.result)
      };
    }

    case types.deleteColumn.SUCCESS: {
      const {
        columnId,
        rowId
      } = action.payload;

      const rows = [...state.rows].map(row => {
        if (row.id === rowId) {
          const columns = row.columns.filter(column => column.id !== columnId)
          return columns.length ? {
            ...row,
            columns: [{
              ...columns[0],
              col: 12
            }]
          } : null
        }
        return row
      }).filter(row => row)

      return {
        ...state,
        rows: rows.filter(row => row.columns.length)
      };
    }

    case types.addColumn.SUCCESS: {
      return {
        ...state,
        rows: state.rows.map(row => row.id === action.result.id ? action.result : row)
      };
    }

    case types.splitToRows.SUCCESS: {
      const {oldRow, newRow} = action.result;
      const rows = [...state.rows].map(row => row.id === oldRow.id ? oldRow : row);
      rows.splice(rows.indexOf(oldRow) + 1, 0, newRow)
      return {
        ...state,
        rows,
      };
    }

    case types.sortRows.SUCCESS:{
      const {
        id, moveTo,
      } = action.payload;
      const rows = [...state.rows];
      const element = rows[id];

      rows.splice(id, 1);
      rows.splice(id + moveTo, 0, element);
      {
        return {
          ...state,
          rows,
        };
      }
    }

    case resetRfcData.REQUEST:
      return initialState;

    default: {
      return state;
    }
  }
}
