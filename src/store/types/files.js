import { createThunkRoutine } from 'redux-thunk-routine';

export const fetchMyFiles = createThunkRoutine('FILES/GET_ALL');
export const fetchSharedFiles = createThunkRoutine('FILES/GET_SHARED');
export const fetchFolder = createThunkRoutine('FILES/GET_FOLDER');
export const uploadFile = createThunkRoutine('FILES/UPLOAD_FILE');
export const clearSearchData = createThunkRoutine('FILES/CLEAR_SEARCH');
export const deleteVideoFile = createThunkRoutine('FILES/DELETE_VIDEO');
export const clearFilesData = createThunkRoutine('FILES/CLEAR_DATA');
export const fetchFoldersList = createThunkRoutine('FILES/FETCH_FOLDERS_LIST');

export const addFile = createThunkRoutine('FILES/ADD_FILE');
export const trackUploadProgress = createThunkRoutine('FILES/TRACK_UPLOAD_PROGRESS');
export const trackProcessingProgress = createThunkRoutine('FILES/TRACK_PROCESSING_PROGRESS');
