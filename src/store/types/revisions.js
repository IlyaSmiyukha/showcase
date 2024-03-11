import { createThunkRoutine } from 'redux-thunk-routine';

export const revisionUpdate = createThunkRoutine('RFC/REVISION/UPDATE');
export const revisionPublish = createThunkRoutine('RFC/REVISION/PUBLISH');
export const revisionUnpublish = createThunkRoutine('RFC/REVISION/UNPUBLISH');
export const revisionRestore = createThunkRoutine('RFC/REVISION/RESTORE');
export const revisionFetchInitialData = createThunkRoutine('RFC/REVISION/FETCH_INITIAL_DATA');
export const resetRfcData = createThunkRoutine('RFC/REVISION/RESET');
export const updateSettings = createThunkRoutine('RFC/REVISION/CHANGE_SETTINGS');
export const updateRfc = createThunkRoutine('RFC/REVISION/UPDATE_RFC');
export const setCurrentRfcID = createThunkRoutine('RFC/REVISION/SET_CURRENT_ID');
export const revisionDeleteFile = createThunkRoutine('RFC/REVISION/DELETE_FILE');
export const revisionGenereteCsv = createThunkRoutine('RFC/REVISION/GENERETE_CSV');
//header + footer actions
export const revisionUpdateText = createThunkRoutine('RFC/REVISION/UPDATE_TEXT');
