import view from '@/store/reducers/view';
import * as types from '@/store/types/view';

import {
  resetRfcData,
} from '@/store/types/revisions';

describe('View reducer', () => {
  let initialState = {};

  beforeEach(() => {
    initialState = {
      createPopup: false,
      editPopup: false,
      addFilePopup: false,
      hyperlinksPopup: false,
      buttonPopup: false,
      publishedPopup: false,
      editTextPopup: false,
      publishPopup: false,
      withCaps: false,
      webItemPopup: false,
      editItemPopup: false,
      filtersPopup: false,
      shortcutPopup: false,
      footerMenuPopup: false,
      managePeoplePopup: false,
      someoneEditing: false,
      exportCsvPopup: false,
      restoreRevisionPopup: false,
      changeOwnershipPopup: false,
      deleteCardPopup: false,
      deleteShowcasePopup: false,
      placeholderProps: {
        index: -1,
        category: -1,
      },
      fileInfo: {},
      modalInfo: {},
      analytics: false,
    };
  });

  it('should return the initial state', () => {
    expect(view(undefined, initialState)).toEqual(initialState);
  });


  it('should handle setPlaceholderProps', () => {
    const payload = {
      index: 0,
      category: 0,
    };
    expect(view(initialState, {
      type: types.setPlaceholderProps.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      placeholderProps: payload,
    });
  });

  it('should handle showPopup', () => {
    const payload = {
      type: 'createPopup',
    };
    expect(view(initialState, {
      type: types.showPopup.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      createPopup: true,
    });
  });

  it('should handle hidePopup', () => {
    const payload = {};
    expect(view(initialState, {
      type: types.hidePopup.REQUEST,
      payload,
    })).toEqual(initialState);
  });

  it('should handle hideSpecialPopup', () => {
    const payload = 'createPopup';
    expect(view(initialState, {
      type: types.hideSpecialPopup.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      [payload]: false,
    });
  });

  it('should handle updatePopupInfo', () => {
    const payload = {
      name: 'name',
    };
    expect(view(initialState, {
      type: types.updatePopupInfo.REQUEST,
      payload: {
        modalInfo: {
          ...payload,
        },
      },
    })).toEqual({
      ...initialState,
      modalInfo: {
        ...payload,
      },
    });
  });

  it('should handle showPopup', () => {
    expect(view(initialState, {
      type: resetRfcData.REQUEST,
      payload: {},
    })).toEqual(initialState);
  });

});
