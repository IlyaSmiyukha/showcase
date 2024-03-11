import React from 'react';
import Background from '@/components/Background';
import { render } from '@testing-library/react';
const props = {
  addBackgroundClick: jest.fn(),
  background: 'link',
  bgType: 'image',
};

describe('Background component', () => {
  let component;

  beforeEach(() => {
    component = render(<Background {...props}/>);
  });

  it('should render Background component', async () => {
    const { findByRole } = component;
    const img = await findByRole('img');
    expect(img).toBeInTheDocument();
  });

});
