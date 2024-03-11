import rfc from '@/store/reducers/rfc';
import * as types from '@/store/types/rfc';

import {
  changeOwnership,
} from '@/store/types/managePeople';

import {
  revisionFetchInitialData,
} from '@/store/types/revisions';

import {
  resetRfcData,
} from '@/store/types/revisions';

describe('Shortcuts reducer', () => {
  let initialState = {};

  beforeEach(() => {
    initialState = {
      currentRfc: {},
      creating: false,
      editing: false,
      getting: false,
      listLoading: false,
      error: '',
      rfcList: null,
      page: 0,
      totalCount: 0,
      permissions: {
        user_ids: [],
        groups: [],
        organizations: [],
        emails: [],
        email_domains: [],
        external_clients: [],
        password: null,
      },
    };
  });

  it('should return the initial state', () => {
    expect(rfc(undefined, initialState)).toEqual(initialState);
  });

  it('should handle revisionFetchInitialData', () => {
    const payload = {
      rfcData: {
        permissions: [[
          {
            granted_to: {
              groups: [],
              organizations: [],
              emails: [],
              email_domains: [],
              external_clients: [],
              password: null,
              user_ids: [37],
            },
          },
        ]],
      },
    };

    expect(rfc(initialState, {
      type: revisionFetchInitialData.SUCCESS,
      result: payload,
    })).toEqual({
      ...initialState,
      permissions: {
        ...initialState.permissions,
        user_ids: [37],
      },
    });
  });

  it('should handle createRfc REQUEST', () => {
    const payload = null;

    expect(rfc(initialState, {
      type: types.createRfc.REQUEST,
      result: payload,
    })).toEqual({
      ...initialState,
      creating: true,
    });
  });

  it('should handle createRfc REQUEST', () => {
    const payload = {
      newData: 'newData',
    };

    expect(rfc(initialState, {
      type: types.createRfc.SUCCESS,
      result: payload,
    })).toEqual({
      ...initialState,
      currentRfc: payload,
    });
  });

  it('should handle createRfc FAILURE', () => {
    const payload =  {
      response: {
        data: {
          error: 'error',
        },
      },
    };

    expect(rfc(initialState, {
      type: types.createRfc.FAILURE,
      error: payload,
    })).toEqual({
      ...initialState,
      creating: false,
      currentRfc: null,
      error: 'error',
    });
  });

  it('should handle editRfc REQUEST', () => {
    const payload = null;

    expect(rfc(initialState, {
      type: types.editRfc.REQUEST,
      result: payload,
    })).toEqual({
      ...initialState,
      editing: true,
    });
  });

  it('should handle editRfc SUCCESS', () => {
    const payload = null;

    expect(rfc(initialState, {
      type: types.editRfc.SUCCESS,
      result: payload,
    })).toEqual(initialState);
  });

  it('should handle editRfc FAILURE', () => {
    const payload = 'error';

    expect(rfc(initialState, {
      type: types.editRfc.FAILURE,
      result: payload,
    })).toEqual({
      ...initialState,
      error: payload,
    });
  });

  it('should handle getRfcInfo REQUEST', () => {
    const payload = null;

    expect(rfc(initialState, {
      type: types.getRfcInfo.REQUEST,
      result: payload,
    })).toEqual({
      ...initialState,
      getting: true,
    });
  });

  it('should handle getRfcInfo SUCCESS', () => {
    const payload = null;

    expect(rfc(initialState, {
      type: types.getRfcInfo.SUCCESS,
      result: payload,
    })).toEqual(initialState);
  });

  it('should handle getRfcInfo FAILURE', () => {
    const payload = 'error';

    expect(rfc(initialState, {
      type: types.getRfcInfo.FAILURE,
      result: payload,
    })).toEqual({
      ...initialState,
      error: payload,
    });
  });

  it('should handle fetchRfcList REQUEST', () => {
    const payload = null;

    expect(rfc(initialState, {
      type: types.fetchRfcList.REQUEST,
      result: payload,
    })).toEqual({
      ...initialState,
      getting: true,
      listLoading: true,
    });
  });

  it('should handle fetchRfcList SUCCESS', () => {
    const result = {
      total_items: 1,
      items: [{
        id: 'id',
      }],
    };

    const payload = {
      page: 1,
      clear: true,
    };

    expect(rfc(initialState, {
      type: types.fetchRfcList.SUCCESS,
      result,
      payload,
    })).toEqual({
      ...initialState,
      page: 1,
      totalCount: 1,
      rfcList: result.items,
    });
  });

  it('should handle fetchRfcList FAILURE', () => {
    const payload = 'error';

    expect(rfc(initialState, {
      type: types.fetchRfcList.FAILURE,
      result: payload,
    })).toEqual({
      ...initialState,
      error: payload,
    });
  });

  it('should handle deleteRfc REQUEST', () => {
    const payload = null;

    expect(rfc(initialState, {
      type: types.deleteRfc.REQUEST,
      result: payload,
    })).toEqual(initialState);
  });

  it('should handle deleteRfc SUCCESS', () => {
    const payload = {
      rfcId: 1,
    };

    expect(rfc({
      ...initialState,
      rfcList: [
        {
          rfc_id: 1,
        },
      ],
    }, {
      type: types.deleteRfc.SUCCESS,
      payload,
    })).toEqual({
      ...initialState,
      rfcList: [],
    });
  });

  it('should handle deleteRfc FAILURE', () => {
    const payload = 'error';

    expect(rfc(initialState, {
      type: types.deleteRfc.FAILURE,
      result: payload,
    })).toEqual({
      ...initialState,
      error: payload,
    });
  });

  it('should handle editRfcPermissions REQUEST', () => {
    const payload = null;

    expect(rfc(initialState, {
      type: types.editRfcPermissions.REQUEST,
      result: payload,
    })).toEqual(initialState);
  });

  it('should handle editRfcPermissions SUCCESS', () => {
    const payload = [{
      granted_to: {
        groups: [],
        organizations: [],
        emails: [],
        email_domains: [],
        external_clients: [],
        password: null,
        user_ids: [37],
      },
    }];

    expect(rfc(initialState, {
      type: types.editRfcPermissions.SUCCESS,
      result: payload,
    })).toEqual({
      ...initialState,
      permissions: {
        groups: [],
        organizations: [],
        emails: [],
        email_domains: [],
        external_clients: [],
        password: null,
        user_ids: [37],
      },
    });
  });

  it('should handle editRfcPermissions FAILURE', () => {
    const payload = null;

    expect(rfc(initialState, {
      type: types.editRfcPermissions.FAILURE,
      result: payload,
    })).toEqual(initialState);
  });

  it('should handle resetRfcData', () => {
    const payload = {};
    expect(rfc(initialState, {
      type: resetRfcData.REQUEST,
      payload,
    })).toEqual(initialState);
  });

});
