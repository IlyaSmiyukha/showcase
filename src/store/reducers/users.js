import * as types from '@/store/types/users';

import {
  resetRfcData,
} from '@/store/types/revisions';

const initialState = {
};

export default function view(state = initialState, action) {
  switch (action.type) {

    case types.getUsers.REQUEST:
      return {
        ...state,
        ...action.payload,
      };

    case resetRfcData.REQUEST:
      return initialState;

    default: {
      return state;
    }
  }
}
