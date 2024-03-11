import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';
const mockStore = configureStore([]);

import { mockProps, mockInitialState } from './MockProps';

import RestoreRevision from '@/containers/Popup/RestoreRevision';

describe('Add button popup component', () => {
  let component;
  let store;

  beforeEach(() => {
    store = mockStore(mockInitialState);
    component = render(<Provider store={store}>
      <RestoreRevision {...mockProps} />
    </Provider>);
  });

  it('should render component with state', async () => {
    const { getByText } = component;
    const text = await getByText(/Select an old/i);
    expect(text).toBeInTheDocument();
  });

});
