import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import store from '@/store/store';

import RootContainer from '@/containers/RootContainer';

import {props} from './MockProps';


describe('RootContainer component', () => {
  let component;

  beforeEach(() => {
    component = render(<Provider store={store}>
      <RootContainer {...props} />
    </Provider>);
  });

  it('should render component with state', async () => {
    // const { getByText } = component;
    // const name = await getByText(firstFilter.name);
    // expect(name).toBeInTheDocument();
    // const addItem = await getByText(/add new filter/i);
    // expect(addItem).toBeInTheDocument();
  });


});
