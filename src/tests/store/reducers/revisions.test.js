import revisions from '@/store/reducers/revisions';
import * as types from '@/store/types/revisions';
import * as footerTypes from '@/store/types/footer';
import * as headerTypes from '@/store/types/header';
import * as categoriesTypes from '@/store/types/categories';

import {
  createRfc,
} from '@/store/types/rfc';

import {
  addFilter,
  deleteFilter,
  sortFilters,
} from '@/store/types/filters';

import {
  addShortcut,
  editShortcut,
  deleteShortcut,
} from '@/store/types/shortcuts';

jest.mock('moment', () => () => ({unix: () => 1627564075}));
Date.now = jest.fn(() => 1487076708000)
describe('Shortcuts reducer', () => {
  let initialState = {};
  beforeEach(() => {
    initialState = {
      rfcData: {
        name: '',
        organization_url: '',
      },
      settings: {
        // playerArticleComments: false,
        playerArticleText: false,
        personSettings: false,
        showSearch: false,
        showFilters: false,
        hideCardTitle: false,
        hideCardType: false,
        showShortcuts: false,
        showFollow: false,
        externalPreviewImageForLinks: false,
        startScreenAdvanced: false,
        startScreenAuthor: false,
        enableIndexing: false,
        showCardPublishedDate: false,
        showShareControl: false,
        showLikes: false,
        fieldsLimits: {}
      },
      lastSaved: null,
      isLoaded: false,
      updating: false,
      publishing: false,
      reverting: false,
      getting: false,
      error: false,
      showSkeleton: true,
      firstLoad: false,
      published: {},
      currentRfcID: null,
      fetchedLinkPreview: null,
      revisionsList: [],
    };
  });

  it('should return the initial state', () => {
    expect(revisions(undefined, initialState)).toEqual(initialState);
  });

  it('should handle resetRfcData', () => {
    const payload = null;
    expect(revisions(initialState, {
      type: types.resetRfcData.REQUEST,
      payload,
    })).toEqual(initialState);
  });

  it('should handle setCurrentRfcID', () => {
    const payload = 1;
    expect(revisions(initialState, {
      type: types.setCurrentRfcID.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      currentRfcID: 1,
    });
  });

  it('should handle createRfc', () => {
    const payload = null;
    expect(revisions(initialState, {
      type: createRfc.SUCCESS,
      payload,
    })).toEqual(initialState);
  });

  it('should handle revisionUpdate', () => {
    const payload = {
      revision_id: 1,
    };
    expect(revisions(initialState, {
      type: types.revisionUpdate.SUCCESS,
      result: payload,
    })).toEqual({
      ...initialState,
      rfcData: {
        ...initialState.rfcData,
        updated: 1627564075,
      },
      revisionId: 1,
      lastSaved: 1627564075,
      revisionsList:[{
        revision_id: 1,
        type: "draft",
        updated: 1487076708,
        user_id: undefined,
      }]
    });
  });

  it('should handle revisionUnpublish', () => {
    const payload = null;
    expect(revisions(initialState, {
      type: types.revisionUnpublish.SUCCESS,
      result: payload,
    })).toEqual({
      ...initialState,
    });
  });

  it('should handle revisionUpdate FAILURE', () => {
    const payload = 'error';
    expect(revisions(initialState, {
      type: types.revisionUpdate.FAILURE,
      result: payload,
    })).toEqual({
      ...initialState,
      error: true,
    });
  });

  it('should handle revisionPublish REQUEST', () => {
    const payload = null;
    expect(revisions(initialState, {
      type: types.revisionPublish.REQUEST,
      result: payload,
    })).toEqual({
      ...initialState,
      publishing: true,
    });
  });

  it('should handle revisionPublish SUCCESS', () => {
    const payload = {};
    expect(revisions(initialState, {
      type: types.revisionPublish.SUCCESS,
      result: payload,
    })).toEqual({
      ...initialState,
      error: false,
      published: {
        updated: null,
      },
    });
  });

  it('should handle revisionPublish FAILURE', () => {
    const payload = 'error';
    expect(revisions(initialState, {
      type: types.revisionPublish.FAILURE,
      result: payload,
    })).toEqual({
      ...initialState,
      error: true,
      lastSaved: 1627564075,
      rfcData:  {
        ...initialState.rfcData,
        updated: 1627564075,
      },
    });
  });

  it('should handle revisionFetchInitialData REQUEST', () => {
    expect(revisions(initialState, {
      type: types.revisionFetchInitialData.REQUEST,
      result: null,
    })).toEqual({
      ...initialState,
      showSkeleton: true,
    });
  });

  it('should handle revisionFetchInitialData REQUEST', () => {
    const payload = {
      rfcData: {
        rfc_id: 1,
      },
      data: {},
      published: {},
      revisionId: 1,
      revisionsList: [{id: 1}],
      firstLoad: true,
    };
    expect(revisions({
      ...initialState,
      currentRfcID: 1,
    }, {
      type: types.revisionFetchInitialData.REQUEST,
      result: payload,
    })).toEqual({
      ...initialState,
      published: {},
      currentRfcID: 1,
    });
  });

  it('should handle revisionFetchInitialData FAILURE', () => {
    expect(revisions(initialState, {
      type: types.revisionFetchInitialData.FAILURE,
      result: null,
    })).toEqual({
      ...initialState,
      showSkeleton: false,
    });
  });

  it('should handle updateSettings', () => {
    const payload = {
      settings: {
        playerArticleText: true,
        personSettings: true,
        showSearch: true,
        showFilters: true,
        hideCardTitle: true,
        hideCardType: true,
        showShortcuts: true,
        showFollow: true,
        externalPreviewImageForLinks: true,
        startScreenAdvanced: true,
        startScreenAuthor: true,
        enableIndexing: true,
        showCardPublishedDate: true,
        showShareControl: true,
        showShareLikes: true,
        fieldsLimits: {}
      },
      isEditMode: true,
    };
    expect(revisions(initialState, {
      type: types.updateSettings.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      settings: payload.settings,
      rfcData: {
        ...initialState.rfcData,
        updated: 1627564075,
      },
    });
  });

  it('should handle updateRfc', () => {
    const payload = {
      name: 'new name',
      url: 'google.com',
    };
    expect(revisions(initialState, {
      type: types.updateRfc.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      rfcData: {
        ...initialState.rfcData,
        updated: 1627564075,
        name: 'new name',
        organization_url: 'google.com',
      },
    });
  });

  it('should handle addFilter', () => {
    const payload = null;
    expect(revisions(initialState, {
      type: addFilter.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      rfcData: {
        ...initialState.rfcData,
        updated: 1627564075,
      },
    });
  });

  it('should handle addShortcut', () => {
    const payload = null;
    expect(revisions(initialState, {
      type: addShortcut.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      rfcData: {
        ...initialState.rfcData,
        updated: 1627564075,
      },
    });
  });

  it('should handle editShortcut', () => {
    const payload = null;
    expect(revisions(initialState, {
      type: editShortcut.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      rfcData: {
        ...initialState.rfcData,
        updated: 1627564075,
      },
    });
  });

  it('should handle deleteShortcut', () => {
    const payload = null;
    expect(revisions(initialState, {
      type: deleteShortcut.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      rfcData: {
        ...initialState.rfcData,
        updated: 1627564075,
      },
    });
  });

  it('should handle deleteFilter', () => {
    const payload = null;
    expect(revisions(initialState, {
      type: deleteFilter.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      rfcData: {
        ...initialState.rfcData,
        updated: 1627564075,
      },
    });
  });

  it('should handle sortFilters', () => {
    const payload = null;
    expect(revisions(initialState, {
      type: sortFilters.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      rfcData: {
        ...initialState.rfcData,
        updated: 1627564075,
      },
    });
  });

  it('should handle editFooterMenu', () => {
    const payload = null;
    expect(revisions(initialState, {
      type: footerTypes.editFooterMenu.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      rfcData: {
        ...initialState.rfcData,
        updated: 1627564075,
      },
    });
  });

  it('should handle deleteFooterMenu', () => {
    const payload = null;
    expect(revisions(initialState, {
      type: footerTypes.deleteFooterMenu.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      rfcData: {
        ...initialState.rfcData,
        updated: 1627564075,
      },
    });
  });

  it('should handle updateFooterLogo', () => {
    const payload = null;
    expect(revisions(initialState, {
      type: footerTypes.updateFooterLogo.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      rfcData: {
        ...initialState.rfcData,
        updated: 1627564075,
      },
    });
  });

  it('should handle updateHeaderLogo', () => {
    const payload = null;
    expect(revisions(initialState, {
      type: headerTypes.updateHeaderLogo.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      rfcData: {
        ...initialState.rfcData,
        updated: 1627564075,
      },
    });
  });

  it('should handle updateBackground', () => {
    const payload = null;
    expect(revisions(initialState, {
      type: headerTypes.updateBackground.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      rfcData: {
        ...initialState.rfcData,
        updated: 1627564075,
      },
    });
  });

  it('should handle updateHyperlinks', () => {
    const payload = null;
    expect(revisions(initialState, {
      type: headerTypes.updateHyperlinks.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      rfcData: {
        ...initialState.rfcData,
        updated: 1627564075,
      },
    });
  });

  it('should handle updateButton', () => {
    const payload = null;
    expect(revisions(initialState, {
      type: headerTypes.updateButton.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      rfcData: {
        ...initialState.rfcData,
        updated: 1627564075,
      },
    });
  });

  it('should handle addNewCategory', () => {
    const payload = null;
    expect(revisions(initialState, {
      type: categoriesTypes.addNewCategory.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      rfcData: {
        ...initialState.rfcData,
        updated: 1627564075,
      },
    });
  });


  it('should handle deleteCategory', () => {
    const payload = null;
    expect(revisions(initialState, {
      type: categoriesTypes.deleteCategory.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      rfcData: {
        ...initialState.rfcData,
        updated: 1627564075,
      },
    });
  });

  it('should handle addNewItems', () => {
    const payload = null;
    expect(revisions(initialState, {
      type: categoriesTypes.addNewItems.SUCCESS,
      payload,
    })).toEqual({
      ...initialState,
      rfcData: {
        ...initialState.rfcData,
        updated: 1627564075,
      },
    });
  });

  it('should handle deleteItem', () => {
    const payload = null;
    expect(revisions(initialState, {
      type: categoriesTypes.deleteItem.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      rfcData: {
        ...initialState.rfcData,
        updated: 1627564075,
      },
    });
  });

  it('should handle updateCategoryTitle', () => {
    const payload = null;
    expect(revisions(initialState, {
      type: categoriesTypes.updateCategoryTitle.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      rfcData: {
        ...initialState.rfcData,
        updated: 1627564075,
      },
    });
  });

  it('should handle sortCategoriesOnDrop', () => {
    const payload = null;
    expect(revisions(initialState, {
      type: categoriesTypes.sortCategoriesOnDrop.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      rfcData: {
        ...initialState.rfcData,
        updated: 1627564075,
      },
    });
  });

  it('should handle addWebPage', () => {
    const payload = null;
    expect(revisions(initialState, {
      type: categoriesTypes.addWebPage.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      rfcData: {
        ...initialState.rfcData,
        updated: 1627564075,
      },
    });
  });

  it('should handle editItem', () => {
    const payload = null;
    expect(revisions(initialState, {
      type: categoriesTypes.editItem.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      rfcData: {
        ...initialState.rfcData,
        updated: 1627564075,
      },
    });
  });


});
