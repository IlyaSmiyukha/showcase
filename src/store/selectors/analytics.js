import _ from 'lodash';

import {
  createSelector,
} from 'reselect';

export const getAnalyticsState = createSelector([state => _.get(state, 'analytics')], analyticsState => analyticsState);

export const getShowAnalytics = createSelector([getAnalyticsState], analyticsState => {
  return analyticsState.showAnalytics;
});

export const getSelectedDate = createSelector([getAnalyticsState], analyticsState => {
  return analyticsState.date;
});

export const getOveralStats = createSelector([getAnalyticsState], analyticsState => {
  return {
    visits: analyticsState.visits.total,
    uniqueVisits: analyticsState.uniqueVisits.total,
    averageDuration: analyticsState.averageDuration,
  };
});

export const getChartStats = createSelector([getAnalyticsState], analyticsState => {
  return {
    visits: analyticsState.visits.results,
    uniqueVisits: analyticsState.uniqueVisits.results,
  };
});

export const getCards = createSelector([getAnalyticsState], analyticsState => {
  return analyticsState.cards
});

export const getTotalAnalyticsStats = createSelector([getAnalyticsState], analyticsState => {
  return analyticsState.total
});

export const getIsCategoriesLoading = createSelector([getAnalyticsState], analyticsState => {
  return analyticsState.isCategoriesLoading
});
