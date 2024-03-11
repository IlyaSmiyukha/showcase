import React from 'react';
import AddItem from '@/components/AddItem';
import { render } from '@testing-library/react';
import fireEvent from '@testing-library/user-event';

const props = {
  text: 'Add new item',
  onClick: jest.fn(),
};

describe('AddItem component', () => {

  it('should render AddItem component', async () => {
    const { findByText } = render(<AddItem {...props}/>);
    const name = await findByText(props.text);
    expect(name).toBeInTheDocument();
  });

  it('should call onClick', () => {
    const { container } = render(<AddItem {...props}/>);
    expect(props.onClick.mock.calls.length).toBe(0);
    fireEvent.click(container.firstChild);
    expect(props.onClick.mock.calls.length).toBe(1);
  });

});
