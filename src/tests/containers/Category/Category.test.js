import React from 'react';
import { Provider } from 'react-redux';
import fireEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import store from '@/store/store';

import Category from '@/containers/Category';

import {
  props,
} from './MockProps';

jest.mock('react-beautiful-dnd', () => ({
  Droppable: ({ children }) => children({
    draggableProps: {
      style: {},
    },
    innerRef: jest.fn(),
  }, {}),
  Draggable: ({ children }) => children({
    draggableProps: {
      style: {},
    },
    innerRef: jest.fn(),
  }, {}),
  DragDropContext: ({ children }) => children,
}));

describe('Category component', () => {
  let component;

  beforeEach(() => {
    store.dispatch = jest.fn();
    component = render(<Provider store={store}>
      <Category {...props}/>
    </Provider>);
  });

  it('should render component with state', async () => {
    const { getByText } = component;
    const name = await getByText(/title/i);
    expect(name).toBeInTheDocument();
  });

  it('should open change title modal', async () => {
    const { getByText } = component;
    const title = await getByText(/title/i);
    fireEvent.click(title);
    expect(store.dispatch).toHaveBeenCalledTimes(0);
  });

  it('should open add files modal', async () => {
    const { getByText } = component;
    const dropdown = await getByText(/add items/i);
    fireEvent.click(dropdown);
    const addFiles = await getByText(/add files/i);
    fireEvent.click(addFiles);
    expect(store.dispatch).toHaveBeenCalledTimes(0);
  });

  it('should open add files modal', async () => {
    const { getByText } = component;
    const empryTile = await getByText(/click to add/i);
    fireEvent.click(empryTile);
    expect(store.dispatch).toHaveBeenCalledTimes(0);
  });

  it('should open add link modal', async () => {
    const { getByText } = component;
    const dropdown = await getByText(/add items/i);
    fireEvent.click(dropdown);

    const addFiles = await getByText(/add link/i);
    fireEvent.click(addFiles);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

  it('should delete category', async () => {
    const { getByText, getByTestId } = component;
    const dropdown = await getByTestId('category-dropdown');
    fireEvent.click(dropdown);

    const deleteBtn = await getByText(/delete/i);
    fireEvent.click(deleteBtn);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

  it('should move category up', async () => {
    const { getByText, getByTestId } = component;
    const dropdown = await getByTestId('category-dropdown');
    fireEvent.click(dropdown);

    const deleteBtn = await getByText(/up/i);
    fireEvent.click(deleteBtn);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

  it('should move category down', async () => {
    const { getByText, getByTestId } = component;
    const dropdown = await getByTestId('category-dropdown');
    fireEvent.click(dropdown);

    const deleteBtn = await getByText(/down/i);
    fireEvent.click(deleteBtn);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

});
