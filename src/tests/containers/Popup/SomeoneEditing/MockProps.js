export const mockProps = {
  onCloseClick: jest.fn(),
  modalInfo: {
    editorId:
      '1',
  },
};

export const mockInitialState = {
  managePeople: {
    editors: [{
      user_id:'1',
      status:'online',
      joined:1622711445,
      role:'editor',
      first_name:'name',
      last_name:'lastname',
      email:'ilya.smiyukha@touchcast.com',
    }],
  },
};
