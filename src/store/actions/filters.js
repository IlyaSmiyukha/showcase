import store from '@/store/store';
import * as types from '@/store/types/filters';

export const addFilters = data => {
  return {
    type: types.addFilter.REQUEST,
    payload: data,
  };
};

export const deleteFilter = id => {
  return {
    type: types.deleteFilter.REQUEST,
    payload: id,
  };
};

export const sortFilters = filters => {
  return {
    type: types.sortFilters.REQUEST,
    payload: filters,
  };
};

export const filtersAddTags = tags => {
  return{
    type: types.addTags.REQUEST,
    payload: tags,
  };
};
