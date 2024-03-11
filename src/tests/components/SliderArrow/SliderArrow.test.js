import React from 'react';
import SliderArrow from '@/components/SliderArrow';
import { render } from '@testing-library/react';

import fireEvent from '@testing-library/user-event';

const props = {
  flipped: false,
  onClick: jest.fn(),
  display: true,
};

describe('SliderArrow component', () => {
  let component;

  beforeEach(() => {
    component = render(<SliderArrow {...props}/>);
  });

  it('should render EditorsTable component', async () => {
    const { findByRole } = component;
    const arrow = await findByRole('button');
    expect(arrow).toBeInTheDocument();
  });

  it('should call on click', async () => {
    const { findByRole } = component;
    const arrow = await findByRole('button');
    fireEvent.click(arrow);
    expect(props.onClick).toHaveBeenCalledTimes(1);
  });

});
