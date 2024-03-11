import React from 'react';
import { Provider } from 'react-redux';
import fireEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import store from '@/store/store';

import ListHeader from '@/containers/Header/ListHeader';

export const props = {
  text: 'showcase title',
  rfcId: '1',
  isPublished: false,
  onCreateShowcaseClick: jest.fn()
};

describe('ListHeader component', () => {
  let component;

  beforeEach(() => {
    component = render(<ListHeader {...props}/>);
  });

  it('should render component with state', async () => {
    const { getByText } = component;
    const name = await getByText(/create/i);
    expect(name).toBeInTheDocument();
  });

  it('should call create showcase action', async () => {
    const { getByText } = component;
    const createBtn = await getByText(/create/i);
    fireEvent.click(createBtn);
    expect(props.onCreateShowcaseClick).toHaveBeenCalledTimes(1);
  });

});
