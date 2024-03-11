import React from 'react';
import CardPermissions from '@/components/CardPermissions';
import { render } from '@testing-library/react';

import fireEvent from '@testing-library/user-event';

const props = {
  onTypeChange: jest.fn(),
  onPersonsChange: jest.fn(),
  active: 'OnWithRequest',
  permissions: [],
  showError: true,
};

describe('CardPermissions component', () => {
  let component;

  beforeEach(() => {
    component = render(<CardPermissions {...props}/>);
  });

  it('should render EditorsTable component', async () => {
    const { findByText } = component;
    const text = await findByText(/specific emails can access/i);
    expect(text).toBeInTheDocument();
  });

  it('should change settings type', async () => {
    const { getByLabelText } = component;

    const oneSetting = await getByLabelText(/off/i);
    fireEvent.click(oneSetting);
    expect(oneSetting).toBeChecked();
  });

  it('should change settings type request', async () => {
    const { getByLabelText } = component;

    const oneSetting = await getByLabelText(/on - specific/i);
    fireEvent.click(oneSetting);
    expect(oneSetting).toBeChecked();

    const everyOne = await getByLabelText(/everyone/i);
    fireEvent.click(everyOne);
    expect(everyOne).not.toBeChecked();
  });


  it('should show emails field', async () => {
    const { getByText } = component;
    const newOptions = await getByText(/else can view/i);
    expect(newOptions).toBeInTheDocument();
  });

  it('should show error', async () => {
    const { getByText } = component;
    const newOptions = await getByText(/Add at least one email/i);
    expect(newOptions).toBeInTheDocument();
  });

});
