import React from 'react';
import { Provider } from 'react-redux';
import fireEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import store from '@/store/store';

import SingleItem from '@/containers/SingleItem';

import {props} from './MockProps';

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

describe('SingleItem component', () => {
  let component;

  beforeEach(() => {
    store.dispatch = jest.fn();
    component = render(<Provider store={store}>
      <SingleItem {...props}/>
    </Provider>);
  });

  it('should render component with state', async () => {
    const { getByText } = component;
    const name = await getByText(/category title/i);
    expect(name).toBeInTheDocument();
  });


  it('should add new category', async () => {
    const { getByText } = component;
    const button = await getByText(/new category/i);
    fireEvent.click(button);
    expect(store.dispatch).toHaveBeenCalledTimes(2);
  });

  it('should open add file modal', async () => {
    const { getByText } = component;
    const button = await getByText(/add a file/i);
    fireEvent.click(button);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

});
