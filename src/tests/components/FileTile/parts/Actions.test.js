import React from 'react';
import Actions from '@/components/FileTile/Parts/Actions';
import { render, fireEvent } from '@testing-library/react';

import { mineFile } from '@/tests/__mocks/fileMocks';

const props = {
  file: mineFile,
  editItem: jest.fn(),
};

describe('Actions component', () => {
  it('should render type=file Actions', async () => {
    const { findByText } = render(<Actions {...props}/>); ;
    const btnName = await findByText('Download file');
    expect(btnName).toBeInTheDocument();
  });

  it('should render type=video Actions', async () => {
    props['fileType'] = 'video';
    const { findByText } = render(<Actions {...props}/>); ;
    const btnName = await findByText('Watch video');
    expect(btnName).toBeInTheDocument();
  });

  it('should render type=video Actions', async () => {
    props['fileType'] = 'pdf';
    const { findByText } = render(<Actions {...props}/>); ;
    const btnName = await findByText('View PDF');
    expect(btnName).toBeInTheDocument();
  });

  it('should render type=video Actions', async () => {
    props['fileType'] = 'link';
    const { findByText } = render(<Actions {...props}/>); ;
    const btnName = await findByText('Open link');
    expect(btnName).toBeInTheDocument();
  });

  it('should render type=video Actions', async () => {
    props['fileType'] = 'audio';
    const { findByText } = render(<Actions {...props}/>); ;
    const btnName = await findByText('Listen audio');
    expect(btnName).toBeInTheDocument();
  });

  it('should handle click', async () => {
    const { findByRole } = render(<Actions {...props}/>); ;
    const btn = await findByRole('button');
    fireEvent.click(btn);
    expect(props.editItem).toHaveBeenCalledTimes(1);
  });
});
