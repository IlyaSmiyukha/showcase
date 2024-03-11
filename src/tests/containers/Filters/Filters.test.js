import React from 'react';
import { Provider } from 'react-redux';
import fireEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import store from '@/store/store';

import {
  addFilters,
} from '@/store/actions/filters';

import Filters from '@/containers/Filters';

const firstFilter = {
  name: 'first filter',
  id: 1,
};
const secondFilter = {
  name: 'second filter',
  id: 2,
};


describe('Filters component', () => {
  let component;
  store.dispatch(addFilters({
    filter: firstFilter,
    actionType: 'add',
  }));

  beforeEach(() => {
    component = render(<Provider store={store}>
      <Filters />
    </Provider>);
  });

  it('should render component with state', async () => {
    const { getByText } = component;
    const name = await getByText(firstFilter.name);
    expect(name).toBeInTheDocument();
    const addItem = await getByText(/add new filter/i);
    expect(addItem).toBeInTheDocument();
  });

  it('should call show addNewFilter modal', async () => {
    const {getByText} = component;
    const addItem = await getByText(/add new filter/i);
    fireEvent.click(addItem);
    const state = store.getState();
    expect(state.view.filtersPopup).toBe(true);
  });

  it('should update state on add new filter', async () => {
    store.dispatch(addFilters({
      filter: secondFilter,
      actionType: 'add',
    }));
    const { getByText, rerender } = component;
    rerender(<Provider store={store}>
      <Filters />
    </Provider>);
    const newItem = await getByText(secondFilter.name);
    expect(newItem).toBeInTheDocument();
  });

  it('should update state on reorder filters', () => {

  });

});
