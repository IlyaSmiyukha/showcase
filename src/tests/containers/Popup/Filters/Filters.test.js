import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';
const mockStore = configureStore([]);

import { mockProps, mockInitialState } from './MockProps';

import Filters from '@/containers/Popup/Filters';

describe('Filters popup component', () => {
  let component;
  let store;

  beforeEach(() => {
    store = mockStore(mockInitialState);
    component = render(<Provider store={store}>
      <Filters {...mockProps} />
    </Provider>);
  });

  it('should change filter title',  () => {
    const { getByPlaceholderText } = component;
    const value = 'new name';
    const name =  getByPlaceholderText(/type filter name/i);
    fireEvent.change(name, { target: { value: value } });
    expect(name.value).toBe(value);
  });

  it('should change filter item name',  () => {
    const { getByPlaceholderText } = component;
    const value = 'new name';
    const name =  getByPlaceholderText(/type name for/i);
    fireEvent.change(name, { target: { value: value } });
    expect(name.value).toBe(value);
  });

  it('should add new filter item',  () => {
    const { getByText } = component;
    const addNew =  getByText(/add new/i);
    fireEvent.click(addNew);
    const newItem = getByText('Filter item 2');
    expect(newItem).toBeInTheDocument();
  });

  it('should delete item',  () => {
    const { getByText, getByTestId } = component;
    //add new item
    const addNew =  getByText(/add new/i);
    fireEvent.click(addNew);
    const newItem = getByText('Filter item 2');
    expect(newItem).toBeInTheDocument();

    //click delete
    const deleteBtn = getByTestId('delete-1');
    fireEvent.click(deleteBtn);
    expect(newItem).not.toBeInTheDocument();
  });

  it('should handle sort items up',  () => {
    const { getByText, getByTestId } = component;
    //add new item
    const addNew =  getByText(/add new/i);
    fireEvent.click(addNew);
    const newItem = getByText('Filter item 2');

    //click delete
    const sort = getByTestId('sort-up-1');
    fireEvent.click(sort);
    expect(newItem).toBeInTheDocument();
  });

  it('should handle sort items down',  () => {
    const { getByText, getByTestId } = component;
    //add new item
    const addNew =  getByText(/add new/i);
    fireEvent.click(addNew);
    const newItem = getByText('Filter item 2');

    //click delete
    const sort = getByTestId('sort-down-0');
    fireEvent.click(sort);
    expect(newItem).toBeInTheDocument();
  });


  it('should call edit action', () => {
    const { getByText } = component;
    const save = getByText(/save/i);
    fireEvent.click(save);
    const expectedAction = 'FILTERS/ADD_FILTER/REQUEST';
    const actions = store.getActions();
    expect(actions[0].type).toEqual(expectedAction);
  });

  it('should handle name error', () => {
    const { getByText, getByPlaceholderText } = component;

    //put empty name
    const value = '';
    const name =  getByPlaceholderText(/type filter name/i);
    fireEvent.change(name, { target: { value: value } });

    //click save
    const save = getByText(/save/i);
    fireEvent.click(save);

    //errors should be in document
    const errorName = getByText(/fill filter name/i);
    expect(errorName).toBeInTheDocument();

  });

  it('should handle item error', () => {
    const { getByText } = component;

    //add new item
    const addNew =  getByText(/add new/i);
    fireEvent.click(addNew);

    //click save
    const save = getByText(/save/i);
    fireEvent.click(save);

    //errors should be in document
    const errorItem = getByText(/fill all fields/i);
    expect(errorItem).toBeInTheDocument();
  });

});
