export const mockProps = {
  rfcId: 'rfcId',
  organizationId: 'organizationId',
  onCloseClick: jest.fn(),
  hideSpecialPopup: jest.fn(),
  handleClosePopupClick:  jest.fn(),
  permissions: {},
  group: 'group',
  editRfcPermissions: jest.fn(),
  revisionPublish: jest.fn(),
  settings: {},
};

export const mockInitialState = {
  revisions: {
    settings:{},
  },
  rfc: {
    prmissions: {}
  }
};
