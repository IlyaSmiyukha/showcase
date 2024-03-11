import _ from 'lodash';

import {
  createSelector,
} from 'reselect';

export const getFiltersState = createSelector([state => _.get(state, 'filters')], filtersState => filtersState);
export const getFiltersTags = createSelector([getFiltersState], filtersState => filtersState.allTagsList);
export const getFiltersItems = createSelector([getFiltersState], filtersState => filtersState.filterItems);
