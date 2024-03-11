import _ from 'lodash';

import {
  createSelector,
} from 'reselect';

export const getAuthState = createSelector([state => _.get(state, 'auth')], authState => authState);

export const getAuthTokenType = createSelector([getAuthState], authState => {
  return authState.tokenType;
});

export const getAuthToken = createSelector([getAuthState], authState => {
  return authState.accessToken;
});

export const getAuthGroupPath = createSelector([getAuthState], authState => {
  return authState.group;
});

export const getOrganizationId = createSelector([getAuthState], authState => {
  return authState.organizationId;
});

export const getViewUrl = createSelector([getAuthState], authState => {
  return authState.viewUrl;
});

export const getApiUrl = createSelector([getAuthState], authState => {
  return authState.apiUrl;
});
