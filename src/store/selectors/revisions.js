import { createSelector } from 'reselect';

import {
  getFiles,
} from '@/store/selectors/files';

export const getRevisionState = createSelector([state => _.get(state, 'revisions')], revisions => revisions);

export const getRfcData = createSelector([getRevisionState], revisions => {
  return revisions.rfcData;
});

export const getCreatedTime = createSelector([getRevisionState], revisions => {
  return revisions.rfcData.created;
});

export const isLoaded = createSelector([getRevisionState], revisions => {
  return  revisions.isLoaded;
});

export const isCurrentRevisionPublished = createSelector([getRevisionState], ({
  rfcData,
  published,
}) => {
  const draft = _.get(rfcData, 'updated');
  const current = _.get(published, 'updated');
  if (!draft && !current) {
    return true;
  }
  return draft === current;
});

export const isRevisionPublished = createSelector([getRevisionState], ({
  published,
}) => {

  return !_.isEmpty(published);
});

export const isCurrentRevisionUpdated = createSelector([getRevisionState], ({
  rfcData,
  lastSaved,
}) => {
  const draft = _.get(rfcData, 'updated');

  if (!draft && !lastSaved) {
    return true;
  }
  return draft === lastSaved;
});

export const showSkeleton = createSelector([getRevisionState], (revisions) => {
  return revisions.showSkeleton;
});

export const getSettings = createSelector([getRevisionState], (revisions) => {
  return revisions.settings;
});

export const getFieldsLimits = createSelector([getSettings], (settings) => {
  return settings.fieldsLimits || {};
});

export const getCurrentRfcId = createSelector([getRevisionState], (revisions) => {
  return revisions.currentRfcID;
});

export const getOwner = createSelector([getRevisionState], (revisions) => {
  return revisions.rfcData.user_id;
});

export const getRevisionsList = createSelector([getRevisionState], (revisions) => {
  return revisions.revisionsList;
});

export const getRevisionsOrgUrl = createSelector([getRevisionState], (revisions) => {
  return revisions.rfcData.organization_url;
});

export const getRevisionsFirstLoad = createSelector([getRevisionState], (revisions) => {
  return revisions.firstLoad;
});

export const getRevisionsPublishError = createSelector([getRevisionState], (revisions) => {
  return revisions.error;
});

export const isRevisionPublishing = createSelector([getRevisionState], (revisions) => {
  return revisions.publishing;
});
