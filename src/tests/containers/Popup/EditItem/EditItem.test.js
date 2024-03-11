import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';
const mockStore = configureStore([]);

import { mockProps, mockInitialState } from './MockProps';

import EditItem from '@/containers/Popup/EditItem';

describe('EditItem popup component', () => {
  let component;
  let store;

  beforeEach(() => {
    store = mockStore(mockInitialState);
    component = render(<Provider store={store}>
      <EditItem {...mockProps} />
    </Provider>);
  });

  it('should change card name', async () => {
    const { getByPlaceholderText } = component;
    const value = 'new name';
    const name = await getByPlaceholderText(/type title here/i);
    fireEvent.change(name, { target: { value: value } });
    expect(name.value).toBe(value);
  });

  it('should change button name', async () => {
    const { getByPlaceholderText } = component;
    const value = 'new button label';
    const name = await getByPlaceholderText(/text button label/i);
    fireEvent.change(name, { target: { value: value } });
    expect(name.value).toBe(value);
  });

  it('should change persons name', async () => {
    const { getByPlaceholderText } = component;
    const value = 'new person name';
    const name = await getByPlaceholderText(/Type person name here/i);
    fireEvent.change(name, { target: { value: value } });
    expect(name.value).toBe(value);
  });

  it('should change persons description', async () => {
    const { getByPlaceholderText } = component;
    const value = 'new person description';
    const description = await getByPlaceholderText(/Type person description here/i);
    fireEvent.change(description, { target: { value: value } });
    expect(description.value).toBe(value);
  });

  it('should change persons image', async () => {
    const { getByText } = component;
    const button = await getByText(/choose person image/i);
    fireEvent.click(button);
    const expectedAction = 'POPUP/SHOW/REQUEST';
    const actions = store.getActions();
    expect(actions[0].type).toEqual(expectedAction);
  });

  it('should change tags', async () => {
    // const { getByRole, getByText } = component;
    // const tagsInput = await getByRole('combobox');
    // const value = 'new tag';
    // fireEvent.change(tagsInput, { target: { value: value } });
    // const newTag = getByText(value);
    // expect(newTag).toBeInTheDocument();
  });

  it('should change attached file', async () => {
    const { getByText } = component;
    const button = await getByText(/change file/i);
    fireEvent.click(button);
    const expectedAction = 'POPUP/SHOW/REQUEST';
    const actions = store.getActions();
    expect(actions[0].type).toEqual(expectedAction);
  });

  it('should change preview file', async () => {
    const { getByText } = component;
    const button = await getByText(/choose preview image/i);
    fireEvent.click(button);
    const expectedAction = 'POPUP/SHOW/REQUEST';
    const actions = store.getActions();
    expect(actions[0].type).toEqual(expectedAction);
  });

  it('should update card permissions', async () => {
    const { getByLabelText } = component;
    const permissionRadio = await getByLabelText(/only owner/i);
    fireEvent.change(permissionRadio, { target: { value: 'OnForEditors' } });
    expect(permissionRadio.value).toBe('OnForEditors');
  });

  it('should call editItem action on save click ', async () => {
    const { getByText } = component;
    const button = await getByText(/save/i);
    fireEvent.click(button);
    const expectedAction = 'CATEGORY/EDIT_ITEM/REQUEST';
    const actions = store.getActions();
    expect(actions[0].type).toEqual(expectedAction);
  });


  it('should handle error on save click ', async () => {
    const { getByText } = component;
    const addItem = await getByText(/add new attachment/i);
    fireEvent.click(addItem);
    const button = await getByText(/save/i);
    fireEvent.click(button);
    const error = await getByText(/please fill attachments/i);
    expect(error).toBeInTheDocument();
  });

});
