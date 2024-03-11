import React from 'react';
import InputFile from '@/components/InputFile';
import { render } from '@testing-library/react';
import fireEvent from '@testing-library/user-event';

const props = {
  buttonName: 'Button name',
  fileName: 'File name',
  onClick: jest.fn(),
};

describe('InputFile component', () => {

  it('should render InputFile component', async () => {
    const { findByText } = render(<InputFile {...props}/>);
    const name = await findByText(props.fileName);
    expect(name).toBeInTheDocument();
  });

  it('should call onClick', async () => {
    const { findByText } = render(<InputFile {...props}/>);
    expect(props.onClick.mock.calls.length).toBe(0);
    const button = await findByText(props.buttonName);
    fireEvent.click(button);
    expect(props.onClick.mock.calls.length).toBe(1);
  });

});
