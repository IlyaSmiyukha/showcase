import { createThunkRoutine } from 'redux-thunk-routine';

export const addNewCategory = createThunkRoutine('CATEGORY/ADD_NEW_CATEGORY');
export const deleteCategory = createThunkRoutine('CATEGORY/DELETE_CATEGORY');
export const addNewItems = createThunkRoutine('CATEGORY/ADD_NEW_ITEMS');
export const deleteItem = createThunkRoutine('CATEGORY/DELETE_ITEM');
export const updateCategoryTitle = createThunkRoutine('CATEGORY/UPDATE_CATEGORY_TITLE');
export const sortCategoriesOnDrop = createThunkRoutine('CATEGORY/SORT_CATEGORIES_ON_DROP');
export const addWebPage = createThunkRoutine('CATEGORY/ADD_WEB_PAGE');
export const getWebPagePreviewUrl = createThunkRoutine('CATEGORY/GET_WEB_PAGE_PREVIEW');

export const editItem = createThunkRoutine('CATEGORY/EDIT_ITEM');
