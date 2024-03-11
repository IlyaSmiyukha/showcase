import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';
const mockStore = configureStore([]);

import { mockProps, mockInitialState } from './MockProps';

import EditShortcut from '@/containers/Popup/EditShortcut';

describe('EditShortcut popup component', () => {
  let component;
  let store;

  beforeEach(() => {
    store = mockStore(mockInitialState);
    store.dispatch = jest.fn();
    component = render(<Provider store={store}>
      <EditShortcut {...mockProps} />
    </Provider>);
  });

  it('should change shortcut title',  () => {
    const { getByPlaceholderText } = component;
    const value = 'new name';
    const name =  getByPlaceholderText(/type shortcut title/i);
    fireEvent.change(name, { target: { value: value } });
    expect(name.value).toBe(value);
  });

  it('should change shortcut image',  () => {
    const { getByText } = component;
    const btn =  getByText(/choose preview/i);
    fireEvent.click(btn);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });


  it('should call edit action', () => {
    const { getByText } = component;
    const btn = getByText('Save');
    fireEvent.click(btn);
    expect(store.dispatch).toHaveBeenCalledTimes(0);
  });

});
