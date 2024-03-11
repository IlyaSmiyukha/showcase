import store from '@/store/store';
import * as types from '@/store/types/view';

export const showCreatePopup = (modalInfo) => {
  return store.dispatch({
    type: types.showPopup.REQUEST,
    payload: {
      type: 'createPopup',
      modalInfo
    },
  });
};

export const showWithCapsPopup = (modalInfo) => {
  return {
    type: types.showPopup.REQUEST,
    payload: {
      type: 'withCaps',
      modalInfo,
    },
  };
};

export const showEditPopup = () => {
  return {
    type: types.showPopup.REQUEST,
    payload: {
      type: 'editPopup',
    },
  };
};

export const showPublishPopup = () => {
  return {
    type: types.showPopup.REQUEST,
    payload: {
      type: 'publishPopup',
    },
  };
};

export const showPublishedPopup = (modalInfo) => {
  return {
    type: types.showPopup.REQUEST,
    payload: {
      type: 'publishedPopup',
      modalInfo,
    },
  };
};

export const showAddFilePopup = (modalInfo) => {
  return {
    type: types.showPopup.REQUEST,
    payload: {
      type: 'addFilePopup',
      modalInfo,
    },
  };
};

export const showEditTextPopup = (modalInfo) => {
  return {
    type: types.showPopup.REQUEST,
    payload: {
      type: 'editTextPopup',
      modalInfo,
    },
  };
};

export const showHyperlynksPopup = () => {
  return {
    type: types.showPopup.REQUEST,
    payload: {
      type: 'hyperlinksPopup',
    },
  };
};

export const showButtonPopup = () => {
  return {
    type: types.showPopup.REQUEST,
    payload: {
      type: 'buttonPopup',
    },
  };
};

export const showWebItemPopup = modalInfo => {
  return {
    type: types.showPopup.REQUEST,
    payload: {
      type: 'webItemPopup',
      modalInfo,
    },
  };
};

export const showEditItemPopup = modalInfo => {
  return {
    type: types.showPopup.REQUEST,
    payload: {
      type: 'editItemPopup',
      modalInfo,
    },
  };
};

export const showFiltersPopup = modalInfo => {
  return {
    type: types.showPopup.REQUEST,
    payload: {
      type: 'filtersPopup',
      modalInfo,
    },
  };
};

export const showShortcutsPopup = modalInfo => {
  return {
    type: types.showPopup.REQUEST,
    payload: {
      type: 'shortcutPopup',
      modalInfo,
    },
  };
};

export const showFooterMenuPopup = modalInfo => {
  return {
    type: types.showPopup.REQUEST,
    payload: {
      type: 'footerMenuPopup',
      modalInfo,
    },
  };
};

export const showManagePeoplePopup = modalInfo => {
  return {
    type: types.showPopup.REQUEST,
    payload: {
      type: 'managePeoplePopup',
      modalInfo,
    },
  };
};

export const someoneEditingPopup = (modalInfo) => {
  return {
    type: types.showPopup.REQUEST,
    payload: {
      type: 'someoneEditing',
      modalInfo,
    },
  };
};

export const showExportCsvPopup = (modalInfo) => {
  return {
    type: types.showPopup.REQUEST,
    payload: {
      type: 'exportCsvPopup',
      modalInfo,
    },
  };
};

export const showRestoreRevisionPopup = (modalInfo) => {
  return {
    type: types.showPopup.REQUEST,
    payload: {
      type: 'restoreRevisionPopup',
      modalInfo,
    },
  };
};

export const showChangeOwnershipPopup = (modalInfo) => {
  return {
    type: types.showPopup.REQUEST,
    payload: {
      type: 'changeOwnershipPopup',
      modalInfo,
    },
  };
};

export const showDeleteCardPopup = (modalInfo) => {
  return {
    type: types.showPopup.REQUEST,
    payload: {
      type: 'deleteCardPopup',
      modalInfo,
    },
  };
};

export const showDeleteShowcasePopup = (modalInfo) => {
  return {
    type: types.showPopup.REQUEST,
    payload: {
      type: 'deleteShowcasePopup',
      modalInfo,
    },
  };
};

export const showAnalyticsDatePopup = (modalInfo) => {
  return {
    type: types.showPopup.REQUEST,
    payload: {
      type: 'analyticsDatePopup',
      modalInfo,
    },
  };
};

export const showFollowersPopup = () => {
  return {
    type: types.showPopup.REQUEST,
    payload: {
      type: 'followersPopup',
    },
  };
};

export const hidePopup = () => {
  return {
    type: types.hidePopup.REQUEST,
    payload: {},
  };
};

export const hideSpecialPopup = name => {
  return {
    type: types.hideSpecialPopup.REQUEST,
    payload: name,
  };
};

export const setPlaceholderProps = payload => ({
  type: types.setPlaceholderProps.REQUEST,
  payload,
});

export const updatePopupInfo = modalInfo => ({
  type: types.updatePopupInfo.REQUEST,
  payload: {
    modalInfo,
  },
});
