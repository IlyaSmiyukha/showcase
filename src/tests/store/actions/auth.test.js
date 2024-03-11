import configureStore from 'redux-mock-store'; //ES6 modules

import * as actions from '@/store/actions/auth';

const middlewares = [];
const mockStore = configureStore(middlewares);

const initialState = {
  tokenType: 'Bearer',
  accessToken: '',
  group: '',
  organizationId: '',
  viewUrl: '',
  apiUrl: '',
};

describe('Auth actions', () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  it('should create an action setAuthData', () => {
    // Dispatch the action
    const newData = {
      accessToken: 'token',
      group: 'group',
      organizationId: 'organizationId',
      viewUrl: 'viewUrl',
      apiUrl: 'apiUrl',
    };
    store.dispatch(actions.setAuthData('token', 'group', 'organizationId', 'viewUrl', 'apiUrl'));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'AUTH/LOAD_DATA/SUCCESS',
      payload: newData,
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

});
