export const mockProps = {
  onCloseClick: jest.fn(),
  group:
    'touchcastdev-new-ihIczB06',
  modalInfo: {},
  currentUserId:
    '1',
};

export const mockInitialState = {
  files: {
    files: {},
  },
  revisions: {
    settings: {
      personSettings: true,
      externalPreviewImageForLinks: true,
      fieldsLimits: {}
    },
  },
  filters: {
    allTagsList: [
      'one',
      'two',
      'new',
      'auto',
      'test',
      'qwerty',
    ],
  },
  categories: {
    fetchedLinkPreview: '',
  },
  users: {
    1: {
      user_id: '1',
      role: 'owner',
      first_name: 'name',
      last_name: 'lastname',
      email: 'ilya.smiyukha@touchcast.com',
    },
  },
};
