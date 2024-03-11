import _ from 'lodash';

import {
  createSelector,
} from 'reselect';

export const getCurrentRfc = createSelector([state => _.get(state, 'rfc')], rfc => rfc.currentRrc);

export const getErrortRfc = createSelector([state => _.get(state, 'rfc')], rfc => rfc.error);

export const getRfcList = createSelector([state => _.get(state, 'rfc')], rfc => rfc.rfcList);

export const getRfcCount = createSelector([state => _.get(state, 'rfc')], rfc => rfc.totalCount);

export const getRfcPage = createSelector([state => _.get(state, 'rfc')], rfc => rfc.page);

export const getRfcPermissions = createSelector([state => _.get(state, 'rfc')], rfc => rfc.permissions);
export const getRfcIsLoadingList = createSelector([state => _.get(state, 'rfc')], rfc => rfc.listLoading);
export const getRfcIsCreating = createSelector([state => _.get(state, 'rfc')], rfc => rfc.creating);
