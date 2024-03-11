export const mockProps = {
  onCloseClick: jest.fn(),
  group:
    'group',
  modalInfo: {
    categoryId:
      '1623918613',
    index: 2,
  },
};

export const mockInitialState = {
  currentRfcID: 'rfcId',
  revisions: {
    rfcData: {
      organization_url: 'url',
    },
    revisionsList:[
      {
        revision_id:'1',
        updated:1633683898,
        user_id:'428689488013689092',
        type:'published',
      },
      {
        revision_id:'2',
        updated:1633683658,
        user_id:'428689488013689092',
        type:'published',
      },
      {
        revision_id:'3',
        updated:1633683407,
        user_id:'428689488013689092',
        type:'published',
      },
    ],
  },
};
