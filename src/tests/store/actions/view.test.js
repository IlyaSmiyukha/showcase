import configureStore from 'redux-mock-store'; //ES6 modules

import * as actions from '@/store/actions/view';

const middlewares = [];
const mockStore = configureStore(middlewares);

const initialState = {
  createPopup: false,
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
  fileInfo: {},
  modalInfo: {},
  analytics: false,
};

describe('Header actions', () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  it('should create an action showCreatePopup', () => {
    // Dispatch the action
    store.dispatch(actions.showCreatePopup());
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'POPUP/SHOW/REQUEST',
      payload: {
        type: 'createPopup',
      },
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action showWithCapsPopup', () => {
    // Dispatch the action
    store.dispatch(actions.showWithCapsPopup({}));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'POPUP/SHOW/REQUEST',
      payload: {
        type: 'withCaps',
        modalInfo: {},
      },
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action showEditPopup', () => {
    // Dispatch the action
    store.dispatch(actions.showEditPopup());
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'POPUP/SHOW/REQUEST',
      payload: {
        type: 'editPopup',
      },
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action showPublishPopup', () => {
    // Dispatch the action
    store.dispatch(actions.showPublishPopup());
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'POPUP/SHOW/REQUEST',
      payload: {
        type: 'publishPopup',
      },
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action showCreatePopup', () => {
    // Dispatch the action
    store.dispatch(actions.showCreatePopup());
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'POPUP/SHOW/REQUEST',
      payload: {
        type: 'createPopup',
      },
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action showPublishedPopup', () => {
    // Dispatch the action
    store.dispatch(actions.showPublishedPopup({}));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'POPUP/SHOW/REQUEST',
      payload: {
        type: 'publishedPopup',
        modalInfo:{},
      },
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action showAddFilePopup', () => {
    // Dispatch the action
    store.dispatch(actions.showAddFilePopup({}));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'POPUP/SHOW/REQUEST',
      payload: {
        type: 'addFilePopup',
        modalInfo:{},
      },
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action showEditTextPopup', () => {
    // Dispatch the action
    store.dispatch(actions.showEditTextPopup({}));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'POPUP/SHOW/REQUEST',
      payload: {
        type: 'editTextPopup',
        modalInfo:{},
      },
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action showHyperlynksPopup', () => {
    // Dispatch the action
    store.dispatch(actions.showHyperlynksPopup());
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'POPUP/SHOW/REQUEST',
      payload: {
        type: 'hyperlinksPopup',
      },
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action showButtonPopup', () => {
    // Dispatch the action
    store.dispatch(actions.showButtonPopup());
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'POPUP/SHOW/REQUEST',
      payload: {
        type: 'buttonPopup',
      },
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action showWebItemPopup', () => {
    // Dispatch the action
    store.dispatch(actions.showWebItemPopup({}));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'POPUP/SHOW/REQUEST',
      payload: {
        type: 'webItemPopup',
        modalInfo:{},
      },
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action showEditItemPopup', () => {
    // Dispatch the action
    store.dispatch(actions.showEditItemPopup({}));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'POPUP/SHOW/REQUEST',
      payload: {
        type: 'editItemPopup',
        modalInfo:{},
      },
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action showFiltersPopup', () => {
    // Dispatch the action
    store.dispatch(actions.showFiltersPopup({}));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'POPUP/SHOW/REQUEST',
      payload: {
        type: 'filtersPopup',
        modalInfo:{},
      },
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action showShortcutsPopup', () => {
    // Dispatch the action
    store.dispatch(actions.showShortcutsPopup({}));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'POPUP/SHOW/REQUEST',
      payload: {
        type: 'shortcutPopup',
        modalInfo:{},
      },
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action showFooterMenuPopup', () => {
    // Dispatch the action
    store.dispatch(actions.showFooterMenuPopup({}));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'POPUP/SHOW/REQUEST',
      payload: {
        type: 'footerMenuPopup',
        modalInfo:{},
      },
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action showManagePeoplePopup', () => {
    // Dispatch the action
    store.dispatch(actions.showManagePeoplePopup({}));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'POPUP/SHOW/REQUEST',
      payload: {
        type: 'managePeoplePopup',
        modalInfo:{},
      },
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action someoneEditingPopup', () => {
    // Dispatch the action
    store.dispatch(actions.someoneEditingPopup({}));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'POPUP/SHOW/REQUEST',
      payload: {
        type: 'someoneEditing',
        modalInfo:{},
      },
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action showExportCsvPopup', () => {
    // Dispatch the action
    store.dispatch(actions.showExportCsvPopup({}));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'POPUP/SHOW/REQUEST',
      payload: {
        type: 'exportCsvPopup',
        modalInfo:{},
      },
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action showRestoreRevisionPopup', () => {
    // Dispatch the action
    store.dispatch(actions.showRestoreRevisionPopup({}));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'POPUP/SHOW/REQUEST',
      payload: {
        type: 'restoreRevisionPopup',
        modalInfo:{},
      },
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action showChangeOwnershipPopup', () => {
    // Dispatch the action
    store.dispatch(actions.showChangeOwnershipPopup({}));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'POPUP/SHOW/REQUEST',
      payload: {
        type: 'changeOwnershipPopup',
        modalInfo:{},
      },
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action showDeleteCardPopup', () => {
    // Dispatch the action
    store.dispatch(actions.showDeleteCardPopup({}));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'POPUP/SHOW/REQUEST',
      payload: {
        type: 'deleteCardPopup',
        modalInfo:{},
      },
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action hidePopup', () => {
    // Dispatch the action
    store.dispatch(actions.hidePopup());
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'POPUP/HIDE/REQUEST',
      payload: {},
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action hideSpecialPopup', () => {
    // Dispatch the action
    store.dispatch(actions.hideSpecialPopup('deleteCardPopup'));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'POPUP/HIDE_SPECIAL/REQUEST',
      payload: 'deleteCardPopup',
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action setPlaceholderProps', () => {
    // Dispatch the action
    store.dispatch(actions.setPlaceholderProps({}));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'DRAG/SET_PLACEHOLDER_PROPS/REQUEST',
      payload: {
      },
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action updatePopupInfo', () => {
    // Dispatch the action
    store.dispatch(actions.updatePopupInfo({}));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'POPUP/UPDATE_INFO/REQUEST',
      payload: {
        modalInfo: {},
      },
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action showAnalytics', () => {
    // Dispatch the action
    store.dispatch(actions.showAnalytics(true));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'ANALYTICS/SHOW/REQUEST',
      payload: true,
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

});
