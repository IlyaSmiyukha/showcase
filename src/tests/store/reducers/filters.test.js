import filters from '@/store/reducers/filters';
import * as types from '@/store/types/filters';


const newFilters = [{
  name: 'Cost Reduction',
  tags: [
    'Cost Reduction',
  ],
  id: 1,
},
{
  name: 'Cost Reduction',
  tags: [
    'Cost Reduction',
  ],
  id: 2,
}];

const newState = {
  'search-placeholder': 'Search...',
  type: 'showcase-filters-and-search',
  id: 3,
  'filter-items': newFilters,
};

const tags = ['tag1',
  'tag2',
  'tag3'];

describe('Filters reducer', () => {
  let initialState = {};

  beforeEach(() => {
    initialState = {
      searchPlaceholder: 'Search...',
      type: 'showcase-filters-and-search',
      id: 3,
      allTagsList: [],
      filterItems: [],
    };
  });

  it('should return the initial state', () => {
    expect(filters(undefined, initialState)).toEqual(initialState);
  });

  it('should handle getInitialData', () => {
    expect(filters(initialState, {
      type: types.getInitialData.REQUEST,
      payload: {
        tags,
        filters: newState,
      },
    })).toEqual({
      searchPlaceholder: 'Search...',
      type: 'showcase-filters-and-search',
      id: 3,
      allTagsList: tags,
      filterItems: newState['filter-items'],
    });
  });

  it('should handle addFilter add part', () => {
    expect(filters(initialState, {
      type: types.addFilter.REQUEST,
      payload: {
        actionType: 'add',
        filter: newFilters[0],
      },
    })).toEqual({
      ...initialState,
      filterItems: [newFilters[0]],
    });
  });

  it('should handle addFilter edit part', () => {
    const updatedFilter = {
      ...newFilters[0],
      name: 'new name',
    };
    expect(filters({
      ...initialState,
      filterItems: newFilters,
    }, {
      type: types.addFilter.REQUEST,
      payload: {
        actionType: 'edit',
        filter: updatedFilter,
      },
    })).toEqual({
      ...initialState,
      filterItems: newFilters.map(filter => filter.id === 1 ? updatedFilter : filter),
    });
  });

  it('should handle deleteFilter', () => {
    expect(filters({
      ...initialState,
      filterItems: newFilters,
    }, {
      type: types.deleteFilter.REQUEST,
      payload: 1,
    })).toEqual({
      ...initialState,
      filterItems: [newFilters[1]],
    });
  });

  it('should handle sortFilters', () => {
    expect(filters(initialState, {
      type: types.sortFilters.REQUEST,
      payload: newFilters,
    })).toEqual({
      ...initialState,
      filterItems: newFilters,
    });
  });

  it('should handle addTags', () => {
    expect(filters(initialState, {
      type: types.addTags.REQUEST,
      payload: tags,
    })).toEqual({
      ...initialState,
      allTagsList: tags,
    });
  });
});
