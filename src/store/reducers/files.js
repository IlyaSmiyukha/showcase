import * as types from '@/store/types/files';
import {
  revisionFetchInitialData,
  resetRfcData,
} from '@/store/types/revisions';

import {
  addNewItems,
} from '@/store/types/categories';
import _ from 'lodash';

const initialState = {
  published: {
  },
  files: {
  },
  myFiles: {
    files: [],
    totalFiles: 0,
    offset: 0,
  },
  myFilesSearch: {
    files: [],
    totalFiles: 0,
    offset: 0,
  },
  sharedFiles: {
    files: [],
    totalFiles: 0,
    offset: 0,
  },
  sharedFilesSearch: {
    files: [],
    totalFiles: 0,
    offset: 0,
  },
  myFilesByType: {
    files: [],
    totalFiles: 0,
    offset: 0,
    type: ''
  },
  sharedFilesByType: {
    files: [],
    totalFiles: 0,
    offset: 0,
    type: ''
  },
  showLoader: false,
  search: '',
  folders: {},
  uploadingState: {},
  processingState: {},
  foldersList: []
};

export default function files(state = initialState, action) {
  switch (action.type) {

    case revisionFetchInitialData.SUCCESS:
    case addNewItems.SUCCESS:{
      const {
        files,
      } = action.result;
      return files.length ? {
        ...state,
        files: {
          ...state.files,
          ..._.keyBy(files, 'file_id'),
        },
      } : state;
    }

    case types.fetchMyFiles.REQUEST: {
      return {
        ...state,
        showLoader: true,
      };
    }

    case types.fetchMyFiles.SUCCESS: {
      const {
        files,
        total_files: totalFiles,
        search,
        filesList,
        folderFiles,
        type
      } = action.result;

      let myFiles = {...state.myFiles};
      let myFilesSearch = {...state.myFilesSearch};
      let myFilesByType = {...state.myFilesByType};

      if (search) {
        const newFiles = search === state.search ?  _.uniq([
          ...state.myFilesSearch.files,
          ...files.map(item => item.file_id),
        ]) : files.map(item => item.file_id);
        myFilesSearch = {
          totalFiles,
          offset: state.myFilesSearch.offset + files.length,
          files:  newFiles,
        };
      } else if (type) {
        const newFiles = type === state.myFilesByType.type ? _.uniq([
          ...state.myFilesByType.files,
          ...files.map(item => item.file_id),
        ]) : files.map(item => item.file_id)
        myFilesByType = {
          totalFiles: totalFiles,
          offset: type === state.myFilesByType.type ?  state.myFilesByType.offset + files.length : files.length,
          files: newFiles,
          type
        };
      } else {
        myFiles = {
          totalFiles: !!state.myFiles.totalFiles ? state.myFiles.totalFiles : totalFiles,
          offset: state.myFiles.offset + files.length,
          files: _.uniq([
            ...state.myFiles.files,
            ...files.map(item => item.file_id),
          ]) ,
        };
      }

      if (filesList) {
        myFiles = state.myFiles;
      }

      return {
        ...state,
        files: _.merge(state.files, _.keyBy([
          ...folderFiles,
          ...files,
        ], 'file_id')),
        myFiles,
        myFilesSearch,
        search,
        myFilesByType,
        showLoader: false,
      };
    }

    case types.fetchMyFiles.FAILURE:{
      return {
        ...state,
        showLoader: false,
      };
    }
    case types.fetchSharedFiles.REQUEST:{
      return {
        ...state,
        showLoader: true,
      };
    }
    case types.fetchSharedFiles.SUCCESS: {
      const {
        files,
        total_files: totalFiles,
        search,
        type
      } = action.result;

      let sharedFiles = state.sharedFiles;
      let sharedFilesSearch = state.sharedFilesSearch;
      let sharedFilesByType = {...state.myFilesByType};

      if (search) {
        const newFiles = search === state.search ?  _.uniq([
          ...state.sharedFilesSearch.files,
          ...files.map(item => item.file_id),
        ]) : files.map(item => item.file_id);

        sharedFilesSearch = {
          totalFiles: totalFiles,
          offset: state.sharedFilesSearch.offset + newFiles.length,
          files: newFiles,
        };
      } else if (type) {
        const newFiles = type === state.sharedFilesByType.type ? _.uniq([
          ...state.sharedFilesByType.files,
          ...files.map(item => item.file_id),
        ]) : files.map(item => item.file_id)
        sharedFilesByType = {
          totalFiles: totalFiles,
          offset: type === state.sharedFilesByType.type ?  state.sharedFilesByType.offset + files.length : files.length,
          files: newFiles,
          type
        };
      } else {
        sharedFiles = {
          totalFiles: totalFiles,
          offset: state.sharedFiles.offset + files.length,
          files: [...state.sharedFiles.files,
            ...files.map(item => item.file_id)],
        };
      }

      return {
        ...state,
        showLoader: false,
        files: {
          ...state.files,
          ..._.keyBy(files ,'file_id'),
        },
        sharedFiles,
        sharedFilesSearch,
        sharedFilesByType,
        search,
      };
    }

    case types.fetchSharedFiles.FAILURE:{
      return {
        ...state,
        showLoader: false,
      };
    }

    case types.fetchFolder.REQUEST:{
      return {
        ...state,
        showLoader: true,
      };
    }

    case types.fetchFolder.SUCCESS: {
      const {
        files,
        total_files,
        folderId,
      } = action.result;

      const newFilesList = _.merge(state.files, _.keyBy([
        ...files,
      ], 'file_id'));

      return {
        ...state,
        files: {...newFilesList},
        folders: {
          ...state.folders,
          [folderId]: {
            files: state.folders[folderId] ? _.uniqBy([...state.folders[folderId].files, ...files], 'file_id') : files,
            totalFiles: total_files,
            offset: state.folders[folderId] ? _.uniqBy([...state.folders[folderId].files, ...files], 'file_id').length : files.length,
          },
        },
        showLoader: false,
      };
    }

    case types.fetchFolder.FAILURE:{
      return {
        ...state,
        showLoader: false,
      };
    }

    case types.trackUploadProgress.SUCCESS:{
      const {
        fileId,
        progress,
      } = action.payload;


      return {
        ...state,
        uploadingState: {
          [fileId]: progress,
        },
      };
    }

    case types.trackProcessingProgress.SUCCESS:{
      const {
        fileId,
        progress,
      } = action.payload;

      return {
        ...state,
        processingState: {
          [fileId]: progress,
        },
      };
    }

    case types.clearSearchData.SUCCESS:{
      return {
        ...state,
        search: '',
        myFilesSearch: {
          files: [],
          totalFiles: 0,
          offset: 0,
        },
        sharedFilesSearch: {
          files: [],
          totalFiles: 0,
          offset: 0,
        },
      };
    }
    
    case types.deleteVideoFile.SUCCESS:{
      const removedId = action.payload;
      return {
        ...state,
        files: {
          ...Object.keys(state.files)
            .filter(key => key !== removedId)
            .reduce((obj, key) => {
              obj[key] = state.files[key];
              if (obj[key].type === 'folder') {
                obj[key].extra.folder.items = obj[key].extra.folder.items.filter(item => item.id !== removedId);
              }
              return obj;
            }, {}),
        },
        myFiles: {
          files: [...state.myFiles.files.filter(file => file !== removedId)],
          totalFiles: !state.myFiles.totalFiles ?  0  : state.myFiles.totalFiles - 1,
          offset: !state.myFiles.offset ?  0  : state.myFiles.offset - 1,
        },
        myFilesSearch: {
          files: [...state.myFilesSearch.files.filter(file => file !== removedId)],
          totalFiles: !state.myFilesSearch.totalFiles ?  0  : state.myFilesSearch.totalFiles - 1,
          offset: !state.myFilesSearch.offset ?  0  : state.myFilesSearch.offset - 1,
        },
        sharedFiles: {
          files: [...state.sharedFiles.files.filter(file => file !== removedId)],
          totalFiles: !state.sharedFiles.totalFiles ?  0  : state.sharedFiles.totalFiles - 1,
          offset: !state.sharedFiles.offset ?  0  : state.sharedFiles.offset - 1,
        },
        sharedFilesSearch: {
          files: [...state.sharedFilesSearch.files.filter(file => file !== removedId)],
          totalFiles: !state.sharedFilesSearch.totalFiles ?  0  : state.sharedFilesSearch.totalFiles - 1,
          offset: !state.sharedFilesSearch.offset ?  0  : state.sharedFilesSearch.offset - 1,
        },
        myFilesByType: {
          files: [...state.myFilesByType.files.filter(file => file !== removedId)],
          totalFiles: !state.myFilesByType.totalFiles ?  0  : state.myFilesByType.totalFiles - 1,
          offset: !state.myFilesByType.offset ?  0  : state.myFilesByType.offset - 1,
          type: state.myFilesByType.type
        },
        sharedFilesByType: {
          files: [...state.sharedFilesByType.files.filter(file => file !== removedId)],
          totalFiles: !state.sharedFilesByType.totalFiles ?  0  : state.sharedFilesByType.totalFiles - 1,
          offset: !state.sharedFilesByType.offset ?  0  : state.sharedFilesByType.offset - 1,
          type: state.sharedFilesByType.type
        },
        foldersList: state.foldersList.filter(folder => folder.folder_id !== removedId)
      };
    }

    case types.addFile.SUCCESS:{
      const file = action.result;
      const myFiles = {...state.myFiles};
      const folders = {...state.folders};
      const folderID =_.get(file, 'extra.container_file_id');
      const originalFilename = state.files[file.file_id] ? state.files[file.file_id].original_filename : file.original_filename;
      
      if (folderID) {
        const currentFolder = folders[folderID] || {
          files: [],
          totalFiles: 0,
          offset: 0,
        };
        const isFileIssenInFolder = currentFolder.files.find(folderFile => folderFile.file_id === file.file_id);
        return {
          ...state,
          files: {
            ...state.files,
            [file.file_id]: {
              ...file,
              original_filename: originalFilename,
            },
          },
          folders: {
            ...folders,
            [folderID]: {
              files:
                isFileIssenInFolder ? currentFolder.files.map(folderFile => folderFile.file_id === file.file_id ? file : folderFile) : [file,
                  ...currentFolder.files ],
              totalFiles: currentFolder.ftotalFiles + 1,
              offset: currentFolder.files.length + 1,
            },
          },
          myFiles: {
            files: myFiles.files.filter(id => id !== file.file_id),
            totalFiles: myFiles.totalFiles +1,
            offset: myFiles.files.length,
          },
          foldersList: state.foldersList.filter(folder => folder.folder_id !== file.file_id)
        };
      } else {
        const myFilesByType = {...state.myFilesByType};
        let foldersList = [...state.foldersList]
        if (myFilesByType.type) {
          myFilesByType['files'] = myFilesByType.files.includes(file.file_id) ? myFilesByType.files : [file.file_id,
            ...myFilesByType.files]
        }

        const newFolder = file.type === 'folder' && !file.extra.container_file_id ? {
          name: file.name,
          folder_id: file.file_id,
          created: file.created
        } : null
        
        if(newFolder) {
          foldersList = foldersList.find(folder => folder.folder_id === newFolder.folder_id) ? 
                        foldersList.map(folder => folder.folder_id === newFolder.folder_id ? newFolder : folder)
                        :  [newFolder, ...state.foldersList]
        }

        return {
          ...state,
          files: {
            ...state.files,
            [file.file_id]: {
              ...file,
              original_filename: originalFilename,
            },
          },
          myFiles: {
            files: myFiles.files.includes(file.file_id) ? myFiles.files : [file.file_id,
              ...myFiles.files],
            totalFiles: myFiles.totalFiles +1,
            offset: myFiles.files.length,
          },
          myFilesByType,
          foldersList
        };
      }
    }

    case types.fetchFoldersList.SUCCESS: {
      return {
        ...state,
        foldersList: action.result
      }
    }

    case types.clearFilesData.SUCCESS:
    case resetRfcData.SUCCESS:
      return initialState;

    default: {
      return state;
    }
  }
}
