import configureStore from 'redux-mock-store'; //ES6 modules

import * as actions from '@/store/actions/header';

const middlewares = [];
const mockStore = configureStore(middlewares);

const initialState = {
  heading: 'heading text',
  description: 'description',
  type: 'showcase-header',
  id: 1,
  button:{
    label: '',
  },
};

describe('Header actions', () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  it('should create an action updateButton', () => {
    // Dispatch the action
    const payload = {};
    store.dispatch(actions.updateButton(payload));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'HEADER/UPDATE_BUTTON/REQUEST',
      payload: payload,
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action updateHyperlinks', () => {
    // Dispatch the action
    const payload = [];
    store.dispatch(actions.updateHyperlinks(payload));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'HEADER/UPDATE_HYPERLINKS/REQUEST',
      payload: payload,
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action updateBackground', () => {
    // Dispatch the action
    const payload = {
      background: 'id',
      group: 'group',
    };
    store.dispatch(actions.updateBackground(payload.background, payload.group));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'HEADER/UPDATE_BACKGROUND/REQUEST',
      payload: payload,
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action updateHeaderLogo', () => {
    // Dispatch the action
    const payload = {
      logo: 'id',
      group: 'group',
    };
    store.dispatch(actions.updateHeaderLogo(payload.logo, payload.group));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'HEADER/UPDATE_LOGO/REQUEST',
      payload: payload,
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

});
