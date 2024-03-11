import React from 'react';
import Scrollbar from '@/components/Scrollbar';
import { render } from '@testing-library/react';

import fireEvent from '@testing-library/user-event';

describe('Scrollbar component', () => {
  let component;

  beforeEach(() => {
    component = render(<Scrollbar>test</Scrollbar>);
  });

  it('should render EditorsTable component', async () => {
    const { findByText } = component;
    const test = await findByText('test');
    expect(test).toBeInTheDocument();
  });

});
