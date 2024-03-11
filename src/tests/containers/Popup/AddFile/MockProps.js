import {
  mineFile,
  sharedFile,
  folderFile,
} from '@/tests/__mocks/fileMocks';

export const mockProps = {
  onCloseClick: jest.fn(),
  group:
    'touchcastdev-new-ihIczB06',
  modalInfo: {},
  uploadingState: {},
  processingState: {},
  addNewItems: jest.fn(),
  pusher: {
    subscribeOnFolderChannel: jest.fn(),
    unsubscribeFromFolderChannel: jest.fn()
  }
};

export const mockInitialState = {
  files: {
    published: {
    },
    files: {
      [mineFile.file_id]: mineFile,
      [sharedFile.file_id]: sharedFile,
      [folderFile.file_id]: folderFile,
    },
    myFiles: {
      files: [
        mineFile.file_id,
        folderFile.file_id,
      ],
      totalFiles: 2,
      offset: 2,
    },
    myFilesSearch: {
      files: [],
      totalFiles: 0,
      offset: 0,
    },
    sharedFiles: {
      files: [
        sharedFile.file_id,
        folderFile.file_id,
      ],
      totalFiles: 1,
      offset: 1,
    },
    sharedFilesSearch: {
      files: [],
      totalFiles: 0,
      offset: 0,
    },
    showLoader: false,
    search: '',
    folders: {},
    uploadingState: {},
    processingState: {},
    folders: {},
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
  },
  revisions: {
    settings: {},
  },

};
