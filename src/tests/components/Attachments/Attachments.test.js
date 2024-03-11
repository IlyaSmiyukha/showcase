import React from 'react';
import Attachments from '@/components/Attachments';
import { render, fireEvent } from '@testing-library/react';

const props = {
  attachments: [{
    name:'test',
    type:'link',
    url:'test.com',
    id:'432f3ae0-215c-4d51-a8ba-db2c03154608',
  }],
  updateAttachments: jest.fn(),
};

describe('Attachments component', () => {
  let component;

  beforeEach(() => {
    component = render(<Attachments {...props} />);
  });

  it('should render Attachments component', async () => {
    const { findByDisplayValue } = component;
    const name = await findByDisplayValue(props.attachments[0].name);
    expect(name).toBeInTheDocument();
  });

  it('should add new Attachment', async () => {
    const { findByText } = component;
    const addItem = await findByText(/add new attachment/i);
    fireEvent.click(addItem);
    const secondItem = await findByText(/attachment 2/i);
    expect(secondItem).toBeInTheDocument();
  });

  it('should delete Attachment', async () => {
    const { findByRole, findByDisplayValue } = component;
    const button = await findByRole('button');
    const name = await findByDisplayValue(props.attachments[0].name);
    expect(name).toBeInTheDocument();
    fireEvent.click(button);
    expect(name).not.toBeInTheDocument();
  });

  it('should change Attachment name', async () => {
    const { getByPlaceholderText } = component;
    const name = await getByPlaceholderText(/attachment title/i);
    fireEvent.change(name, { target: { value: '' } });
    expect(name.value).toBe('');
  });

  it('should change Attachment url', async () => {
    const { getByPlaceholderText } = component;
    const name = await getByPlaceholderText(/attachment url/i);
    fireEvent.change(name, { target: { value: '' } });
    expect(name.value).toBe('');
  });

  it('should change Attachment type', async () => {
    const { getByPlaceholderText } = component;
    const name = await getByPlaceholderText(/attachment type/i);
    fireEvent.change(name, { target: { value: '' } });
    expect(name.value).toBe('');
  });

});
