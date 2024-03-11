import { createThunkRoutine } from 'redux-thunk-routine';

export const getInitialData = createThunkRoutine('FILTERS/GET_DATA');
export const addFilter = createThunkRoutine('FILTERS/ADD_FILTER');
export const deleteFilter = createThunkRoutine('FILTERS/DELETE_FILTER');
export const addTags = createThunkRoutine('FILTERS/ADD_TAGS');
export const sortFilters = createThunkRoutine('FILTERS/SORT_FILTERS');
