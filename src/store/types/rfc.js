import { createThunkRoutine } from 'redux-thunk-routine';

export const createRfc = createThunkRoutine('RFC/CREATE');
export const editRfc = createThunkRoutine('RFC/EDIT');
export const duplicateRfc = createThunkRoutine('RFC/DUPLICATE');
export const getRfcInfo = createThunkRoutine('RFC/GET_INFO');
export const fetchRfcList = createThunkRoutine('RFC/GET_LIST');
export const deleteRfc = createThunkRoutine('RFC/DELETE');
export const editRfcPermissions = createThunkRoutine('RFC/EDIT_PERMISSIONS');
export const clearRfcError = createThunkRoutine('RFC/CLEAR_ERROR');
