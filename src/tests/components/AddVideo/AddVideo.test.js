import React from 'react';
import AddVideo from '@/components/AddVideo';
import { render } from '@testing-library/react';

import fireEvent from '@testing-library/user-event';

const props = {
  onClick: jest.fn(),
  category: 'category',
};

describe('AddVideo component', () => {
  let component;

  beforeEach(() => {
    component = render(<AddVideo {...props}/>);
  });

  it('should render AddVideo component', async () => {
    const { findByText } = component;
    const name = await findByText(/click to add/i);
    expect(name).toBeInTheDocument();
  });

  it('should handle click AddVideo', () => {
    const {container} = component;
    fireEvent.click(container.firstChild);
    expect(props.onClick).toHaveBeenCalledTimes(1);
  });

});
