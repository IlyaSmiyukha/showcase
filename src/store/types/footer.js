import { createThunkRoutine } from 'redux-thunk-routine';

// footer actions
export const editFooterMenu = createThunkRoutine('FOOTER/EDIT_MENU');
export const sortFooterMenu = createThunkRoutine('FOOTER/SORT_MENU');
export const deleteFooterMenu = createThunkRoutine('FOOTER/DELETE_MENU');
export const updateFooterLogo = createThunkRoutine('FOOTER/UPDATE_LOGO');
