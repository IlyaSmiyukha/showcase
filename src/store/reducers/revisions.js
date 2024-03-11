import * as types from '@/store/types/revisions';
import * as footerTypes from '@/store/types/footer';
import * as headerTypes from '@/store/types/header';
import * as categoriesTypes from '@/store/types/categories';

import _ from 'lodash';
import moment from 'moment';

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
import {
  sortRows  
} from '@/store/types/layout';

const getInitialState = () => ({
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
    preventCopyOfArticleText: false,
    showLikes: false,
    fieldsLimits: {},
    downloadArticle: false,
    downloadInMoreButton: false
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
});

export default function revisions(state = getInitialState(), action) {
  switch (action.type) {
    case types.resetRfcData.REQUEST: {
      const newState = getInitialState();
      return newState;
    }

    case types.setCurrentRfcID.REQUEST: {
      return {
        ...state,
        currentRfcID: action.payload,
      };
    }

    case createRfc.SUCCESS:
      const {
        data,
      } = getInitialState();

      return {
        ...state,
        data,
      };

    case types.revisionUpdate.SUCCESS:
    {
      const updated = moment().unix();
      return {
        ...state,
        rfcData: {
          ...state.rfcData,
          updated,
        },
        revisionId: action.result.revision_id,
        lastSaved: updated,
        revisionsList: state.revisionsList.find(revision => revision.revision_id === action.result.revision_id) ?
                      state.revisionsList.map(revision => revision.revision_id === action.result.revision_id ? {
                        ...revision,
                        updated: Date.now() / 1000
                      } : revision) : [{
                        revision_id:action.result.revision_id,
                        updated: Date.now() / 1000,
                        user_id: state.rfcData.user_id,
                        type: "draft"
                      }, ...state.revisionsList]
      };
    }

    case types.revisionUnpublish.SUCCESS:
    {
      return {
        ...state,
        published: {},
        revisionsList: state.revisionsList.map(revision => revision.type === 'published' ? {
          ...revision,
          type: 'revision',
        } : revision),
        error: false,
      };
    }

    case types.revisionUpdate.FAILURE:
      return {
        ...state,
        error: true,
      };

    case types.revisionPublish.REQUEST:
      return {
        ...state,
        publishing: true,
        error: false,
      };

    case types.revisionPublish.SUCCESS: {
      const {
        revision_id: revisionId,
        draft_revision_id: draftRevisionId
      } = action.result;

      const {
        rfcData: {
          updated = null,
        } = {},
        published,
      } = state;

      const revisionsList = [...state.revisionsList].map(revision => {
        let updatedRevision = revision;
        if (revision.type === 'published') {
          updatedRevision['type'] = 'revision';
        }

        if (revision.revision_id === revisionId ) {
          updatedRevision['type'] = 'published';
          updatedRevision['updated'] = Date.now() / 1000
        }
        return updatedRevision;
      });


      return {
        ...state,
        publishing: false,
        published: {
          ...published,
          updated,
        },
        lastSaved: updated,
        error: false,
        revisionsList: [
          ...revisionsList,
          {
            revisionId: draftRevisionId,
            type: 'draft',
            updated: Date.now() / 1000
          }
        ]
      };
    }

    case types.revisionPublish.FAILURE:
      const updated = moment().unix();
      return {
        ...state,
        publishing: false,
        error: true,
        rfcData: {
          ...state.rfcData,
          updated,
        },
        lastSaved: updated,
      };


    case types.revisionFetchInitialData.REQUEST:
      return {
        ...state,
        showSkeleton: true,
      };

    case types.revisionFetchInitialData.SUCCESS:
    {
      const {
        rfcData,
        data,
        published,
        revisionId,
        revisions,
        firstLoad,
      } = action.result;
      return state.currentRfcID === rfcData.rfc_id ?  {
        ...state,
        rfcData: {
          ...rfcData,
        },
        lastSaved: rfcData.updated,
        published,

        showSkeleton: false,
        revisionId,
        settings: {
          // playerArticleComments:  _.get(data, 'rfc_settings.playerArticleComments', initialState.settings.playerArticleComments),
          enableIndexing: !!_.get(rfcData, 'enable_search_indexing', state.settings.enableIndexing),
          playerArticleText: _.get(data, 'rfc_settings.playerArticleText', state.settings.playerArticleText),
          personSettings: _.get(data, 'rfc_settings.personSettings', state.settings.personSettings),
          showSearch: _.get(data, 'rfc_settings.showSearch', state.settings.showSearch),
          showFilters: _.get(data, 'rfc_settings.showFilters', state.settings.showFilters),
          hideCardTitle: _.get(data, 'rfc_settings.hideCardTitle', state.settings.hideCardTitle),
          hideCardType: _.get(data, 'rfc_settings.hideCardType', state.settings.hideCardType),
          showShortcuts: _.get(data, 'rfc_settings.showShortcuts', state.settings.showShortcuts),
          showFollow: _.get(data, 'rfc_settings.showFollow', state.settings.showFollow),
          externalPreviewImageForLinks: _.get(data, 'rfc_settings.externalPreviewImageForLinks', state.settings.externalPreviewImageForLinks),
          startScreenAdvanced: _.get(data, 'rfc_settings.startScreenAdvanced', state.settings.startScreenAdvanced),
          startScreenAuthor: _.get(data, 'rfc_settings.startScreenAuthor', state.settings.startScreenAuthor),
          showCardPublishedDate: _.get(data, 'rfc_settings.showCardPublishedDate', state.settings.showCardPublishedDate),
          showShareControl: _.get(data, 'rfc_settings.showShareControl', state.settings.showShareControl),
          fieldsLimits: _.get(data, 'rfc_settings.fieldsLimits', state.settings.fieldsLimits),
          preventCopyOfArticleText: _.get(data, 'rfc_settings.preventCopyOfArticleText', state.settings.preventCopyOfArticleText),
          showLikes: _.get(data, 'rfc_settings.showLikes', state.settings.showLikes),
          downloadArticle: _.get(data, 'rfc_settings.downloadArticle', state.settings.downloadArticle),
          downloadInMoreButton: _.get(data, 'rfc_settings.downloadInMoreButton', state.settings.downloadArticle),
        },
        isLoaded: true,
        revisionsList: revisions,
        firstLoad,
      } : state;
    }

    case types.revisionFetchInitialData.FAILURE:
      return {
        ...state,
        showSkeleton: false,
      };

    case types.updateSettings.REQUEST:
    {
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload.settings,
        },
        rfcData: {
          ...state.rfcData,
          updated: action.payload.isEditMode ?  moment().unix() : state.rfcData.updated,
        },
      };
    }

    case types.updateRfc.REQUEST:
    {
      const {
        name,
        url,
      } = action.payload;
      return {
        ...state,
        rfcData: {
          ...state.rfcData,
          name,
          organization_url: url,
          updated: moment().unix(),
        },
      };
    }

    case addFilter.REQUEST:
    case addShortcut.REQUEST:
    case editShortcut.REQUEST:
    case deleteShortcut.REQUEST:
    case deleteFilter.REQUEST:
    case sortFilters.REQUEST:
    case footerTypes.editFooterMenu.REQUEST:
    case footerTypes.sortFooterMenu.REQUEST:
    case footerTypes.deleteFooterMenu.REQUEST:
    case footerTypes.updateFooterLogo.REQUEST:
    case headerTypes.updateHeaderLogo.REQUEST:
    case headerTypes.updateBackground.REQUEST:
    case headerTypes.updateHyperlinks.REQUEST:
    case headerTypes.updateButton.REQUEST:
    case headerTypes.updateHeaderSettings.REQUEST:
    case categoriesTypes.addNewCategory.REQUEST:
    case categoriesTypes.deleteCategory.REQUEST:
    case categoriesTypes.addNewItems.SUCCESS:
    case categoriesTypes.deleteItem.REQUEST:
    case categoriesTypes.updateCategoryTitle.REQUEST:
    case categoriesTypes.sortCategoriesOnDrop.REQUEST:
    case categoriesTypes.addWebPage.REQUEST:
    case categoriesTypes.editItem.REQUEST:
    case types.revisionUpdateText.REQUEST:
    case sortRows.SUCCESS:
      return {
        ...state,
        rfcData: {
          ...state.rfcData,
          updated: moment().unix(),
        },
      };

    default: {
      return state;
    }
  }
}
