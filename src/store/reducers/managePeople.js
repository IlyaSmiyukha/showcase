import * as types from '@/store/types/managePeople';
import {
  resetRfcData,
  revisionFetchInitialData
} from '@/store/types/revisions';

const initialState = {
  editors: [],
  shareTo: [],
  loadingPeople: false,
  followers: {
    total_items: 0,
    items: []
  }
};

export default function managePeople(state = initialState, action) {
  switch (action.type) {

    case types.getEditors.REQUEST: {
      return {
        ...state,
        editors: action.payload.reverse(),
      };
    }

    case types.fetchPeopleToShare.REQUEST: {
      return {
        ...state,
        loadingPeople: true,
      };
    }

    case types.fetchPeopleToShare.SUCCESS: {
      return {
        ...state,
        shareTo: action.result.length ? action.result : [],
        loadingPeople: false,
      };
    }

    case types.permisionEdit.SUCCESS: {
      const {
        actionType,
        users,
      } = action.result;

      const {
        editors,
      } = state;

      let newEditors = [];

      if (actionType === 'remove') {
        newEditors = editors.filter(editor => editor.user_id !== users[0]);
      }

      if (actionType === 'add') {
        newEditors = [
          ...editors,
          ...users,
        ];
      }

      return {
        ...state,
        editors: newEditors,
      };
    }

    case types.fetchFollowers.REQUEST: {
      return {
        ...state,
        loadingPeople: true,
      };
    }

    case types.fetchFollowers.SUCCESS: {
      return {
        ...state,
        followers: action.result,
        loadingPeople: false,
      };
    }

    case resetRfcData.REQUEST:
      return initialState;

    default: {
      return state;
    }
  }
}
