import React from 'react';
import EditorsTable from '@/components/EditorsTable';
import { render } from '@testing-library/react';
import store from '@/store/store';
import { Provider } from 'react-redux';

import fireEvent from '@testing-library/user-event';

const props = {
  permisionEdit:  jest.fn(),
  editors: [{
    user_id: 1,
    first_name: 'name',
    last_name: 'lastname',
    email: 'lastname@mail.com',
    role: 'editor',
  }],
};

describe('EditorsTable component', () => {
  let component;

  beforeEach(() => {
    component = render(<EditorsTable {...props}/>);
  });

  it('should render EditorsTable component', async () => {
    const { findByText } = component;
    const text = await findByText(/name lastname/i);
    expect(text).toBeInTheDocument();
  });

  it('should handle click EditorsTable permisionEdit', () => {
    const { getByRole } = component;
    const deleteBtn = getByRole('button');
    fireEvent.click(deleteBtn);
    expect(props.permisionEdit).toHaveBeenCalledTimes(1);
  });

});
