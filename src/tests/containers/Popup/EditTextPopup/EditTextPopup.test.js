import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';
const mockStore = configureStore([]);

import { mockProps, mockInitialState } from './MockProps';

import EditTextPopup from '@/containers/Popup/EditTextPopup';

describe('Add button popup component', () => {
  let component;
  let store;

  beforeEach(() => {
    store = mockStore(mockInitialState);
    component = render(<Provider store={store}>
      <EditTextPopup {...mockProps} />
    </Provider>);
  });

  it('should render component with state', async () => {
    const { getByText } = component;
    const text = await getByText(/Showcase description/i);
    expect(text).toBeInTheDocument();
  });

});
