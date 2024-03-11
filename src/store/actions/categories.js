import store from '@/store/store';
import * as types from '@/store/types/categories';
import uuid from 'uuid-random';

import {
  getFiles,
} from '@/store/selectors/files';

import {
  fetchUrls,
} from '@/store/actions/files';

import {
  fetchFilesList,
} from '@/store/actions/revisions';

export const addNewItems = (
  category,
  itemsList,
  position,
  group,
  rfcId,
) => {
  return {
    routine: types.addNewItems,
    promise: client => new Promise(async (resolve, reject) => {
      try {
        const filesFormStore = getFiles(store.getState());
        const filesList = itemsList.filter(item => !filesFormStore[item] || !filesFormStore[item].type).map(item => item);
        let files = [];

        resolve({
          category,
          itemsList: itemsList.map(item => ({
            file_id: item,
            group_path: group,
            name: '',
            buttonName: '',
            owner_data: {
              personName: '',
              personDescr: '',
            },
            tags: [],
            attachments: [],
            card_id:  '',
            cardPermissionsType: 'Off',
            cardPermissions:  [],
            description: '',
            card_id: uuid(),
            created: Date.now(),
            published: Date.now(),
          })),
          position,
          files,
        });


      } catch (error) {
        reject(error);
      }
    }),
  };
};

export const addNewCategory = (category) => {
  return {
    type: types.addNewCategory.REQUEST,
    payload: category,
  };
};

export const deleteCategory = id => {
  return {
    type: types.deleteCategory.REQUEST,
    payload: id,
  };
};

export const updateCategoryTitle = (
  category,
  title,
  caps,
) => {
  return store.dispatch({
    type: types.updateCategoryTitle.REQUEST,
    payload: {
      category,
      title,
      caps,
    },
  });
};

export const sortCategoriesOnDrop = payload => {
  return store.dispatch({
    type: types.sortCategoriesOnDrop.REQUEST,
    payload,
  });
};

export const deleteItem = (
  category,
  cardId,
  index
) => {
  return {
    type: types.deleteItem.REQUEST,
    payload: {
      category,
      cardId,
      index
    },
  };
};

export const addWebPage = ({categoryId, webPage}) => {
  return{
    type: types.addWebPage.REQUEST,
    payload: {
      categoryId,
      webPage: {
        ...webPage,
        card_id: webPage.card_id ? webPage.card_id : uuid(),
      }},
  };
};

export const editItem = data => {
  return{
    type: types.editItem.REQUEST,
    payload: data,
  };
};

export const getWebPagePreviewUrl = url => {
  return {
    routine: types.getWebPagePreviewUrl,
    promise: client => new Promise(async (resolve, reject) => {
      try {

        if (url) {
          const {urls} = await client.post('/utils/fetch-preview-images', {
            url,
          });
          resolve(urls[0]);
        }

        resolve('');

      } catch (error) {
        reject(error);
      }
    }),
  };
};
