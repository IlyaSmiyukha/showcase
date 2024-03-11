import React from 'react';
import EmptyList from '@/components/EmptyList';
import { render } from '@testing-library/react';

import fireEvent from '@testing-library/user-event';

const props = {
  onClick: jest.fn(),
  listType: 'my-showcases',
};

describe('EmptyList component', () => {
  let component;

  beforeEach(() => {
    component = render(<EmptyList {...props}/>);
  });

  it('should render EmptyList component', async () => {
    const { findByText } = component;
    const name = await findByText(/You have no showcases./i);
    expect(name).toBeInTheDocument();
  });

  it('should handle click EmptyList', async () => {
    const { findByText } = component;
    const btn =  await findByText(/Create showcase/i);
    fireEvent.click(btn);
    expect(props.onClick).toHaveBeenCalledTimes(1);
  });

});
