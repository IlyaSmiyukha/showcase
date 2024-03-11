import React from 'react';
import BackButton from '@/components/BackButton';
import { render } from '@testing-library/react';

import fireEvent from '@testing-library/user-event';

const props = {
  onClick: jest.fn(),
};

describe('BackButton component', () => {
  let component;

  beforeEach(() => {
    component = render(<BackButton {...props}/>);
  });

  it('should render BackButton component', async () => {
    const { findByText } = component;
    const name = await findByText(/go back/i);
    expect(name).toBeInTheDocument();
  });

  it('should handle click BackButton', () => {
    const {container} = component;
    fireEvent.click(container.firstChild);
    expect(props.onClick).toHaveBeenCalledTimes(1);
  });

});
