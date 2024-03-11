import configureStore from 'redux-mock-store'; //ES6 modules
import thunk from 'redux-thunk';

import * as actions from '@/store/actions/categories';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initialState = {
  tokenType: 'Bearer',
  accessToken: '',
  group: '',
  organizationId: '',
  viewUrl: '',
  apiUrl: '',
  cardsEmailsList: []
};

describe('Category actions', () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  it('should create an action addNewCategory', () => {
    // Dispatch the action
    store.dispatch(actions.addNewCategory());
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'CATEGORY/ADD_NEW_CATEGORY/REQUEST',
      payload: {},
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action addNewItems', () => {
    // Dispatch the action
    // console.error(actions.addNewItems());
    // store.dispatch(actions.addNewItems(1, []));
    // const dispatchedActions = store.getActions();
    // const expectedPayload = {
    //   type: 'CATEGORY/ADD_NEW_CATEGORY/REQUEST',
    //   payload: {},
    // };
    // expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action deleteCategory', () => {
    // Dispatch the action
    const id = 'id';
    store.dispatch(actions.deleteCategory(id));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'CATEGORY/DELETE_CATEGORY/REQUEST',
      payload: id,
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action updateCategoryTitle', () => {
    // Dispatch the action
    const newData = {
      category: 'category',
      title: 'new title',
      caps: true,
    };
    store.dispatch(actions.updateCategoryTitle(newData.category, newData.title, newData.caps));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'CATEGORY/UPDATE_CATEGORY_TITLE/REQUEST',
      payload: newData,
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action deleteItem', () => {
    // Dispatch the action
    const newData = {
      category: 'category',
      position: 1,
    };
    store.dispatch(actions.deleteItem(newData.category, newData.position));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'CATEGORY/DELETE_ITEM/REQUEST',
      payload: newData,
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action sortCategoriesOnDrop', () => {
    // Dispatch the action
    const newData = {};
    store.dispatch(actions.sortCategoriesOnDrop(newData));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'CATEGORY/SORT_CATEGORIES_ON_DROP/REQUEST',
      payload: newData,
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action sortCategories', () => {
    // Dispatch the action
    const newData = {
      id: 'id',
      moveTo: 0,
    };
    store.dispatch(actions.sortCategories(newData.id, newData.moveTo));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'CATEGORY/SORT_CATEGORIES/REQUEST',
      payload: newData,
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action editItem', () => {
    // Dispatch the action
    const newData = {};
    store.dispatch(actions.editItem(newData));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'CATEGORY/EDIT_ITEM/REQUEST',
      payload: newData,
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action addWebPage', () => {
    // Dispatch the action
    const newData = {
      categoryId: 'categoryId',
      webPage: {
        card_id: 'id',
      },
    };
    store.dispatch(actions.addWebPage(newData));
    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'CATEGORY/ADD_WEB_PAGE/REQUEST',
      payload: newData,
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  // it('should create an action getWebPagePreviewUrl', () => {
  //   // Dispatch the action
  //   const url = 'https://imgurl.com';
  //
  //
  //   store.dispatch(actions.getWebPagePreviewUrl(url)).then(() => {
  //     const dispatchedActions = store.getActions();
  //     console.log(dispatchedActions);
  //   });
  //
  //   const expectedPayload = {
  //     type: 'CATEGORY/ADD_WEB_PAGE/REQUEST',
  //     payload: newData,
  //   };
  //   expect(dispatchedActions).toEqual([expectedPayload]);
  // });

});
