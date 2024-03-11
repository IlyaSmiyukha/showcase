import files from '@/store/reducers/files';
import * as types from '@/store/types/files';

import {mineFile} from '@/tests/__mocks/fileMocks';

import {
  revisionFetchInitialData,
  resetRfcData,
} from '@/store/types/revisions';

import {
  addNewItems,
} from '@/store/types/categories';

describe('Files reducer', () => {
  let initialState = {};

  beforeEach(() => {
    initialState = {
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
    };
  });

  it('should return the initial state', () => {
    expect(files(undefined, initialState)).toEqual(initialState);
  });

  it('should handle clearFilesData', () => {
    const payload = null;
    expect(files(initialState, {
      type: types.clearFilesData.SUCCESS,
      payload,
    })).toEqual(initialState);
  });

  it('should handle resetRfcData', () => {
    const payload = null;
    expect(files(initialState, {
      type: resetRfcData.SUCCESS,
      payload,
    })).toEqual(initialState);
  });

  it('should handle revisionFetchInitialData', () => {
    expect(files(initialState, {
      type: revisionFetchInitialData.SUCCESS,
      result: {
        files:  [mineFile],
      },
    })).toEqual({
      ...initialState,
      files: {
        [mineFile.file_id]: mineFile,
      },
    });
  });

  it('should handle addNewItems', () => {
    expect(files(initialState, {
      type: addNewItems.SUCCESS,
      result: {
        files:  [mineFile],
      },
    })).toEqual({
      ...initialState,
      files: {
        [mineFile.file_id]: mineFile,
      },
    });
  });

  it('should handle fetchMyFiles REQUEST', () => {
    const payload = null;
    expect(files(initialState, {
      type: types.fetchMyFiles.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      showLoader: true,
    });
  });

  it('should handle fetchMyFiles SUCCESS', () => {
    const payload = {
      files: [mineFile],
      total_files: 1,
      folderFiles: [],
      search: '',
    };
    expect(files(initialState, {
      type: types.fetchMyFiles.SUCCESS,
      result: payload,
    })).toEqual({
      ...initialState,
      files: {
        [mineFile.file_id]: mineFile,
      },
      myFiles: {
        files: ['06e15fb1e1c7428bbd7b2a489793497c'],
        totalFiles: 1,
        offset: 1,
      },
    });
  });

  it('should handle fetchFolder SUCCESS', () => {
    const payload = {
      files: [mineFile],
      total_files: 1,
      folderId: 'folderId',
    };
    expect(files(initialState, {
      type: types.fetchFolder.SUCCESS,
      result: payload,
    })).toEqual({
      ...initialState,
      files: {
        [mineFile.file_id]: mineFile,
      },
      folders: {
        folderId: {
          files: [mineFile],
          totalFiles: 1,
          offset: 1,
        },
      },
    });
  });

  it('should handle fetchMyFiles SUCCESS with search', () => {
    const payload = {
      files: [mineFile],
      total_files: 1,
      folderFiles: [],
      search: 'new',
    };
    expect(files(initialState, {
      type: types.fetchMyFiles.SUCCESS,
      result: payload,
    })).toEqual({
      ...initialState,
      files: {
        [mineFile.file_id]: mineFile,
      },
      myFilesSearch: {
        files: ['06e15fb1e1c7428bbd7b2a489793497c'],
        totalFiles: 1,
        offset: 1,
      },
      search: 'new',
    });
  });

  it('should handle fetchMyFiles FAILURE', () => {
    const payload = null;
    expect(files(initialState, {
      type: types.fetchMyFiles.FAILURE,
      payload,
    })).toEqual(initialState);
  });

  it('should handle fetchSharedFiles REQUEST', () => {
    const payload = null;
    expect(files(initialState, {
      type: types.fetchSharedFiles.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      showLoader: true,
    });
  });

  it('should handle fetchSharedFiles SUCCESS', () => {
    const payload = {
      files: [mineFile],
      total_files: 1,
      search: '',
    };
    expect(files(initialState, {
      type: types.fetchSharedFiles.SUCCESS,
      result: payload,
    })).toEqual({
      ...initialState,
      files: {
        [mineFile.file_id]: mineFile,
      },
      sharedFiles: {
        files: ['06e15fb1e1c7428bbd7b2a489793497c'],
        totalFiles: 1,
        offset: 1,
      },
    });
  });

  it('should handle fetchSharedFiles with search SUCCESS', () => {
    const payload = {
      files: [mineFile],
      total_files: 1,
      search: 'new',
    };
    expect(files(initialState, {
      type: types.fetchSharedFiles.SUCCESS,
      result: payload,
    })).toEqual({
      ...initialState,
      files: {
        [mineFile.file_id]: mineFile,
      },
      sharedFilesSearch: {
        files: ['06e15fb1e1c7428bbd7b2a489793497c'],
        totalFiles: 1,
        offset: 1,
      },
      search: 'new',
    });
  });

  it('should handle fetchSharedFiles FAILURE', () => {
    const payload = null;
    expect(files(initialState, {
      type: types.fetchSharedFiles.FAILURE,
      payload,
    })).toEqual(initialState);
  });

  it('should handle fetchFolder REQUEST', () => {
    const payload = null;
    expect(files(initialState, {
      type: types.fetchFolder.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      showLoader: true,
    });
  });

  it('should handle fetchFolder SUCCESS', () => {
    const payload = {
      files: [mineFile],
      total_files: 1,
      folderId: mineFile.file_id,
    };
    expect(files(initialState, {
      type: types.fetchFolder.SUCCESS,
      result: payload,
    })).toEqual({
      ...initialState,
      files: {
        [mineFile.file_id]: mineFile,
      },
      folders: {
        [mineFile.file_id]: {
          files: [mineFile],
          totalFiles: 1,
          offset: 1,
        },
      },
    });
  });

  it('should handle fetchFolder FAILURE', () => {
    const payload = null;
    expect(files(initialState, {
      type: types.fetchFolder.FAILURE,
      payload,
    })).toEqual(initialState);
  });

  it('should handle trackUploadProgress', () => {
    const payload = {
      fileId: 'id',
      progress: 10,
    };
    expect(files({
      ...initialState,
      files: {
        id: {
          name: 'name',
          file_id: 'id',
        },
      },
    }, {
      type: types.trackUploadProgress.SUCCESS,
      payload,
    })).toEqual({
      ...initialState,
      files: {
        id: {
          name: 'name',
          file_id: 'id',
        },
      },
      uploadingState: {
        id: 10,
      },
    });
  });

  it('should handle trackProcessingProgress', () => {
    const payload = {
      fileId: 'id',
      progress: 10,
    };
    expect(files({
      ...initialState,
      files: {
        id: {
          name: 'name',
          file_id: 'id',
        },
      },
    }, {
      type: types.trackProcessingProgress.SUCCESS,
      payload,
    })).toEqual({
      ...initialState,
      files: {
        id: {
          name: 'name',
          file_id: 'id',
        },
      },
      processingState: {
        id: 10,
      },
    });
  });

  it('should handle clearSearchData', () => {
    const payload = null;
    expect(files(initialState, {
      type: types.clearSearchData.SUCCESS,
      payload,
    })).toEqual(initialState);
  });

  it('should handle deleteVideoFile from files', () => {
    const payload = 'id';
    expect(files({
      ...initialState,
      files: {
        id: {
          file_id: 'id',
        },
      },
    }, {
      type: types.deleteVideoFile.SUCCESS,
      payload,
    })).toEqual(initialState);
  });

  it('should handle deleteVideoFile from myFiles', () => {
    const payload = 'id';
    expect(files({
      ...initialState,
      myFiles: {
        files: ['id'],
        offset: 1,
        totalFiles: 1,
      },
    }, {
      type: types.deleteVideoFile.SUCCESS,
      payload,
    })).toEqual(initialState);
  });

  it('should handle deleteVideoFile from sharedFiles', () => {
    const payload = 'id';
    expect(files({
      ...initialState,
      sharedFiles: {
        files: ['id'],
        offset: 1,
        totalFiles: 1,
      },
    }, {
      type: types.deleteVideoFile.SUCCESS,
      payload,
    })).toEqual(initialState);
  });

  it('should handle deleteVideoFile from myFilesSearch', () => {
    const payload = 'id';
    expect(files({
      ...initialState,
      myFilesSearch: {
        files: ['id'],
        offset: 1,
        totalFiles: 1,
      },
    }, {
      type: types.deleteVideoFile.SUCCESS,
      payload,
    })).toEqual(initialState);
  });

  it('should handle deleteVideoFile from sharedFilesSearch', () => {
    const payload = 'id';
    expect(files({
      ...initialState,
      sharedFilesSearch: {
        files: ['id'],
        offset: 1,
        totalFiles: 1,
      },
    }, {
      type: types.deleteVideoFile.SUCCESS,
      payload,
    })).toEqual(initialState);
  });

  it('should handle addFile SUCCESS', () => {
    const payload = mineFile;
    expect(files(initialState, {
      type: types.addFile.SUCCESS,
      result: payload,
    })).toEqual({
      ...initialState,
      files: {
        [mineFile.file_id]: mineFile,
      },
      myFiles: {
        files: ['06e15fb1e1c7428bbd7b2a489793497c'],
        totalFiles: 1,
        offset: 0,
      },
    });
  });

});
