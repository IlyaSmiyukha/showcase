import { createThunkRoutine } from 'redux-thunk-routine';

export const showAnalytics = createThunkRoutine('ANALYTICS/SHOW');
export const getTotalVisits = createThunkRoutine('ANALYTICS/GET_TOTAL_VISITS');
export const getCardsAnalytics = createThunkRoutine('ANALYTICS/GET_CATEGORIES_STATS');
export const setAnalyticsDate = createThunkRoutine('ANALYTICS/SET_DATE');
