import React from 'react';
import { Provider } from 'react-redux';
import fireEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import store from '@/store/store';
import {updateButton} from '@/store/actions/header';

import Header from '@/containers/Header';

export const props = {
  text: 'showcase title',
  rfcId: '1',
  isPublished: false,
};

describe('Header component', () => {
  let component;

  beforeEach(() => {
    store.dispatch(updateButton({
      group_path: 'group',
      action: 'open_video',
      label: 'label',
      fileId:  '123',
    }));
    store.dispatch = jest.fn();
    component = render(<Provider store={store}>
      <Header {...props}/>
    </Provider>);
  });

  it('should render component with state', async () => {
    const { getByText } = component;
    const name = await getByText(props.text);
    expect(name).toBeInTheDocument();
  });

  it('should handle publish showcase', async () => {
    const { getByText } = component;
    const publish = await getByText(/publish/i);
    fireEvent.click(publish);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

  it('should open preview', async () => {
    const { getByText } = component;
    const publish = await getByText(/preview/i);
    fireEvent.click(publish);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

  // dropdown cases
  it('should open settings modal', async () => {
    const { getByText, findByTestId } = component;
    //open dropdown
    const dropdown = await findByTestId(/dropdown/i);
    fireEvent.click(dropdown);
    //click menu item
    const settings = await getByText(/settings/i);
    fireEvent.click(settings);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

  it('should open export csv modal', async () => {
    const { getByText, findByTestId } = component;
    //open dropdown
    const dropdown = await findByTestId(/dropdown/i);
    fireEvent.click(dropdown);
    //click menu item
    const exportCsv = await getByText(/Export/i);
    fireEvent.click(exportCsv);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

  it('should open change owner modal', async () => {
    const { getByText, findByTestId } = component;
    //open dropdown
    const dropdown = await findByTestId(/dropdown/i);
    fireEvent.click(dropdown);
    //click menu item
    const change = await getByText(/change owner/i);
    fireEvent.click(change);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

  it('should open managePeople modal', async () => {
    const { findByTestId } = component;
    const managePeople = await findByTestId(/managePeople/i);
    fireEvent.click(managePeople);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

  it('should open managePeople modal', async () => {
    const { findByTestId } = component;
    const showAnalytics = await findByTestId(/showAnalytics/i);
    fireEvent.click(showAnalytics);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

});
