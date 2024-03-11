import {
  createSelector
} from 'reselect';

import {
  getFiles,
} from '@/store/selectors/files';

export const getCategoriesState = createSelector([state => _.get(state, 'categories')], categoriesState => {
  return categoriesState;
});

export const getCategoriesForAnalytics = createSelector([state => _.get(state, 'categories')], categoriesState => {
  return categoriesState.categories.map(category => ({
    items: category.items.map(item => item.card_id).filter(item => !!item),
    title: category.title || 'I\'m a category title',
    id: category.id
  }));
});

export const getCategories = createSelector([getCategoriesState,
  getFiles
], (
  categoriesState,
  files,
) => {
  return categoriesState.categories.map(category => {
    const {
      items = [],
    } = category;

    const fileItems = items.map(item => {
      const fileId = item.type === 'link' ? _.get(item, 'thumbnail.file_id') : item.file_id;
      const file = _.get(files, fileId, {});
      return {
        ...file,
        ...item,
        name: item.name ? item.name : file.name,
        owner_data: {
          ...file.owner_data,
          ...item.owner_data,
        },
        tags: item.tags ? item.tags : [],
        status: file.status,
      };
    });
    if (category.files) {
      delete category.files;
    }

    return {
      ...category,
      items: fileItems,
    };
  });
});

export const getCleanCategories = createSelector([getCategoriesState], (categoriesState) => {
  return categoriesState.categories;
});

export const getCardsInfo = createSelector([getCategoriesState], (categoriesState) => {
  return categoriesState.cards;
});

export const getCardsIds = createSelector([getCategoriesState], (categoriesState) => {
  return Object.keys(categoriesState.cards);
});

export const getCategoriesForShortcuts = createSelector([getCategoriesState], categoriesState => {

  return categoriesState.categories.map(category => {
    const {
      title,
      id,
    } = category;

    return {
      label: title ? title : 'I\'m a category title',
      value: id,
    };
  });
});

export const getFetchedLinkPreview = createSelector([getCategoriesState], (categoriesState) => {
  return categoriesState.fetchedLinkPreview;
});

export const getCardsEmailsList = createSelector([getCategoriesState], (categoriesState) => {
  return categoriesState && categoriesState.cardsEmailsList ? categoriesState.cardsEmailsList.map(email => ({
    label: email,
    value: email
  })) : [];
});
