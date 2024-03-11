import React from 'react';
import Loader from '@/components/Loader';
import { render } from '@testing-library/react';
const props = {
  addBackgroundClick: jest.fn(),
  background: 'link',
  bgType: 'image',
};

describe('Loader component', () => {
  let component;

  beforeEach(() => {
    component = render(<Loader {...props}/>);
  });

  it('should render Background component', async () => {
    const { findByRole } = component;
    const img = await findByRole('progressbar');
    expect(img).toBeInTheDocument();
  });

});
