import React from 'react';
import Dropdown from '@/components/Dropdown';
import { render } from '@testing-library/react';
import store from '@/store/store';
import { Provider } from 'react-redux';

import fireEvent from '@testing-library/user-event';

const props = {
  permisionEdit:  jest.fn(),
  activeItem: 'active item',
  itemsList: [
    {
      title: 'item',
      onItemClick:  jest.fn(),
    },
  ],
};

describe('Dropdown component', () => {
  let component;

  beforeEach(() => {
    component = render(<Dropdown {...props}/>);
  });

  it('should render EditorsTable component', async () => {
    const { findByText } = component;
    const text = await findByText(/active item/i);
    expect(text).toBeInTheDocument();
  });

  it('should open dropdown', async () => {
    const { findByText } = component;
    const text = await findByText(/active item/i);
    fireEvent.click(text);
    const dropdownItem = await findByText('item');
    expect(dropdownItem).toBeInTheDocument();
  });

  it('should handle click on item', async () => {
    const { findByText } = component;
    const text = await findByText(/active item/i);
    fireEvent.click(text);
    const dropdownItem = await findByText('item');
    fireEvent.click(dropdownItem);
    expect(props.itemsList[0].onItemClick).toHaveBeenCalledTimes(1);
  });

});
