import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';
const mockStore = configureStore([]);

import { mockProps, mockInitialState } from './MockProps';

import SomeoneEditing from '@/containers/Popup/SomeoneEditing';

describe('SomeoneEditing popup component', () => {
  let component;
  let store;

  beforeEach(() => {
    store = mockStore(mockInitialState);
    component = render(<Provider store={store}>
      <SomeoneEditing {...mockProps} />
    </Provider>);
  });

  it('should change filter title',  () => {
    const { getByText } = component;
    const name =  getByText(/name lastname/i);
    expect(name).toBeInTheDocument();
  });
});
