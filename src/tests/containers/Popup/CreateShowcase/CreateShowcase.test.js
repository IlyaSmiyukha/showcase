import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';
const mockStore = configureStore([]);

import { mockProps, mockInitialState } from './MockProps';

import CreateShowcase from '@/containers/Popup/CreateShowcase';

describe('CreateShowcase popup component', () => {
  let component;
  let store;

  beforeEach(() => {
    store = mockStore(mockInitialState);
    store.dispatch = jest.fn();
    component = render(<Provider store={store}>
      <CreateShowcase {...mockProps} />
    </Provider>);
  });


  it('should update name field', async () => {
    const { getByPlaceholderText } = component;
    const value = 'new name';
    const name = await getByPlaceholderText(/showcase name/i);
    fireEvent.change(name, { target: { value: value } });
    expect(name.value).toBe(value);
  });

  it('should update url field', async () => {
    const { getByRole } = component;
    const value = 'new-url';
    const url = await getByRole('input');
    fireEvent.change(url, { target: { value: value } });
    expect(url.value).toBe(value);
  });

  it('should show advanced settings', async () => {
    const { getByText } = component;
    const showSettings = await getByText(/Show advanced settings/i);
    fireEvent.click(showSettings);

    const oneSetting = await getByText(/Hide card title/i);
    expect(oneSetting).toBeInTheDocument();
  });

  it('should update advanced settings', async () => {
    const { getByText, getByLabelText } = component;
    const showSettings = await getByText(/Show advanced settings/i);
    fireEvent.click(showSettings);

    const oneSetting = await getByLabelText(/Hide card title/i);
    fireEvent.click(oneSetting);
    expect(oneSetting).toBeChecked();
  });

  it('should create showcase / save settings', async () => {
    const { getByText, getByPlaceholderText } = component;

    const value = 'new name';
    const name = await getByPlaceholderText(/showcase name/i);
    fireEvent.change(name, { target: { value: value } });

    const saveBtn = await getByText(/Create/i);
    fireEvent.click(saveBtn);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

});
