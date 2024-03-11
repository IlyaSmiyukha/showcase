import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';
const mockStore = configureStore([]);

import { mockProps, mockInitialState } from './MockProps';

import AddButton from '@/containers/Popup/AddButton';

describe('Add button popup component', () => {
  let component;
  let store;

  beforeEach(() => {
    store = mockStore(mockInitialState);
    component = render(<Provider store={store}>
      <AddButton {...mockProps} />
    </Provider>);
  });

  it('should change button name',  () => {
    const { getByPlaceholderText } = component;
    const value = 'new name';
    const name =  getByPlaceholderText(/type button name/i);
    fireEvent.change(name, { target: { value: value } });
    expect(name.value).toBe(value);
  });

  it('should change button action type', () => {

  });

  it('should change attached file', () => {

  });

  it('should change attached link',  () => {
    const { getByPlaceholderText } = component;
    const value = 'https://new-site.com';
    const url =  getByPlaceholderText(/type button url/i);
    fireEvent.change(url, { target: { value: value } });
    expect(url.value).toBe(value);
  });

  it('should handle errors',  () => {
    const { getByText } = component;
    const saveBtn =  getByText(/save/i);
    fireEvent.click(saveBtn);
    const errorName = getByText(/fill button name/i);
    const errorUrl = getByText(/fill button url/i);
    expect(errorName).toBeInTheDocument();
    expect(errorUrl).toBeInTheDocument();
  });

  it('should call save button action', () => {
    //change btn name and url before action
    const { getByPlaceholderText, getByText } = component;
    const newName = 'new name';
    const name =  getByPlaceholderText(/type button name/i);
    fireEvent.change(name, { target: { value: newName } });

    const newUrl = 'new name';
    const url =  getByPlaceholderText(/type button url/i);
    fireEvent.change(url, { target: { value: newUrl } });

    //fire action
    const saveBtn =  getByText(/save/i);
    fireEvent.click(saveBtn);
    const expectedAction = 'HEADER/UPDATE_BUTTON/REQUEST';
    const actions = store.getActions();
    expect(actions[0].type).toEqual(expectedAction);
  });

  it('should call delete button action', () => {
    //change btn name before action
    const { getByPlaceholderText, getByText } = component;
    const value = 'new name';
    const name =  getByPlaceholderText(/type button name/i);
    fireEvent.change(name, { target: { value: value } });

    //fire action
    const deleteBtn =  getByText(/remove button/i);
    fireEvent.click(deleteBtn);
    const expectedAction = 'HEADER/UPDATE_BUTTON/REQUEST';
    const actions = store.getActions();
    expect(actions[0].type).toEqual(expectedAction);
  });

});
