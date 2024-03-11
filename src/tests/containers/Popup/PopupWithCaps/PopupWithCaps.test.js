import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';

import { mockProps } from './MockProps';

import store from '@/store/store';

import PopupWithCaps from '@/containers/Popup/PopupWithCaps';

describe('Add button popup component', () => {
  let component;

  beforeEach(() => {
    store.dispatch = jest.fn();
    component = render(<Provider store={store}>
      <PopupWithCaps {...mockProps} />
    </Provider>);
  });

  it('should change title field',  async () => {
    const { getByPlaceholderText } = component;
    const value = 'new name';
    const name =  await getByPlaceholderText(/this is/i);
    fireEvent.change(name, { target: { value: value } });
    expect(name.value).toBe(value);
  });

  it('should enable force caps',  async () => {
    const { getByLabelText } = component;

    const caps = await getByLabelText(/force all/i);
    fireEvent.click(caps);
    expect(caps).not.toBeChecked();
  });

  it('should save title',  async () => {
    const { getByText } = component;

    const caps = await getByText(/save/i);
    fireEvent.click(caps);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

});
