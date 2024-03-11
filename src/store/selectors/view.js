import _ from 'lodash';

import {
  createSelector,
} from 'reselect';

export const getViewState = createSelector([state => _.get(state, 'view')], viewState => viewState);

export const createPopupActive = createSelector([getViewState], viewState => {
  return viewState.createPopup;
});

export const editPopupActive = createSelector([getViewState], viewState => {
  return viewState.editPopup;
});

export const addFilePopupActive = createSelector([getViewState], viewState => {
  return viewState.addFilePopup;
});

export const hyperlinksPopupActive = createSelector([getViewState], viewState => {
  return viewState.hyperlinksPopup;
});

export const buttonPopupActive = createSelector([getViewState], viewState => {
  return viewState.buttonPopup;
});

export const publishActive = createSelector([getViewState], viewState => {
  return viewState.publishPopup;
});

export const publishedActive = createSelector([getViewState], viewState => {
  return viewState.publishedPopup;
});

export const withCapsPopupActive = createSelector([getViewState], viewState => {
  return viewState.withCaps;
});


export const getDragData = createSelector([getViewState], viewState => {
  return viewState.dragData;
});

export const editTextPopupActive = createSelector([getViewState], viewState => {
  return viewState.editTextPopup;
});

export const webItemPopupActive = createSelector([getViewState], viewState => {
  return viewState.webItemPopup;
});

export const editItemPopupActive = createSelector([getViewState], viewState => {
  return viewState.editItemPopup;
});

export const filtersPopupActive = createSelector([getViewState], viewState => {
  return viewState.filtersPopup;
});

export const shortcutsPopupActive = createSelector([getViewState], viewState => {
  return viewState.shortcutPopup;
});

export const footerMenuPopupActive = createSelector([getViewState], viewState => {
  return viewState.footerMenuPopup;
});

export const managePeoplePopupActive = createSelector([getViewState], viewState => {
  return viewState.managePeoplePopup;
});

export const someoneEditingActive = createSelector([getViewState], viewState => {
  return viewState.someoneEditing;
});

export const restoreRevisionPopupActive = createSelector([getViewState], viewState => {
  return viewState.restoreRevisionPopup;
});

export const exportCsvPopupActive = createSelector([getViewState], viewState => {
  return viewState.exportCsvPopup;
});

export const changeOwnershipPopupActive = createSelector([getViewState], viewState => {
  return viewState.changeOwnershipPopup;
});

export const cardDeletePopupActive = createSelector([getViewState], viewState => {
  return viewState.deleteCardPopup;
});

export const getDeleteShowcasePopupActive = createSelector([getViewState], viewState => {
  return viewState.deleteShowcasePopup;
});

export const getAnalyticsDatePopupActive = createSelector([getViewState], viewState => {
  return viewState.analyticsDatePopup;
});

export const getShowFollowerePopupActive = createSelector([getViewState], viewState => {
  return viewState.followersPopup;
});

export const getPlaceholderProps = createSelector([getViewState], viewState => {
  return viewState.placeholderProps;
});

export const getModalInfo = createSelector([getViewState], viewState => {
  return viewState.modalInfo;
});
