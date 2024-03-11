import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';
const mockStore = configureStore([]);

import { mockProps, mockInitialState } from './MockProps';

import AddHyperlinks from '@/containers/Popup/AddHyperlinks';

describe('AddHyperlinks popup component', () => {
  let component;
  let store;

  beforeEach(() => {
    store = mockStore(mockInitialState);
    component = render(<Provider store={store}>
      <AddHyperlinks {...mockProps} />
    </Provider>);
  });

  it('should change link name',  () => {
    const { getByPlaceholderText } = component;
    const value = 'new name';
    const name =  getByPlaceholderText(/type link name/i);
    fireEvent.change(name, { target: { value: value } });
    expect(name.value).toBe(value);
  });


  it('should change link url',  () => {
    const { getByPlaceholderText } = component;
    const value = 'newurl.com';
    const url =  getByPlaceholderText(/type link url/i);
    fireEvent.change(url, { target: { value: value } });
    expect(url.value).toBe(value);
  });

  it('should add new link',  () => {
    const { getByTestId, getByText } = component;
    const addBtn =  getByTestId('add-btn');
    fireEvent.click(addBtn);
    const newElement = getByText(/link 2/i);
    expect(newElement).toBeInTheDocument();
  });

  it('should delete link',  () => {
    const { getByTestId, getByText } = component;
    const addBtn =  getByTestId('add-btn');
    fireEvent.click(addBtn);

    const newElement = getByText(/link 2/i);
    expect(newElement).toBeInTheDocument();

    const deleteBtn = getByTestId('delete-1');
    fireEvent.click(deleteBtn);
    expect(newElement).not.toBeInTheDocument();
  });

  it('should sort link u[] ',  () => {
    const { getByTestId, getByText } = component;
    const addBtn =  getByTestId('add-btn');
    fireEvent.click(addBtn);

    const newElement = getByText(/link 2/i);
    expect(newElement).toBeInTheDocument();

    const sortUp = getByTestId('sort-up-1');
    fireEvent.click(sortUp);
    expect(newElement).toBeInTheDocument();
  });

  it('should sort link down ',  () => {
    const { getByTestId, getByText } = component;
    const addBtn =  getByTestId('add-btn');
    fireEvent.click(addBtn);

    const newElement = getByText(/link 2/i);
    expect(newElement).toBeInTheDocument();

    const sortUp = getByTestId('sort-down-0');
    fireEvent.click(sortUp);
    expect(newElement).toBeInTheDocument();
  });

  it('should handle erros',  () => {
    const { getByText } = component;
    const saveBtn =  getByText(/save/i);
    fireEvent.click(saveBtn);
    const error = getByText(/please fill all/i);
    expect(error).toBeInTheDocument();
  });

  it('should call save button action', () => {
    //change btn name and url before action
    const { getByPlaceholderText, getByText } = component;
    const newName = 'new name';
    const name =  getByPlaceholderText(/type link name/i);
    fireEvent.change(name, { target: { value: newName } });

    const newUrl = 'newurl.com';
    const url =  getByPlaceholderText(/type link url/i);
    fireEvent.change(url, { target: { value: newUrl } });

    //fire action
    const saveBtn =  getByText(/save/i);
    fireEvent.click(saveBtn);
    const expectedAction = 'HEADER/UPDATE_HYPERLINKS/REQUEST';
    const actions = store.getActions();
    expect(actions[0].type).toEqual(expectedAction);
  });


});
