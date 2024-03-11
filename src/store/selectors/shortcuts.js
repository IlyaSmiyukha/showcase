import _ from 'lodash';

import {
  createSelector,
} from 'reselect';

export const getShortcutsState = createSelector([state => _.get(state, 'shortcuts')], shortcuts => shortcuts);
export const getShortcutsList = createSelector([state => _.get(state, 'shortcuts.items')], shortcuts => shortcuts);
