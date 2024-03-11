import React from 'react';
import AddBackground from '@/components/AddBackground';
import { render } from '@testing-library/react';

describe('AddBAckground component', () => {

  it('should render AddBackground component', async () => {
    const { findByText } = render(<AddBackground />);
    const name = await findByText(/add a background/i);
    expect(name).toBeInTheDocument();
  });

});
