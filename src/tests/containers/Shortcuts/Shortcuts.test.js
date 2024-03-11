import React from 'react';
import { Provider } from 'react-redux';
import fireEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import store from '@/store/store';

import Shortcuts from '@/containers/Shortcuts';

import {
  addShortcut,
} from '@/store/actions/shortcuts';

export const props = {
  uploadingState: {},
  processingState: {},
};


describe('Shortcuts component', () => {
  let component;

  beforeEach(() => {
    store.dispatch(addShortcut({
      name: 'qwer',
      id: 1,
    }));
    store.dispatch = jest.fn();
    component = render(<Provider store={store}>
      <Shortcuts {...props}/>
    </Provider>);
  });

  it('should render component with state', async () => {
    const { getByText } = component;
    const name = await getByText(/new shortcut/i);
    expect(name).toBeInTheDocument();
  });


  it('should open shortcut modal', async () => {
    const { getByText } = component;
    const newItem = await getByText(/new shortcut/i);
    fireEvent.click(newItem);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

});
