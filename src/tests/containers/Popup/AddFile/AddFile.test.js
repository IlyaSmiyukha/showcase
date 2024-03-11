import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';
const mockStore = configureStore([]);

import { mockProps, mockInitialState } from './MockProps';

import AddFile from '@/containers/Popup/AddFile';

describe('AddFile popup component', () => {
  let component;
  let store;

  beforeEach(() => {
    store = mockStore(mockInitialState);
    store.dispatch = jest.fn();
    component = render(<Provider store={store}>
      <AddFile {...mockProps} />
    </Provider>);
  });

  it('should switch tabs', () => {
    const { getByText } = component;
    const sharedTab = getByText(/shared with/i);
    fireEvent.click(sharedTab);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

  it('should select file', () => {
    const { getByText, getByTestId } = component;
    const file = getByText(/why not/i);
    fireEvent.click(file);

    const addBtn = getByTestId('add-file');
    expect(addBtn).not.toBeDisabled();
  });

  it('should select folder', () => {
    const { getByText, getByTestId } = component;
    const folder = getByText('Test folder');
    fireEvent.click(folder);

    const addBtn = getByTestId('add-file');
    expect(addBtn).not.toBeDisabled();
  });

  it('should select folder for shared tab', () => {
    const { getByText, getByTestId } = component;
    //change tab
    const sharedTab = getByText(/shared with/i);
    fireEvent.click(sharedTab);

    //click file
    const folder = getByText('Test folder');
    fireEvent.click(folder);

    const addBtn = getByTestId('add-file');
    expect(addBtn).not.toBeDisabled();
  });

  it('should go inside the folder for mine files', () => {
    const { getByText } = component;
    //click file
    const folder = getByText('Test folder');
    fireEvent(folder, new MouseEvent('dblclick', {
      bubbles: true,
      cancelable: true,
    }));
    const goBack = getByText(/go back/i);
    expect(goBack).toBeInTheDocument();
  });

  it('should go inside the folder for shared files', () => {
    const { getByText } = component;
    //go to shared tab
    const sharedTab = getByText(/shared with/i);
    fireEvent.click(sharedTab);

    //click file
    const folder = getByText('Test folder');
    fireEvent(folder, new MouseEvent('dblclick', {
      bubbles: true,
      cancelable: true,
    }));

    //check go back btn
    const goBack = getByText(/go back/i);
    expect(goBack).toBeInTheDocument();
  });

  it('should go out of the folder', () => {
    const { getByText } = component;
    //click folder
    const folder = getByText('Test folder');
    fireEvent(folder, new MouseEvent('dblclick', {
      bubbles: true,
      cancelable: true,
    }));
    const goBack = getByText(/go back/i);
    expect(goBack).toBeInTheDocument();
    // click go back
    fireEvent.click(goBack);
    expect(goBack).not.toBeInTheDocument();
  });

  it('should change search filed', () => {
    const { getByPlaceholderText } = component;
    const value = 'new';
    const search = getByPlaceholderText(/type to search/i);
    fireEvent.change(search, { target: { value: value } });
    expect(search.value).toBe(value);
  });

  it('should clear search', () => {
    const { getByPlaceholderText } = component;
    //fill search
    const value = 'new';
    const search = getByPlaceholderText(/type to search/i);
    fireEvent.change(search, { target: { value: value } });
    //clear search
    fireEvent.change(search, { target: { value: '' } });
    expect(search.value).toBe('');
  });

  it('should clear search on tab change', () => {
    const { getByPlaceholderText, getByText } = component;
    //fill search
    const value = 'new';
    const search = getByPlaceholderText(/type to search/i);
    fireEvent.change(search, { target: { value: value } });

    //click tab
    const sharedTab = getByText(/shared with/i);
    fireEvent.click(sharedTab);
    expect(search.value).toBe('');
  });

  it('should search my files', () => {
    const { getByPlaceholderText } = component;
    //fill search
    const value = 'new';
    const search = getByPlaceholderText(/type to search/i);
    fireEvent.change(search, { target: { value: value } });
    fireEvent.keyDown(search, { key: 'Enter', keyCode: 13 });
    expect(store.dispatch).toHaveBeenCalledTimes(2);
  });

  it('should search shared files', () => {
    const { getByPlaceholderText, getByText } = component;
    //click tab
    const sharedTab = getByText(/shared with/i);
    fireEvent.click(sharedTab);
    //fill search
    const value = 'new';
    const search = getByPlaceholderText(/type to search/i);
    fireEvent.change(search, { target: { value: value } });
    fireEvent.keyDown(search, { key: 'Enter', keyCode: 13 });
    expect(store.dispatch).toHaveBeenCalledTimes(2);
  });

  it('should clear search on esc onItemClick', () => {
    const { getByPlaceholderText, getByText } = component;
    //click tab
    const sharedTab = getByText(/shared with/i);
    fireEvent.click(sharedTab);
    //fill search
    const value = 'new';
    const search = getByPlaceholderText(/type to search/i);
    fireEvent.change(search, { target: { value: value } });
    fireEvent.keyDown(search, { key: 'Esc', keyCode: 27 });

    expect(search.value).toBe('');
  });

  it('should add file', () => {
    const { getByText, getByTestId } = component;
    //select file
    const file = getByText(/why not/i);
    fireEvent.click(file);
    //click btn
    const addBtn = getByTestId('add-file');
    fireEvent.click(addBtn);
    expect(mockProps.addNewItems).toHaveBeenCalledTimes(1);
  });


  it('should close modal', () => {
    const { getByText } = component;
    const cancelBtn = getByText(/cancel/i);
    fireEvent.click(cancelBtn);
    expect(store.dispatch).toHaveBeenCalledTimes(2);
  });
});
