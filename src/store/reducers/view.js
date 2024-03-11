import * as types from '@/store/types/view';

import {
  resetRfcData,
} from '@/store/types/revisions';

const initialState = {
  createPopup: false,
  editPopup: false,
  addFilePopup: false,
  hyperlinksPopup: false,
  buttonPopup: false,
  publishedPopup: false,
  editTextPopup: false,
  publishPopup: false,
  withCaps: false,
  webItemPopup: false,
  editItemPopup: false,
  filtersPopup: false,
  shortcutPopup: false,
  footerMenuPopup: false,
  managePeoplePopup: false,
  someoneEditing: false,
  exportCsvPopup: false,
  restoreRevisionPopup: false,
  changeOwnershipPopup: false,
  deleteCardPopup: false,
  deleteShowcasePopup: false,
  analyticsDatePopup: false,
  followersPopup: false,
  placeholderProps: {
    index: -1,
    category: -1,
  },
  fileInfo: {},
  modalInfo: {},
};

export default function view(state = initialState, action) {
  switch (action.type) {
    case types.setPlaceholderProps.REQUEST: {
      return {
        ...state,
        placeholderProps: action.payload,
      };
    }

    case types.showPopup.REQUEST:
    {
      const {
        type,
        modalInfo,
      } = action.payload;

      return {
        ...state,
        [type]: true,
        modalInfo: {
          ...state.modalInfo,
          ...modalInfo,
        },
      };
    }

    case types.hidePopup.REQUEST:
      return {
        ...state,
        createPopup: false,
        editPopup: false,
        addFilePopup: false,
        editTextPopup: false,
        publishedPopup: false,
        hyperlinksPopup: false,
        buttonPopup: false,
        publishPopup: false,
        withCaps: false,
        webItemPopup: false,
        editItemPopup: false,
        filtersPopup: false,
        shortcutPopup: false,
        footerMenuPopup: false,
        managePeoplePopup: false,
        someoneEditing: false,
        exportCsvPopup: false,
        restoreRevisionPopup: false,
        changeOwnershipPopup: false,
        deleteCardPopup: false,
        deleteShowcasePopup: false,
        analyticsDatePopup: false,
        followersPopup: false,
        fileInfo: {},
        modalInfo: {},
      };

    case types.hideSpecialPopup.REQUEST:
      const newState = {...state};
      if (newState.modalInfo.acceptType) {
        delete newState.modalInfo.acceptType
      }
      return {
        ...state,
        [action.payload]: false,
      };

    case types.updatePopupInfo.REQUEST:

      const {
        modalInfo,
      } = action.payload;

      return {
        ...state,
        modalInfo: {
          ...state.modalInfo,
          ...modalInfo,
        },
      };

    case resetRfcData.REQUEST:
      return initialState;

    default: {
      return state;
    }
  }
}
