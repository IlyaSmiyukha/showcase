import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';

import { mockProps } from './MockProps';

import store from '@/store/store';

import Published from '@/containers/Popup/Published';

describe('Add button popup component', () => {
  let component;

  beforeEach(() => {
    store.dispatch = jest.fn();
    component = render(<Provider store={store}>
      <Published {...mockProps} />
    </Provider>);
  });

  it('should render component with state', async () => {
    const { getByText } = component;
    const text = await getByText(/congratulations/i);
    expect(text).toBeInTheDocument();
  });

  it('should copy link',  async () => {
    const { getByText } = component;
    const copy =  await getByText(/copy/i);
    fireEvent.click(copy);
  });

});
