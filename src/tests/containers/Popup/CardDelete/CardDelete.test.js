import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';
const mockStore = configureStore([]);

import { mockProps, mockInitialState } from './MockProps';

import CardDelete from '@/containers/Popup/CardDelete';

describe('CardDelete popup component', () => {
  let component;
  let store;

  beforeEach(() => {
    store = mockStore(mockInitialState);
    component = render(<Provider store={store}>
      <CardDelete {...mockProps} />
    </Provider>);
  });


  it('should call delete action', () => {
    const { getByText } = component;
    const deleteBtn = getByText('Delete');
    fireEvent.click(deleteBtn);
    const expectedAction = 'CATEGORY/DELETE_ITEM/REQUEST';
    const actions = store.getActions();
    expect(actions[0].type).toEqual(expectedAction);
  });

});
