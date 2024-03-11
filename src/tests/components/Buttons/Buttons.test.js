import React from 'react';
import {ButtonNormal} from '@/components/Buttons';
import { render } from '@testing-library/react';

import fireEvent from '@testing-library/user-event';

const props = {
  onClick: jest.fn(),
};

describe('Buttons component', () => {
  let component;

  beforeEach(() => {
    component = render(<ButtonNormal {...props}>click me</ButtonNormal>);
  });

  it('should render BackButton component', async () => {
    const { findByText } = component;
    const name = await findByText(/click me/i);
    expect(name).toBeInTheDocument();
  });

  it('should handle click BackButton', () => {
    const {container} = component;
    fireEvent.click(container.firstChild);
    expect(props.onClick).toHaveBeenCalledTimes(1);
  });

});
