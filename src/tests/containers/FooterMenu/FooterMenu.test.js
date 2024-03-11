import React from 'react';
import { Provider } from 'react-redux';
import fireEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import store from '@/store/store';
import {
  editFooterMenu,
} from '@/store/actions/footer';

import FooterMenuContainer from '@/containers/FooterMenuContainer';

describe('FooterMenuContainer component', () => {
  let component;

  beforeEach(() => {
    store.dispatch(editFooterMenu({
      menuItem: {
        name: 'name',
        links: [],
        id: '1',
      },
      type: 'add',
    }));
    store.dispatch = jest.fn();
    component = render(<Provider store={store}>
      <FooterMenuContainer />
    </Provider>);
  });

  it('should render component with state', async () => {
    const { getByText } = component;
    const name = await getByText(/add a new/i);
    expect(name).toBeInTheDocument();
  });

  it('should open add menu item modal', async () => {
    const { getByText } = component;
    const newItem = await getByText(/add a new/i);
    fireEvent.click(newItem);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });


  it('should open edit menu item modal', async () => {
    const { getByTestId } = component;
    const item = await getByTestId(/edit-menu/i);
    fireEvent.click(item);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

  it('should delete item', async () => {
    const { getByTestId, getByText } = component;
    const item = getByText(/name/i);
    const deletBtn = await getByTestId(/delete-menu/i);
    fireEvent.click(deletBtn);
    expect(item).toBeInTheDocument();
  });

});
