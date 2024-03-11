import * as types from '@/store/types/filters';

import {
  resetRfcData,
  revisionFetchInitialData
} from '@/store/types/revisions';

const initialState = {
  searchPlaceholder: 'Search...',
  type: 'showcase-filters-and-search',
  id: 3,
  allTagsList: [],
  filterItems: [],
};

export default function filters(state = initialState, action) {
  switch (action.type) {

    case revisionFetchInitialData.SUCCESS: {
      const {
        filters,
      } = action.result;
      return {
        type: 'showcase-filters-and-search',
        id: 3,
        allTagsList: _.uniq(filters.tags),
        searchPlaceholder: filters ? filters['search-placeholder'] : initialState.searchPlaceholder,
        filterItems: filters.filters && filters.filters['filter-items'] ? filters.filters['filter-items'] : initialState.filterItems,
      };
    }

    case types.addFilter.REQUEST: {
      const {
        actionType,
        filter,
      } = action.payload;

      let newFilters = [...state.filterItems];

      if (actionType === 'add') {
        newFilters.push(filter);
      } else {
        newFilters = newFilters.map(item => item.id === filter.id ? filter : item);
      }

      return {
        ...state,
        filterItems: newFilters,
      };
    }

    case types.deleteFilter.REQUEST: {
      return {
        ...state,
        filterItems: [...state.filterItems.filter(filter =>filter.id !== action.payload)],
      };
    }

    case types.sortFilters.REQUEST: {
      return {
        ...state,
        filterItems: action.payload,
      };
    }

    case types.addTags.REQUEST: {
      const allTagsList = _.uniq([
        ...state.allTagsList,
        ...action.payload,
      ]);

      return {
        ...state,
        allTagsList,
      };
    }

    case resetRfcData.REQUEST:
      return initialState;


    default: {
      return state;
    }
  }
}
