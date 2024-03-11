import React from 'react';
import { Provider } from 'react-redux';
import fireEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';

import ItemsList from '@/containers/ItemsList';

export const props = {
  list: 'my-showcases',
  navigateTo: jest.fn(),
};

const item = {
  user_id:'1',
  first_name:'Ilya',
  last_name:'Smiyukha',
  status:'published',
  type:'showcase',
  rfc_id:'1',
  name:'testload',
  created:1622711445,
  updated:1628159784,
  user_email:'ilya.smiyukha@touchcast.com',
  user_name:'Ilya Smiyukha',
};

const mockStore = configureStore([]);
const mockInitialState = {
  auth : {
    viewUrl: '',
  },
  rfc: {
    page:1,
    totalCount:1,
    creating:false,
    editing:false,
    getting:false,
    listLoading:false,
    error:'',
    rfcList: [],
  },
};


describe('ItemsList component', () => {
  let component;
  let store;

  beforeEach(() => {
    store = mockStore({
      ...mockInitialState,
      rfc: {
        ...mockInitialState.rfc,
        rfcList: [item],
      },
    });
    component = render(<Provider store={store}>
      <ItemsList {...props}/>
    </Provider>);
  });

  it('should render component with state', async () => {
    const { getByText } = component;
    const name = await getByText(/my showcases/i);
    expect(name).toBeInTheDocument();
  });


  it('should render shared showcases', async () => {
    const { rerender, getByText } = component;
    const newProps = {
      ...props,
      list: 'showcases-shared-with-me',
    };

    rerender(<Provider store={store}>
      <ItemsList {...newProps}/>
    </Provider>);

    const name = await getByText(/Showcases shared/i);
    expect(name).toBeInTheDocument();
  });

  it('should render empty list', async () => {
    const emptyStore = mockStore(mockInitialState);
    const {getByText} = render(<Provider store={emptyStore}>
      <ItemsList {...props}/>
    </Provider>);

    const name = await getByText(/no showcases/i);
    expect(name).toBeInTheDocument();
  });

  // dropdown cases
  it('should open change owner modal', async () => {
    const { getByText, findByTestId } = component;
    //open dropdown
    const dropdown = await findByTestId(/dropdown/i);
    fireEvent.click(dropdown);
    //click menu item
    const changebtn = await getByText(/change owner/i);
    fireEvent.click(changebtn);

    const expectedAction = 'POPUP/SHOW/REQUEST';
    const actions = store.getActions();
    expect(actions[0].type).toEqual(expectedAction);
  });

  // dropdown cases
  it('should open export csv modal', async () => {
    const { getByText, findByTestId } = component;
    //open dropdown
    const dropdown = await findByTestId(/dropdown/i);
    fireEvent.click(dropdown);
    //click menu item
    const changebtn = await getByText(/export/i);
    fireEvent.click(changebtn);

    const expectedAction = 'POPUP/SHOW/REQUEST';
    const actions = store.getActions();
    expect(actions[0].type).toEqual(expectedAction);
  });

  // dropdown cases
  it('should open delete modal', async () => {
    const { getByText, findByTestId } = component;
    //open dropdown
    const dropdown = await findByTestId(/dropdown/i);
    fireEvent.click(dropdown);
    //click menu item
    const deleteBtn = await getByText(/delete/i);
    fireEvent.click(deleteBtn);

    const expectedAction = 'POPUP/SHOW/REQUEST';
    const actions = store.getActions();
    expect(actions[0].type).toEqual(expectedAction);
  });

});
