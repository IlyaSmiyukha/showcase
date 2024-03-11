import managePeople from '@/store/reducers/managePeople';
import * as types from '@/store/types/managePeople';

import {
  resetRfcData,
} from '@/store/types/revisions';

describe('managePeople reducer', () => {
  let initialState = {};

  beforeEach(() => {
    initialState = {
      editors: [],
      shareTo: [],
      loadingPeople: false,
    };
  });

  it('should return the initial state', () => {
    expect(managePeople(undefined, initialState)).toEqual(initialState);
  });

  it('should handle fetchPeopleToShare REQUEST', () => {
    const payload = null;
    expect(managePeople(initialState, {
      type: types.fetchPeopleToShare.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      loadingPeople: true,
    });
  });

  it('should handle permisionEdit add', () => {
    const payload = {
      actionType: 'add',
      users: [1,
        2,
        3],
    };
    expect(managePeople(initialState, {
      type: types.permisionEdit.SUCCESS,
      result: payload,
    })).toEqual({
      ...initialState,
      editors: payload.users,
    });
  });

  it('should handle permisionEdit remove', () => {
    const payload = {
      actionType: 'remove',
      users: [1],
    };
    expect(managePeople({
      ...initialState,
      editors: [
        {
          user_id: 1,
        },
      ],
    }, {
      type: types.permisionEdit.SUCCESS,
      result: payload,
    })).toEqual({
      ...initialState,
      editors: [],
    });
  });

  it('should handle resetRfcData', () => {
    const payload = null;
    expect(managePeople(initialState, {
      type: resetRfcData.SUCCESS,
      payload,
    })).toEqual(initialState);
  });

});
