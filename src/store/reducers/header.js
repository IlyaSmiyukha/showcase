import locale from '@/api/locale';
import * as types from '@/store/types/header';

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
  heading: locale.getResource('AddBackgroundHeading'),
  description: locale.getResource('AddBackgroundParagraph'),
  type: 'showcase-header',
  id: 1,
  settings: {},
  button:{
    label: '',
  },
};

export default function header(state = initialState, action) {
  switch (action.type) {
    case (revisionFetchInitialData.SUCCESS): {
      const {
        header,
      } = action.result;
      const newSettings = header && header.settings ? header.settings : {};
      return {
        ...state,
        ...header,
        settings: {
          ...state.settings,
          ...newSettings,
        },
      };
    }

    case types.updateHeaderLogo.REQUEST:  {

      return {
        ...state,
        logo_file: {
          file_id: action.payload.logo,
          group_path: action.payload.group,
        },
      };
    }

    case types.updateBackground.REQUEST:  {
      return {
        ...state,
        video_background: {
          file_id: action.payload.background,
          group_path: action.payload.group,
        },
      };
    }


    case types.updateHyperlinks.REQUEST: {

      return {
        ...state,
        hyperlinks: [...action.payload],
      };
    }

    case types.updateButton.REQUEST: {
      const newData = Object.assign({}, action.payload);
      if (!!newData.fileId) {
        newData.file_id = newData.fileId;
      }

      delete newData.fileId;

      return {
        ...state,
        button: newData,
      };
    }

    case revisionUpdateText.REQUEST: {
      const {
        path,
        text,
      } = action.payload;
      const newState = {...state};
      if (path === 'header-heading') {
        newState['heading'] = text;
      } else if (path === 'header-description') {
        newState['description'] = text;
      }
      return  newState;
    }

    case revisionDeleteFile.REQUEST: {
      const newState = {...state};

      if (newState.logo_file && newState.logo_file.file_id === action.payload) {
        delete newState.logo_file;
      }

      return newState;
    }

    case types.updateHeaderSettings.REQUEST: {
      const {
        name,
        value,
      } = action.payload;

      return  {
        ...state,
        settings: {
          ...state.settings,
          [name]: value,
        },
      };
    }

    case createRfc.SUCCESS:
    case resetRfcData.REQUEST:
      return initialState;


    default: {
      return state;
    }
  }
}
