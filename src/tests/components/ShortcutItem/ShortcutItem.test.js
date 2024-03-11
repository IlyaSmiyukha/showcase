import React from 'react';
import ShortcutItem from '@/components/ShortcutItem';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);
const mockInitialState = {
  files: {
    files: {
      id: {
        file_id: 'id',
        status: 'uploading',
      },
    },
    uploadingState: {
      id: 10,
    },
    processingState: {
      id: 10,
    },
  },
};

import fireEvent from '@testing-library/user-event';

const props = {
  shortcut: {
    id: '1',
    name: 'name',
  },
  uploadingState: {
    id: 50,
  },
  processingState: {},
};

describe('ShortcutItem component', () => {
  let component;
  let store;

  beforeEach(() => {
    store = mockStore(mockInitialState);
    component = render(<Provider store={store}>
      <ShortcutItem {...props}/>
    </Provider>);
  });

  it('should render EditorsTable component', async () => {
    const { findByText } = component;
    // store.dispatch = jest.fn();
    const text = await findByText(/name/i);
    expect(text).toBeInTheDocument();
  });

  it('should handle edit item', () => {
    const { getByTestId } = component;
    const edit = getByTestId('edit');
    fireEvent.click(edit);
    const expectedAction = 'POPUP/SHOW/REQUEST';
    const actions = store.getActions();
    expect(actions[0].type).toEqual(expectedAction);
  });

  it('should handle delete item', () => {
    const { getByRole } = component;
    const edit = getByRole('button');
    fireEvent.click(edit);
    const expectedAction = 'SHORTCUTS/DELETE_ITEM/REQUEST';
    const actions = store.getActions();
    expect(actions[0].type).toEqual(expectedAction);
  });

  it('should handle uploading status', () => {
    const newProps = {
      ...props,
      shortcut: {
        ...props.shortcut,
        thumbnail: {
          file_id: 'id',
        },
      },
    };

    const { getByText } = render(<Provider store={store}>
      <ShortcutItem {...newProps}/>
    </Provider>);
    const text = getByText('file uploading');
    expect(text).toBeInTheDocument();
  });
});
