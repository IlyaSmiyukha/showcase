import _ from 'lodash';

import {
  createSelector,
} from 'reselect';

export const getPeapleState = createSelector([state => _.get(state, 'managePeople')], managePeopleState => managePeopleState);
export const getEditors = createSelector([getPeapleState], managePeopleState => managePeopleState.editors);
export const getPeopleToShare = createSelector([getPeapleState], managePeopleState => managePeopleState.shareTo);
export const getPeopleLoading = createSelector([getPeapleState], managePeopleState => managePeopleState.loadingPeople);
export const getFollowers = createSelector([getPeapleState], managePeopleState => managePeopleState.followers);
