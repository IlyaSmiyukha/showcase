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

const initialState = {
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
  rfcList: []
};

export default function rfc(state = initialState, action) {
  switch (action.type) {
    case revisionFetchInitialData.SUCCESS:
    {
      const [[permissions]] = _.get(action.result, 'rfcData.permissions');
      const data = _.get(permissions, 'granted_to');
      return {
        ...state,
        permissions: {
          ...data,
        },
      };
    }
    case types.createRfc.REQUEST:
      return {
        ...state,
        creating: true,
      };

    case types.createRfc.SUCCESS: {
      return {
        ...state,
        currentRfc: { ...state.currentRfc, ...action.result },
        creating: false,
      };
    }
    case types.createRfc.FAILURE:
      const {
        error,
      } = action;
      return {
        ...state,
        creating: false,
        currentRfc: null,
        error: _.get(error, 'response.data.error'),
      };

    case types.editRfc.REQUEST:
      return {
        ...state,
        editing: true,
      };

    case types.editRfc.SUCCESS: {
      return {
        ...state,
        editing: false,
      };
    }

    case types.editRfc.FAILURE:
      return {
        ...state,
        editing: false,
        error: action.result || 'This url already taken',
      };

    case types.getRfcInfo.REQUEST:
      return {
        ...state,
        getting: true,
      };

    case types.getRfcInfo.SUCCESS: {
      return {
        ...state,
        getting: false,
      };
    }
    case types.getRfcInfo.FAILURE:
      return {
        ...state,
        getting: false,
        error: action.result,
      };


    case types.fetchRfcList.REQUEST:
      return {
        ...state,
        getting: true,
        listLoading: true,
      };

    case types.fetchRfcList.SUCCESS: {
      const {
        total_items: totalCount,
        items: rfcList,
      } = action.result;
      const {
        page,
        clear,
      } = action.payload;

      return {
        ...state,
        totalCount,
        rfcList: clear
          ? rfcList
          : [...state.rfcList,
            ...rfcList],
        page,
        getting: false,
        listLoading: false,
      };
    }

    case types.fetchRfcList.FAILURE:
      return {
        ...state,
        getting: false,
        listLoading: false,
        error: action.result,

      };

    case types.deleteRfc.REQUEST:
    {
      return {
        ...state,
      };
    }

    case types.deleteRfc.SUCCESS:
    {
      const {
        rfcId,
      } = action.payload;

      return {
        ...state,
        rfcList: state.rfcList.filter(({
          rfc_id: id,
        }) => id !== rfcId),
      };
    }

    case types.deleteRfc.FAILURE:
      return {
        ...state,
        error: action.result,
      };

    case types.editRfcPermissions.REQUEST:
    {
      return {
        ...state,
      };
    }

    case types.editRfcPermissions.SUCCESS: {
      const [data] = action.result;
      const {
        granted_to: permissions,
      } = data;

      return {
        ...state,
        permissions: typeof permissions === 'array' ? {} : permissions ,
      };
    }
    case types.editRfcPermissions.FAILURE:{
      return {
        ...state,
      };
    }

    case types.clearRfcError.SUCCESS:
    {

      return {
        ...state,
        error: '',
      };
    }

    case changeOwnership.SUCCESS:  {
      return {
        ...state,
        rfcList: state.rfcList.filter(item => item.rfc_id !== action.result),
      };
    }

    case resetRfcData.REQUEST:
      return initialState;


    default: {
      return state;
    }
  }
}
