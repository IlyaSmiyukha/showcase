import { createThunkRoutine } from 'redux-thunk-routine';

export const getLayout = createThunkRoutine('LAYOUT/GET');
export const addRow = createThunkRoutine('LAYOUT/ADD_ROW');
export const deleteRow = createThunkRoutine('LAYOUT/DELETE_ROW');
export const splitToRows = createThunkRoutine('LAYOUT/SPLIT_TO_ROWS');
export const addColumn = createThunkRoutine('LAYOUT/ADD_COLUMN');
export const deleteColumn = createThunkRoutine('LAYOUT/DELETE_COLUMN');
export const sortRows = createThunkRoutine('LAYOUT/SORT_ROWS');
