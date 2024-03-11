import { createThunkRoutine } from 'redux-thunk-routine';

export const updateHeaderLogo = createThunkRoutine('HEADER/UPDATE_LOGO');
export const updateBackground = createThunkRoutine('HEADER/UPDATE_BACKGROUND');
export const updateHyperlinks = createThunkRoutine('HEADER/UPDATE_HYPERLINKS');
export const updateButton = createThunkRoutine('HEADER/UPDATE_BUTTON');
export const updateHeaderSettings = createThunkRoutine('HEADER/UPDATE_SETTINGS');
