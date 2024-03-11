import React from 'react';
import {HSeparator, VSeparator} from '@/components/Separators';
import { render } from '@testing-library/react';

describe('Separators component', () => {

  it('should render HSeparator component', async () => {
    const { findByRole } = render(<HSeparator />);
    const hSeparator = await findByRole('separator');
    expect(hSeparator).toBeInTheDocument();
  });

  it('should render HSeparator component', async () => {
    const { findByRole } = render(<VSeparator />);
    const vSeparator = await findByRole('separator');
    expect(vSeparator).toBeInTheDocument();
  });

});
