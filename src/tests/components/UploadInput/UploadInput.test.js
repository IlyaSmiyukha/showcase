import React from 'react';
import UploadInput from '@/components/UploadInput';
import { render, fireEvent } from '@testing-library/react';
import store from '@/store/store';
import { Provider } from 'react-redux';

const props = {
  acceptType: ['image'],
  group: 'group',
  folderId: '1',
};

describe('UploadInput component', () => {
  let component;

  beforeEach(() => {
    store.dispatch = jest.fn();
    component = render(<Provider store={store}>
      <UploadInput {...props}>Upload media</UploadInput>
    </Provider>);
  });

  it('should render EditorsTable component', async () => {
    const { findByText } = component;
    const text = await findByText(/Upload media/i);
    expect(text).toBeInTheDocument();
  });

  it('should handle input change', () => {
    const { getByLabelText } = component;
    const upload = getByLabelText('Upload media');
    const file = new File(['(⌐□_□)'], 'chucknorris.png', {
      type: 'image/png',
    });
    fireEvent.change(upload, { target: { files: [file] } });
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

});
