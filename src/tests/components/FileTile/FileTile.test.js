import React from 'react';
import FileTile from '@/components/FileTile';
import { render } from '@testing-library/react';

const fileTitle = '#Because Why not';

import {mockProps} from './MockProps';

describe('FileTile component', () => {
  let component;

  beforeEach(() => {
    component = render(<FileTile {...mockProps}/>);
  });

  it('should render FileTile component', async () => {
    const { findByText } = component;
    const title = await findByText(fileTitle);
    expect(title).toBeInTheDocument();
  });

});
