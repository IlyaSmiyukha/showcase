import { mineFile } from '@/tests/__mocks/fileMocks';

export const mockProps = {
  file: mineFile,
  editItem: jest.fn(),
  onDeleteClick: jest.fn(),
  filesList: {
    [mineFile.file_id]: mineFile,
  },
  uploadingState: {},
  processingState: {},
  settings: {
    personSettings: true,
  },
};
