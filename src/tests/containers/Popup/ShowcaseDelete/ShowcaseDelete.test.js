import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import store from '@/store/store';

import { mockProps } from './MockProps';

import ShowcaseDelete from '@/containers/Popup/ShowcaseDelete';

describe('ShowcaseDelete popup component', () => {
  let component;

  beforeEach(() => {
    store.dispatch = jest.fn();
    component = render(<Provider store={store}>
      <ShowcaseDelete {...mockProps}/>
    </Provider>);
  });


  it('should call delete action', () => {
    const { getByText } = component;
    const deleteBtn = getByText('Delete');
    fireEvent.click(deleteBtn);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

});
