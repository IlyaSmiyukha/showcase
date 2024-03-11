import categories from '@/store/reducers/categories';
import * as types from '@/store/types/categories';

import {
  revisionFetchInitialData,
  resetRfcData,
  revisionDeleteFile,
} from '@/store/types/revisions';

import {
  createRfc,
} from '@/store/types/rfc';

jest.mock('uuid-random', () => () => 123);

const item = {
  file_id: 1,
  group_path: 'group',
  name: 'item name',
  cardPermissions: []
};

const webItem = {
  file_id: 2,
  group_path: 'group',
  name: 'web item name',
  linkID: 0,
  cardPermissions: []
};

const category = {
  id: 1,
  type: 'showcase-category',
  title: '',
  items: [],
};

describe('Categories reducer', () => {
  let initialState = {};

  beforeEach(() => {
    initialState = {
      categories: [{
        id: '0',
        type: 'showcase-category',
        title: '',
        items: [],
      }],
      fetchedLinkPreview: null,
      cardsEmailsList: []
    };
  });

  it('should return the initial state', () => {
    expect(categories(undefined, initialState)).toEqual(initialState);
  });

  it('should handle revisionFetchInitialData', () => {
    expect(categories(initialState, {
      type: revisionFetchInitialData.SUCCESS,
      result: {
        categories: [category],
      },
    })).toEqual({
      ...initialState,
      categories: [category],
    });
  });

  it('should handle revisionFetchInitialData with empty categories', () => {
    expect(categories(initialState, {
      type: revisionFetchInitialData.SUCCESS,
      result: {
        categories: [],
      },
    })).toEqual(initialState);
  });

  it('should handle createRfc', () => {
    const payload = null;
    expect(categories(initialState, {
      type: createRfc.SUCCESS,
      payload,
    })).toEqual(initialState);
  });

  it('should handle resetRfcData', () => {
    const payload = null;
    expect(categories(initialState, {
      type: resetRfcData.REQUEST,
      payload,
    })).toEqual(initialState);
  });

  it('should handle updateCategoryTitle', () => {
    const payload = {
      category: '0',
      title: 'new title',
    };
    expect(categories(initialState, {
      type: types.updateCategoryTitle.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      categories: [{
        id: '0',
        type: 'showcase-category',
        title: 'new title',
        items: [],
      }],
    });
  });

  it('should handle addNewCategory', () => {
    const payload = {};
    expect(categories(initialState, {
      type: types.addNewCategory.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      categories: [{
        id: '0',
        type: 'showcase-category',
        title: '',
        items: [],
      },
      {
        id:  123,
        type: 'showcase-category',
        title: '',
        items: [],
        caps: true,
      }],
    });
  });


  it('should handle addNewItems add item to the end', () => {
    const payload = {
      category: '0',
      itemsList: [item],
    };
    expect(categories(initialState, {
      type: types.addNewItems.SUCCESS,
      result: payload,
    })).toEqual({
      ...initialState,
      categories: [{
        id: '0',
        type: 'showcase-category',
        title: '',
        items: [item],
      }],
    });
  });

  it('should handle deleteItem add item to the end', () => {
    const payload = {
      position: 0,
      category: '0',
    };
    expect(categories({
      ...initialState,
      categories: [{
        id: '0',
        type: 'showcase-category',
        title: '',
        items: [item],
      }],
    }, {
      type: types.deleteItem.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      categories: [{
        id: '0',
        type: 'showcase-category',
        title: '',
        items: [],
      }],
    });
  });

  it('should handle revisionDeleteFile', () => {
    const payload = 0;
    expect(categories({
      ...initialState,
      categories: [{
        id: '0',
        type: 'showcase-category',
        title: '',
        items: [{
          ...item,
          thumbnail: {
            file_id: 0,
          },
        }],
      }],
    }, {
      type: revisionDeleteFile.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      categories: [{
        id: '0',
        type: 'showcase-category',
        title: '',
        items: [item],
      }],
    });
  });


  it('should handle addWebPage add', () => {
    const payload = {
      categoryId: '0',
      webPage: webItem,
    };
    expect(categories(initialState, {
      type: types.addWebPage.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      categories: [{
        id: '0',
        type: 'showcase-category',
        title: '',
        items: [
          payload.webPage,
        ],
      }],
    });
  });

  it('should handle addWebPage edit', () => {
    const payload = {
      categoryId: '0',
      webPage: {
        ...webItem,
        name: 'new name',
      },
    };
    expect(categories({
      ...initialState,
      categories: [{
        id: '0',
        type: 'showcase-category',
        title: '',
        items: [webItem],
      }],
    }, {
      type: types.addWebPage.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      categories: [{
        id: '0',
        type: 'showcase-category',
        title: '',
        items: [payload.webPage],
      }],
    });
  });

  it('should handle deleteCategory', () => {
    const payload = '0';
    expect(categories(initialState, {
      type: types.deleteCategory.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      categories: [],
    });
  });

  it('should handle editItem', () => {
    const payload = {
      categoryId: '0',
      item: {
        ...item,
        name: 'new item name',
      },
      index: 0,
    };
    expect(categories({
      ...initialState,
      categories: [{
        id: '0',
        type: 'showcase-category',
        title: '',
        items: [item],
      }],
    }, {
      type: types.editItem.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      categories: [{
        id: '0',
        type: 'showcase-category',
        title: '',
        items: [payload.item],
      }],
    });
  });

  it('should handle getWebPagePreviewUrl success', () => {
    const payload = 'newlink.com';
    expect(categories(initialState, {
      type: types.getWebPagePreviewUrl.SUCCESS,
      result: payload,
    })).toEqual({
      ...initialState,
      fetchedLinkPreview: payload,
    });
  });

  it('should handle getWebPagePreviewUrl error', () => {
    const payload = null;
    expect(categories(initialState, {
      type: types.getWebPagePreviewUrl.ERROR,
      payload,
    })).toEqual(initialState);
  });

});
