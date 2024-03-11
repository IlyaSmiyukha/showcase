import { createThunkRoutine } from 'redux-thunk-routine';

export const getShortcutInitialData = createThunkRoutine('SHORTCUTS/GET_DATA');
export const addShortcut = createThunkRoutine('SHORTCUTS/ADD_ITEM');
export const editShortcut = createThunkRoutine('SHORTCUTS/EDIT_ITEM');
export const deleteShortcut = createThunkRoutine('SHORTCUTS/DELETE_ITEM');
