import React from 'react';
import { Provider } from 'react-redux';
import fireEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import store from '@/store/store';

import Heading from '@/containers/Heading';

export const props = {
  text: 'showcase title',
  rfcId: '1',
  isPublished: false,
};

describe('Heading component', () => {
  let component;

  beforeEach(() => {
    store.dispatch = jest.fn();
    component = render(<Provider store={store}>
      <Heading {...props}/>
    </Provider>);
  });

  it('should render component with state', async () => {
    const { getByText } = component;
    const name = await getByText(/add background/i);
    expect(name).toBeInTheDocument();
  });


  it('should open edit logo modal', async () => {
    const { getByText } = component;
    const logo = await getByText(/logo/i);
    fireEvent.click(logo);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

  it('should open edit background modal', async () => {
    const { getByText } = component;
    const background = await getByText(/background/i);
    fireEvent.click(background);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

  it('should open edit background modal', async () => {
    const { getByText } = component;
    const background = await getByText(/background/i);
    fireEvent.click(background);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

  it('should open edit menu modal', async () => {
    const { getByText } = component;
    const menu = await getByText(/here to edit menu/i);
    fireEvent.click(menu);
    expect(store.dispatch).toHaveBeenCalledTimes(0);
  });

});
