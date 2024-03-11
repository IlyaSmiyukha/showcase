import configureStore from 'redux-mock-store'; //ES6 modules

import * as actions from '@/store/actions/shortcuts';

const middlewares = [];
const mockStore = configureStore(middlewares);

const initialState = {
  items: [],
  type: 'showcase-shortcuts',
  id: 4,
};

describe('Shortcuts actions', () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  it('should create an action getShortcutInitialData', () => {
    // Dispatch the action
    store.dispatch(actions.getShortcutInitialData({}));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'SHORTCUTS/GET_DATA/REQUEST',
      payload: {},
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action addShortcut', () => {
    // Dispatch the action
    store.dispatch(actions.addShortcut({}));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'SHORTCUTS/ADD_ITEM/REQUEST',
      payload: {},
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action editShortcut', () => {
    // Dispatch the action
    store.dispatch(actions.editShortcut({}));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'SHORTCUTS/EDIT_ITEM/REQUEST',
      payload: {},
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action deleteShortcut', () => {
    // Dispatch the action
    store.dispatch(actions.deleteShortcut({}));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'SHORTCUTS/DELETE_ITEM/REQUEST',
      payload: {},
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

});
