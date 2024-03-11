import React from 'react';
import EditorItemText from '@/components/EditorItemText';
import { render, screen } from '@testing-library/react';
import store from '@/store/store';
import { Provider } from 'react-redux';

import fireEvent from '@testing-library/user-event';

const props = {
  onItemClick:  jest.fn(),
  itemType: 'footer.text',
  itemText: 'click me',
};

describe('EditorItemText component', () => {
  let component;

  beforeEach(() => {
    store.dispatch = jest.fn();
    component = render(<Provider store={store}>
      <EditorItemText {...props}/>
    </Provider>);
  });

  it('should render EditorItemText component', async () => {
    const { findByText } = component;
    const text = await findByText(/click me/i);
    expect(text).toBeInTheDocument();
  });

  it('should render EditorItemText component for empty button', async () => {
    const btnProps = {
      ...props,
      itemType: 'button',
      itemText: '',
    };
    const {getByText} = render(<Provider store={store}>
      <EditorItemText {...btnProps}/>
    </Provider>);
    const text = await getByText('Click here to add a button');
    expect(text).toBeInTheDocument();
  });

  it('should handle click EditorItemText onItemClick', () => {
    const { container } = component;
    fireEvent.click(container.firstChild);
    expect(props.onItemClick).toHaveBeenCalledTimes(0);
  });

  it('should handle click EditorItemText without props', () => {
    const btnProps = {
      ...props,
      onItemClick: null,
    };
    const {container} = render(<Provider store={store}>
      <EditorItemText {...btnProps}/>
    </Provider>);
    fireEvent.click(container.firstChild);
    expect(store.dispatch).toHaveBeenCalledTimes(0);
  });
});
