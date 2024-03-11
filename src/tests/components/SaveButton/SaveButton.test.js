import React from 'react';
import SaveButton from '@/components/SaveButton';
import { render } from '@testing-library/react';

import fireEvent from '@testing-library/user-event';

const props = {
  setSaveClick: jest.fn(),
  onSaveClick: jest.fn(),
  isSaved: false,
};

describe('SaveButton component', () => {
  let component;

  beforeEach(() => {
    component = render(<SaveButton {...props}/>);
  });

  it('should render SaveButton component active', async () => {
    const { findByText } = component;
    const text = await findByText(/save/i);
    expect(text).toBeInTheDocument();
  });

  it('should render SaveButton component disabled', async () => {
    const newProps = {
      ...props,
      isSaved: true,
    };
    const { findByText } = render(<SaveButton {...newProps}/>);
    const text = await findByText(/save/i);
    expect(text).toBeInTheDocument();
  });

  it('should call handleSaveClick', async () => {
    const { container, findByTestId } = component;
    fireEvent.click(container.firstChild);
    const animation = await findByTestId('animation');
    expect(animation).toBeInTheDocument();
  });

});
