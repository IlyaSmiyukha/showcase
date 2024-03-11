import React from 'react';
import PublishedDate from '@/components/FileTile/Parts/PublishedDate';
import { render } from '@testing-library/react';

describe('PublishedDate component', () => {
  it('should render PublishedDate', async () => {
    const { findByText } = render(<PublishedDate timestamp={1630505960193}/>); ;
    const date = await findByText('September 1, 2021 - 5:19 PM');
    expect(date).toBeInTheDocument();
  });
});
