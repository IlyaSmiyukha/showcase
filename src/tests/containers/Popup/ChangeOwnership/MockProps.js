export const mockProps = {
  onCloseClick: jest.fn(),
  fetchPeopleToShare: jest.fn(),
  changeOwnership: jest.fn(),
  navigateTo:  jest.fn(),
  group: 'group',
  modalInfo: 'modalInfo',
  currentUserId: 'modalInfo'
};

export const mockInitialState = {
  managePeople: {
    shareTo: [],
    loadingPeople: false
  }
};
