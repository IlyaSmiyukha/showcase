import React from 'react';
import { Provider } from 'react-redux';
import fireEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import store from '@/store/store';
import {
  editFooterMenu,
} from '@/store/actions/footer';

import Footer from '@/containers/Footer';

export const props = {
  text: 'showcase title',
  rfcId: '1',
  isPublished: false,
};

describe('Footer component', () => {
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
      <Footer {...props}/>
    </Provider>);
  });

  it('should render component with state', async () => {
    const { getByText } = component;
    const name = await getByText(/footer text/i);
    expect(name).toBeInTheDocument();
  });


  it('should open add logo modal', async () => {
    const { getByText } = component;
    const newItem = await getByText(/footer logo/i);
    fireEvent.click(newItem);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

  it('should open add text modal', async () => {
    const { getByText } = component;
    const newItem = await getByText(/footer text/i);
    fireEvent.click(newItem);
    expect(store.dispatch).toHaveBeenCalledTimes(0);
  });

});
