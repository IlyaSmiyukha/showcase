import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';
const mockStore = configureStore([]);

import { mockProps, mockInitialState } from './MockProps';

import Publish from '@/containers/Popup/Publish';

describe('Publish popup component', () => {
  let component;
  let store;

  beforeEach(() => {
    store = mockStore(mockInitialState);
    component = render(<Provider store={store}>
      <Publish {...mockProps} />
    </Provider>);
  });

  it('should render component with state', async () => {
    const { getByText } = component;
    const text = await getByText(/Showcase privacy/i);
    expect(text).toBeInTheDocument();
  });

  it('should change permissions', async () => {
    // const { getByText } = component;
    // const text = await getByText(/Showcase privacy/i);
    // expect(text).toBeInTheDocument();
  });

  it('should show custom message field', async () => {
    // const { getByLabelText, getByPlaceholderText } = component;
    // const checkbox = await getByLabelText(/Send followers/i);
    // fireEvent.click(checkbox);
    // const field = await getByPlaceholderText(/add a personal/i)
    // expect(field).toBeInTheDocument();
  });

});
