import _ from 'lodash';

import {
  createSelector,
} from 'reselect';

export const getFilesState = createSelector([state => _.get(state, 'files')], filesState => filesState);

export const getFiles = createSelector([state => _.get(state, 'files')], files => files.files);
export const getFolders = createSelector([state => _.get(state, 'files')], files => files.folders);

export const getFilesArray = createSelector([state => _.get(state, 'files')], files => Object.values(files.files));

export const getMyFilesArray = createSelector([state => _.get(state, 'files.files'),
  state => _.get(state, 'files.myFiles.files')], (files, myFiles) => {
  return myFiles
    .map(id => files[id] || null)
    .filter(file => file);
});

export const getMyFilesOffset = createSelector([state => _.get(state, 'files.myFiles')], (files) => files.offset);

export const getMyFilesTotal = createSelector([state => _.get(state, 'files.myFiles')], (files) => files.totalFiles);

export const getMyFilesSearch = createSelector([state => _.get(state, 'files.files'),
  state => _.get(state, 'files.myFilesSearch.files')], (files, myFilesSearch) => {
  return myFilesSearch
    .map(id => files[id] || null)
    .filter(file => file);
});

export const getMyFilesSearchOffset = createSelector([state => _.get(state, 'files.myFilesSearch')], (files) => files.offset);

export const getMyFilesSearchTotal = createSelector([state => _.get(state, 'files.myFilesSearch')], (files) => files.totalFiles);

export const getSharedFilesArray = createSelector([state => _.get(state, 'files.files'),
  state => _.get(state, 'files.sharedFiles.files')], (files, sharedFiles) => {
  return sharedFiles
    .map(id => files[id] || null)
    .filter(file => file);
});

export const getSharedFilesOffset = createSelector([state => _.get(state, 'files.sharedFiles')], (files) => files.offset);

export const getSharedFilesTotal = createSelector([state => _.get(state, 'files.sharedFiles')], (files) => files.totalFiles);

export const getSharedFilesSearch = createSelector([state => _.get(state, 'files.files'),
  state => _.get(state, 'files.sharedFilesSearch.files')], (files, sharedFiles) => {
  return sharedFiles
    .map(id => files[id] || null)
    .filter(file => file);
});

export const getSharedFilesSearchOffset = createSelector([state => _.get(state, 'files.sharedFilesSearch')], (files) => files.offset);

export const getSharedFilesSearchTotal = createSelector([state => _.get(state, 'files.sharedFilesSearch')], (files) => files.totalFiles);

export const getMyFilesByType = createSelector([getFilesState], filesState => ({
  ...filesState.myFilesByType,
  files: filesState.myFilesByType.files.map(id => filesState.files[id] || null)
    .filter(file => file)
}));

export const getSharedFilesByType = createSelector([getFilesState], filesState => ({
  ...filesState.sharedFilesByType,
  files: filesState.sharedFilesByType.files.map(id => filesState.files[id] || null)
    .filter(file => file)
}));

export const getFilesLoader = createSelector([state => _.get(state, 'files')], (files) => files.showLoader);

export const getMyFilesLoaded = createSelector([state => _.get(state, 'files.myFiles.files')], myFiles => !!myFiles.length);

export const getSharedFilesLoaded = createSelector([state => _.get(state, 'files.sharedFiles.files')], sharedFiles => !!sharedFiles.length);

export const getUploadingState = createSelector([getFilesState], filesState => filesState.uploadingState);
export const getProcessingState = createSelector([getFilesState], filesState => filesState.processingState);

export const getSearchQuery = createSelector([getFilesState], filesState => filesState.search);

export const getFoldersList = createSelector([getFilesState], filesState => filesState.foldersList);
