import _ from 'lodash';

import {
  createSelector,
} from 'reselect';

export const getLayout = createSelector([state => _.get(state, 'layout')], layout => layout);
