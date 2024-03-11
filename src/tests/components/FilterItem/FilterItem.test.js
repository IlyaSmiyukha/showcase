import React from 'react';
import { render } from '@testing-library/react';
import fireEvent from '@testing-library/user-event';

import FilterItem from '@/components/FilterItem';

const props = {
  filter: {
    name: 'Default name',
    id: 1,
  },
  showFiltersPopup: jest.fn(),
  deleteFilter: jest.fn(),
};

describe('FilterItem component', () => {
  let component;

  beforeEach(() => {
    component = render(<FilterItem {...props} />);
  });

  it('should render FilterItem component', async () => {
    const {findByText} = component;
    const name = await findByText(props.filter.name);
    expect(name).toBeInTheDocument();
  });

  it('should call onClick', () => {
    const {container} = component;
    fireEvent.click(container.firstChild);
    expect(props.showFiltersPopup).toHaveBeenCalledTimes(1);
  });

  it('should call delete item', () => {
    const {getByRole} = component;
    const deleteBtn = getByRole('button');
    fireEvent.click(deleteBtn);
    expect(props.deleteFilter).toHaveBeenCalledTimes(1);
  });
});
