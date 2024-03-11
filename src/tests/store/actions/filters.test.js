import configureStore from 'redux-mock-store'; //ES6 modules

import * as actions from '@/store/actions/filters';

const middlewares = [];
const mockStore = configureStore(middlewares);

const initialState = {
  searchPlaceholder: 'Search...',
  type: 'showcase-filters-and-search',
  id: 3,
  allTagsList: [],
  filterItems: [],
};

describe('Filters actions', () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  it('should create an action addFilter', () => {
    // Dispatch the action
    const newFilter = {
      filter: {
        name: 'new name',
        id: Date.now(),
      },
      type: 'add',
    };

    store.dispatch(actions.addFilters(newFilter));

    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'FILTERS/ADD_FILTER/REQUEST',
      payload: newFilter,
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action deleteFilter', () => {
    // Dispatch the action
    const id = Date.now();

    store.dispatch(actions.deleteFilter(id));

    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'FILTERS/DELETE_FILTER/REQUEST',
      payload: id,
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action sortFilters', () => {
    // Dispatch the action
    const filters = [
      {
        name: 'Filter 1',
        id: Date.now(),
      },
      {
        name: 'Filter 2',
        id: Date.now(),
      },
    ];

    store.dispatch(actions.sortFilters(filters));

    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'FILTERS/SORT_FILTERS/REQUEST',
      payload: filters,
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

  it('should create an action filtersAddTags', () => {
    // Dispatch the action
    const tags = ['tag1',
      'tag2',
      'tag3'];

    store.dispatch(actions.filtersAddTags(tags));

    const dispatchedActions = store.getActions();
    const expectedPayload = {
      type: 'FILTERS/ADD_TAGS/REQUEST',
      payload: tags,
    };
    expect(dispatchedActions).toEqual([expectedPayload]);
  });

});
