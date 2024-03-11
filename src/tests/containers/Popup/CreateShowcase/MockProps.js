export const mockProps = {
  onCloseClick: jest.fn(),
  isEditMode: false,
  navigateTo: jest.fn(),
  playerConfig: {},
  modalInfo: {},
  rfc_id: '',
};

export const mockInitialState = {
  revisions: {
    rfcData: {
      rfc_id: '123',
    },
  },
  rfc: {
    error:'',
  },
};
