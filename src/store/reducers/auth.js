import * as types from '@/store/types/auth';

const initialState = {
  tokenType: 'Bearer',
  accessToken: '',
  group: '',
  organizationId: '',
  viewUrl: '',
  apiUrl: '',
};

export default function auth(state = initialState, action) {
  switch (action.type) {
    case (types.setAuthData.SUCCESS): {
      return {
        ...state,
        accessToken: action.payload.accessToken,
        group: action.payload.group,
        expires: action.payload.expires,
        organizationId: action.payload.organizationId,
        viewUrl: action.payload.viewUrl,
        apiUrl: action.payload.apiUrl,
      };
    }
    case (types.setAuthData.FAILURE): {
      return initialState;
    }
    default: {
      return state;
    }
  }
}
