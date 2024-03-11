import * as types from '@/store/types/categories';
import _ from 'lodash';
import uuid from 'uuid-random';

import {
  revisionFetchInitialData,
  resetRfcData,
  revisionDeleteFile,
} from '@/store/types/revisions';

import {
  createRfc,
} from '@/store/types/rfc';

import {
  sortRows,
} from '@/store/types/layout';

const initialState = {
  categories: [{
    id: '0',
    type: 'showcase-category',
    title: '',
    items: [],
  }],
  fetchedLinkPreview: null,
  cardsEmailsList: [],
  cards: {}
};

export default function revisions(state = initialState, action) {
  switch (action.type) {
    case types.sortCategoriesOnDrop.REQUEST: {
      const {
        startPos,
        endPos,
        startCategory,
        endCategory,
      } = action.payload;

      const {
        categories,
      } = state;
      const {
        items: startCategoryData = [],
      } = categories.find(block => block.id === startCategory) || {};
      const {
        items: endCategoryData = [],
      } = categories.find(block => block.id === endCategory) || {};
      const fileId = startCategoryData[startPos] || null;
      startCategoryData.splice(startPos, 1);
      if (endPos === -1) {
        endCategoryData.push(fileId);
      } else {
        endCategoryData.splice(endPos, 0, fileId);
      }


      return {
        ...state,
        categories: [...categories],
      };
    }

    case types.deleteItem.REQUEST: {
      const {
        index,
        category,
        cardId
      } = action.payload;
      const {
        categories,
      } = state;

      const cards = {...state.cards}
      const result = categories.find(item => item.id === category);

      result && result.items && result.items.splice(index, 1);
      delete cards[cardId]

      return {
        ...state,
        categories: [...categories],
        cards
      };
    }

    case revisionFetchInitialData.SUCCESS:
    {
      const {
        categories,
        cards
      } = action.result;
      let cardsEmailsList = []
      if (categories.length) {
         cardsEmailsList = categories.reduce((acc, category) => {
          const {items} = category;
          items.forEach(item => {
            if (item.cardPermissions && item.cardPermissions.length) {
              acc = [...acc, ...item.cardPermissions]
            }
          })
          return acc
        }, [])
      }
      return categories.length ? {
        ...state,
        categories: categories,
        cardsEmailsList: _.uniq(cardsEmailsList),
        cards
      } : state
    }

    case types.updateCategoryTitle.REQUEST:
    {
      const {
        category,
        title,
        caps,
      } = action.payload;

      return {
        ...state,
        categories: [...state.categories.map(block => {
          if (block && block.id === category) {
            return {
              ...block,
              title,
              caps,
            };
          }
          return block;
        })],
      };
    }

    case types.addNewCategory.REQUEST:
    {
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };
    }

    case types.deleteCategory.REQUEST:
      const cards = {...state.cards};
      const currentCategory = state.categories.find(category => category.id === action.payload);
      currentCategory.items.forEach((card, i) => {
        delete cards[card.card_id]
      });

      {
        return {
          ...state,
          categories: [...state.categories.filter(category => category.id !== action.payload)],
          cards,
        };
      }

    case types.addNewItems.SUCCESS:
    {
      const {
        category = null,
        itemsList = [],
        position,
      } = action.result;

      const {
        categories,
      } = state;

      const items = [...categories.find(item => item.id === category).items];

      if (position === -1 || typeof position !== 'number') {
        items.unshift(...itemsList);
      } else {
        items.splice(position, 0, ...itemsList);
      }

      const newCards = _.keyBy(itemsList, 'card_id');

      return {
        ...state,
        categories: state.categories.map(item => ({
          ...item,
          items: item.id === category ? items : item.items
        })),
        cards: {
          ...state.cards,
          ...newCards
        }
      };
    }


    case revisionDeleteFile.REQUEST:
    {
      const categories = state.categories.map(category => {
        const items = category.items.filter(item => item.file_id !== action.payload).map(item => {
          if (_.get(item, 'thumbnail.file_id') === action.payload) {
            delete item.thumbnail;
          }
          return item;
        });
        return {
          ...category,
          items,
        };
      });
      return {
        ...state,
        categories,
      };
    }

    case types.addWebPage.REQUEST:
    {
      const {
        categoryId = null,
        webPage,
      } = action.payload;

      const {
        categories,
      } = state;

      let selectedCategory = categories.find(category => category.id === categoryId) || {};

      const {
        items = [],
      } = selectedCategory || {};


      if (items.find(item => item.linkID  === webPage.linkID)) {
        selectedCategory.items = items.map(item => {
          return item.linkID === webPage.linkID ? webPage : item;
        });
      } else {
        items.unshift(webPage);
      }

      return {
        ...state,
        categories: [...categories],
        fetchedLinkPreview: null,
        cardsEmailsList: _.uniq([...state.cardsEmailsList, ...webPage.cardPermissions]),
        cards: {
          ...state.cards,
          [webPage.card_id]: webPage
        }
      };
    }

    case types.editItem.REQUEST: {
      const {
        categoryId = null,
        item,
        index,
      } = action.payload;

      const {
        categories,
      } = state;

      let selectedCategory = categories.find(category => category.id === categoryId) || {};

      const {
        items = [],
      } = selectedCategory || {};

      selectedCategory.items = items.map((categoryItem, i) => {
        return i === index ? item : categoryItem;
      });

      return {
        ...state,
        categories: [...categories],
        cardsEmailsList: _.uniq([...state.cardsEmailsList, ...item.cardPermissions])
      };
    }

    case types.getWebPagePreviewUrl.SUCCESS: {
      return {
        ...state,
        fetchedLinkPreview: action.result,
      };
    }

    case types.getWebPagePreviewUrl.ERROR: {
      return {
        ...state,
        fetchedLinkPreview: null,
      };
    }

    case sortRows.SUCCESS: {
      const { categoriesIds, moveTo, moveCategoriesCount } = action.payload;
      const categories = [...state.categories];
      const elements = categories.filter(item => categoriesIds.includes(item.id));
      const indexOfCat = categories.indexOf(elements[0])
      categories.splice(indexOfCat, elements.length);
      console.error(categories);
      categories.splice(moveTo < 0 ? indexOfCat - moveCategoriesCount : indexOfCat + moveCategoriesCount, 0, ...elements);
      return {
        ...state,
        categories
      };
    }


    case createRfc.SUCCESS:
    case resetRfcData.REQUEST:
      return initialState;


    default: {
      return state;
    }
  }
}
