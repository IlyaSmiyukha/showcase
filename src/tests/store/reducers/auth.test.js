import auth from '@/store/reducers/auth';
import * as types from '@/store/types/auth';

describe('Shortcuts reducer', () => {
  let initialState = {};

  beforeEach(() => {
    initialState = {
      tokenType: 'Bearer',
      accessToken: '',
      group: '',
      organizationId: '',
      viewUrl: '',
      apiUrl: '',
    };
  });

  it('should return the initial state', () => {
    expect(auth(undefined, initialState)).toEqual(initialState);
  });

  it('should handle setAuthData success', () => {
    const payload = {
      accessToken: 'token',
      group: 'group',
      organizationId: 0,
      viewUrl: 'viewUrl',
      apiUrl: 'apiUrl',
    };
    expect(auth(initialState, {
      type: types.setAuthData.SUCCESS,
      payload,
    })).toEqual({
      ...initialState,
      ...payload,
    });
  });

  it('should handle setAuthData error', () => {
    expect(auth(initialState, {
      type: types.setAuthData.FAILURE,
      payload: null,
    })).toEqual(initialState);
  });
});
