import locale from '@/api/locale';
import * as types from '@/store/types/footer';
import {
  revisionFetchInitialData,
  revisionUpdateText,
  resetRfcData,
  revisionDeleteFile,
} from '@/store/types/revisions';

import {
  createRfc,
} from '@/store/types/rfc';

const initialState = {
  type: 'showcase-footer',
  id: 2,
  text: locale.getResource('FooterText'),
  menu: [],
};

export default function footer(state = initialState, action) {
  switch (action.type) {
    case (revisionFetchInitialData.SUCCESS): {
      const {
        footer,
      } = action.result;

      return {
        ...state,
        ...footer,
      };
    }

    case types.editFooterMenu.REQUEST:
      const {
        type,
        menuItem,
      } = action.payload;

      const {
        menu,
      } = state;
      let updatedMenu = [];

      if (type === 'edit') {
        updatedMenu = menu.map(item => item.id ===  menuItem.id ? menuItem : item );
      } else {
        updatedMenu = [...menu ,
          menuItem];
      }

      return {
        ...state,
        menu: updatedMenu,
      };

    case types.deleteFooterMenu.REQUEST:
      return {
        ...state,
        menu: state.menu.filter(item => item.id !== action.payload),
      };

    case types.sortFooterMenu.REQUEST:
      return {
        ...state,
        menu: action.payload,
      };

    case types.updateFooterLogo.REQUEST:
      return {
        ...state,
        logo_file: {
          file_id: action.payload.logo,
          group_path: action.payload.group,
        },
      };

    case revisionUpdateText.REQUEST:
      const {
        path,
        text,
      } = action.payload;

      return path === 'footer-text' ? {
        ...state,
        text,
      } : state;

    case revisionDeleteFile.REQUEST:
      const newState = {...state};
      if (newState.logo_file && newState.logo_file.file_id === action.payload) {
        delete newState.logo_file;
      }

      return state.logo_file && state.logo_file.file_id === action.payload ? newState : state;

    case createRfc.SUCCESS:
    case resetRfcData.REQUEST:
      return initialState;

    default: {
      return state;
    }
  }
}
