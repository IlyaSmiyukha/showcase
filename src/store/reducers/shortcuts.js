import * as types from '@/store/types/shortcuts';

import {
  revisionDeleteFile,
} from '@/store/types/revisions';

import {
  resetRfcData,
} from '@/store/types/revisions';

const initialState = {
  items: [],
  type: 'showcase-shortcuts',
  id: 4,
};

export default function shortcuts(state = initialState, action) {
  switch (action.type) {
    case types.getShortcutInitialData.REQUEST: {
      return {
        ...state,
        items: action.payload.items ? action.payload.items : [],
      };
    }

    case types.addShortcut.REQUEST: {
      return {
        ...state,
        items: [
          ...state.items,
          action.payload,
        ],
      };
    }

    case types.editShortcut.REQUEST: {
      const {
        id,
        shortcut,
      } = action.payload;

      return {
        ...state,
        items: state.items.map(item => item.id === id ? shortcut : item),
      };
    }

    case types.deleteShortcut.REQUEST: {
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    }

    case revisionDeleteFile.REQUEST: {
      return {
        ...state,
        items: state.items.map(item => {
          if (_.get(item, 'thumbnail.file_id') === action.payload) {
            item.thumbnail = '';
          }
          return item;
        }),
      };
    }

    case resetRfcData.REQUEST:
      return initialState;

    default: {
      return state;
    }
  }
}
