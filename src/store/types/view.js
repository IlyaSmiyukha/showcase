import { createThunkRoutine } from 'redux-thunk-routine';

export const showPopup = createThunkRoutine('POPUP/SHOW');
export const hidePopup = createThunkRoutine('POPUP/HIDE');
export const hideSpecialPopup = createThunkRoutine('POPUP/HIDE_SPECIAL');
export const updatePopupInfo = createThunkRoutine('POPUP/UPDATE_INFO');

export const setPlaceholderProps = createThunkRoutine('DRAG/SET_PLACEHOLDER_PROPS');
