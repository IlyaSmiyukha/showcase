import configureStore from 'redux-mock-store'; //ES6 modules

import * as actions from '@/store/actions/users';

const middlewares = [];
const mockStore = configureStore(middlewares);

const initialState = {};

describe('Users actions', () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  it('should create an action getUsers', () => {
    // Dispatch the action
    store.dispatch(actions.getUsers());
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'USERS/GET/REQUEST',
      payload: undefined,
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

});
