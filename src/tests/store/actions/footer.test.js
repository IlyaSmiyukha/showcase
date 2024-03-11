import configureStore from 'redux-mock-store'; //ES6 modules

import * as actions from '@/store/actions/footer';

const middlewares = [];
const mockStore = configureStore(middlewares);

const initialState = {
  type: 'showcase-footer',
  id: 2,
  text: 'foter text',
  menu: [],
};

describe('Footer actions', () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  it('should create an action editFooterMenu', () => {
    // Dispatch the action
    const payload = {};
    store.dispatch(actions.editFooterMenu(payload));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'FOOTER/EDIT_MENU/REQUEST',
      payload: payload,
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action deleteFooterMenu', () => {
    // Dispatch the action
    const payload = 'id';
    store.dispatch(actions.deleteFooterMenu(payload));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'FOOTER/DELETE_MENU/REQUEST',
      payload: payload,
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action sortFooterMenu', () => {
    // Dispatch the action
    const payload = {};
    store.dispatch(actions.sortFooterMenu(payload));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'FOOTER/SORT_MENU/REQUEST',
      payload: payload,
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action updateFooterLogo', () => {
    // Dispatch the action
    const payload = {
      logo: 'id',
      group: 'group',
    };
    store.dispatch(actions.updateFooterLogo(payload.logo, payload.group));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'FOOTER/UPDATE_LOGO/REQUEST',
      payload: payload,
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

});
