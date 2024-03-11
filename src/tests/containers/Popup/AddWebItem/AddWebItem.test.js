import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';
const mockStore = configureStore([]);

import { mockProps, mockInitialState } from './MockProps';

import AddWebItem from '@/containers/Popup/AddWebItem';

describe('AddWebItem popup component', () => {
  let component;
  let store;

  beforeEach(() => {
    store = mockStore(mockInitialState);
    store.dispatch = jest.fn();
    component = render(<Provider store={store}>
      <AddWebItem {...mockProps} />
    </Provider>);
  });


  it('should change card name', async () => {
    const { getByPlaceholderText } = component;
    const value = 'new name';
    const name = await getByPlaceholderText(/type title here/i);
    fireEvent.change(name, { target: { value: value } });
    expect(name.value).toBe(value);
  });

  it('should change card description', async () => {
    const { getByPlaceholderText } = component;
    const value = 'new description';
    const descr = await getByPlaceholderText(/type description here/i);
    fireEvent.change(descr, { target: { value: value } });
    expect(descr.value).toBe(value);
  });

  it('should change card url', async () => {
    const { getByPlaceholderText } = component;
    const value = 'google.com';
    const url = await getByPlaceholderText(/type link url/i);
    fireEvent.change(url, { target: { value: value } });
    expect(url.value).toBe(value);
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
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

  it('should change tags', async () => {
    // const { getByRole, getByText } = component;
    // const tagsInput = await getByRole('combobox');
    // const value = 'new tag';
    // fireEvent.change(tagsInput, { target: { value: value } });
    // const newTag = getByText(value);
    // expect(newTag).toBeInTheDocument();
  });

  it('should change preview file', async () => {
    const { getByText } = component;
    const button = await getByText(/choose preview image/i);
    fireEvent.click(button);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

  it('should update card permissions', async () => {
    const { getByLabelText } = component;
    const permissionRadio = await getByLabelText(/only owner/i);
    fireEvent.change(permissionRadio, { target: { value: 'OnForEditors' } });
    expect(permissionRadio.value).toBe('OnForEditors');
  });

  it('should update published date', async () => {
    const { getByLabelText } = component;
    const date = await getByLabelText(/published date/i);
    const value = '2021-07-23';
    fireEvent.change(date, { target: { value: value } });
    expect(date.value).toBe(value);
  });

  it('should generate preview link', async () => {
    const { getByPlaceholderText, getByText } = component;
    const linkUrl = await getByPlaceholderText(/type link url/i);
    const value = 'google.com';
    fireEvent.change(linkUrl, { target: { value: value } });

    const btnAction = await getByText(/get preview/i);
    fireEvent.click(btnAction);

    expect(store.dispatch).toHaveBeenCalledTimes(2);
  });

  it('should update attachments', async () => {
    const { getByText } = component;
    const addNewAttachment = await getByText(/new attachment/i);
    fireEvent.click(addNewAttachment);

    const newAttachment = getByText(/attachment 1/i);
    expect(newAttachment).toBeInTheDocument();
  });

  it('should call editItem action on save click ', async () => {
    // const { getByText } = component;
    // const button = await getByText(/save/i);
    // fireEvent.click(button);
    // const expectedAction = 'CATEGORY/ADD_WEB_PAGE/REQUEST';
    // const actions = store.getActions();
    // expect(actions[0].type).toEqual(expectedAction);
  });


  it('should handle error on save click ', async () => {
    const { getByText } = component;
    const button = await getByText(/save/i);
    fireEvent.click(button);
    const errorName = await getByText(/please fill item name/i);
    expect(errorName).toBeInTheDocument();
    const errorUrl = await getByText(/please fill item url/i);
    expect(errorUrl).toBeInTheDocument();
  });

});
