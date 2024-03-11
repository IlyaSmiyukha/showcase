import React from 'react';
import NoFiles from '@/components/NoFiles';
import { render } from '@testing-library/react';

describe('NoFiles component', () => {
  let component;

  beforeEach(() => {
    component = render(<NoFiles />);
  });

  it('should render NoFiles component', async () => {
    const { findByText } = component;
    const text = await findByText(/There are no files/i);
    expect(text).toBeInTheDocument();
  });

});
