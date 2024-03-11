import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';
const mockStore = configureStore([]);

import { mockProps, mockInitialState } from './MockProps';

import ExportCsv from '@/containers/Popup/ExportCsv';

describe('ExportCsv popup component', () => {
  let component;
  let store;

  beforeEach(() => {
    store = mockStore(mockInitialState);
    store.dispatch = jest.fn();
    component = render(<Provider store={store}>
      <ExportCsv {...mockProps} />
    </Provider>);
  });

  it('should change email', async () => {
    const { getByPlaceholderText } = component;
    const value = 'test@touchcast.com';
    const name = await getByPlaceholderText(/email/i);
    fireEvent.change(name, { target: { value: value } });
    expect(name.value).toBe(value);
  });

  it('should change period of time', async () => {
    const { getByLabelText } = component;
    const radio = await getByLabelText(/Last 7 days/i);
    fireEvent.click(radio);
    expect(radio.value).toBe('Last 7 days');
  });

  it('should set custom start time', async () => {
    const { getByLabelText } = component;
    const radio = getByLabelText(/custom/i);
    fireEvent.click(radio);

    const start = await getByLabelText(/time from/i);
    const value = '2021-04-12';
    fireEvent.change(start, { target: { value: value } });
    expect(start.value).toBe(value);
  });

  it('should set custom end time', async () => {
    const { getByLabelText } = component;
    const radio = getByLabelText(/custom/i);
    fireEvent.click(radio);

    const start = await getByLabelText(/time to/i);
    const value = '2021-04-12';
    fireEvent.change(start, { target: { value: value } });
    expect(start.value).toBe(value);
  });

  it('should generate report', async () => {
    const { getByText, getByPlaceholderText } = component;

    // change email before call action
    const value = 'test@touchcast.com';
    const name = await getByPlaceholderText(/email/i);
    fireEvent.change(name, { target: { value: value } });

    const button = await getByText(/export csv/i);
    fireEvent.click(button);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

});
