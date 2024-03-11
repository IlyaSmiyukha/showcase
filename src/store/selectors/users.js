import _ from 'lodash';

import {
  createSelector,
} from 'reselect';

export const getUsers = createSelector([state => _.get(state, 'users')], users => users);
