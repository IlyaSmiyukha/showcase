import store from '@/store/store';
import * as types from '@/store/types/revisions';
import uuid from 'uuid-random';
import { NotificationManager } from 'react-notifications';

import {
  getFiles,
} from '@/store/selectors/files';

import {
  getAuthGroupPath,
} from '@/store/selectors/auth';

import {
  fetchUrls,
} from '@/store/actions/files';

import {
  getShortcutInitialData,
} from '@/store/actions/shortcuts';

import {
  showPublishedPopup,
  someoneEditingPopup,
} from '@/store/actions/view';

import {
  getEditors
} from '@/store/actions/managePeople';

export const revisionUpdate = params => {
  return {
    routine: types.revisionUpdate,
    promise: client => new Promise(async (resolve, reject) => {
      try {
        const {
          rfcId,
          data,
          is_editor_active,
        } = params;
        const resp = await  client.post('/rfc/revision/update', {
          rfc_id: rfcId,
          data,
          is_editor_active,
        });

        resolve({
          ...resp,
        });
      } catch (error) {
        NotificationManager.error('There was a problem saving the showcase. Please try again later.');
        reject(error);
      }
    }),
  };
};

export const revisionPublish = (rfcId, notifyFollowers, message) => {
  return {
    routine: types.revisionPublish,
    promise: client => new Promise(async (resolve, reject) => {
      try {

        const resp = await  client.post('/rfc/revision/publish', {
          rfc_id: rfcId,
          notify_followers: notifyFollowers,
          notification_message: message,
        });
        store.dispatch(showPublishedPopup(resp));

        resolve({
          ...resp,
        });
      } catch (error) {
        reject(error);
      }
    }),
  };
};

export const revisionUnpublish = (rfcId) => {
  return {
    routine: types.revisionUnpublish,
    promise: client => client.post('/rfc/revision/unpublish', {
      rfc_id: rfcId,
    }),
  };
};

const fetchRevisionsList = async (rfcId, client) => (
  await client.get('/rfc/revision/list', {
    rfc_id: rfcId,
  }) || []
);

const fetchRevisionData = async (
  rfcId,
  revisionId,
  client,
) => {
  try {
    const result = await client.get('/rfc/revision/get', {
      rfc_id: rfcId,
      revision_id: revisionId,
    });
    return result;
  } catch (e) {
    console.log(e);
    throw(e);
  }
};

const parseBlocks = data => {
  const {
    blocks: tmp = [],
    layout
  } = data || {};
  const blocks = _.uniqBy(tmp, 'id');
  const header = blocks.find(item => item && item.type === 'showcase-header');
  const footer = blocks.find(item => item && item.type === 'showcase-footer');
  const categories = blocks.filter(item => item && item.type === 'showcase-category') || [];
  const filters = blocks.find(item => item && item.type === 'showcase-filters-and-search') || {};
  const shortcuts = blocks.find(item => item && item.type === 'showcase-shortcuts') || {};
  let newLayout = layout ? layout : categories.reduce((acc, category) => {
    const row = {
      id: uuid(),
      columns: [{
        id: uuid(),
        type:"category",
        blockId: category.id
      }]
    }

    return {
      rows: [
        ...acc.rows,
        row
      ]
    };
  }, {
    rows: []
  });

  return {
    header,
    footer,
    categories,
    blocks,
    filters,
    shortcuts,
    layout: newLayout
  };
};

const getRfcFilesIds = (
  header,
  footer,
  categories,
  shortcuts,
) => {
  const logo = _.get(header, 'logo_file');
  const background = _.get(header, 'video_background');
  const button = _.get(header, 'button');
  const footerLogo = _.get(footer, 'logo_file');

  const categoriesFiles = [logo,
    background,
    footerLogo,
    button].filter(item => !!item);
  categories.forEach(category => category.items.forEach(item => categoriesFiles.push(item)));

  shortcuts && shortcuts.items ? shortcuts.items.forEach(shortcut => categoriesFiles.push(shortcut)) : null;
  return categoriesFiles
    .filter(item => item)
    .reduce((ids, item) => {
      const itemIds = item.file_id ? [item.file_id] : [];
      if (item.thumbnail) {
        itemIds.push(_.get(item, 'thumbnail.file_id'));
      }
      if (_.get(item, 'owner_data.personImg.file_id')) {
        itemIds.push(_.get(item, 'owner_data.personImg.file_id'));
      }
      return [...ids,
        ...itemIds];
    },[]);
};

const getLoadedFiles = ids => {
  const storedFiles = Object.keys(getFiles(store.getState()));
  return _.pickBy(storedFiles, (value, key) => ids.includes(key));
};

const getGroup = () => getAuthGroupPath(store.getState());

export const fetchFilesList = async (ids, group, client, loadFilesById, rfcId, withSecurity) => {
  try {
    const chunks = _.chunk(ids, 100);

    const newFiles = [];
    const deletedFiles = [];
    if (ids.length) {
      for (const ids of chunks) {
        const request = {
          group,
          ids,
          return_owner_data: true,
        };

        if (withSecurity) {
          request['security_params'] = {
            links: {
              rfc: rfcId,
            },
          };
        }

        const {
          files,
          files_error: filesError = [],
          // files_error,
        } =  await client.post('/files/list/get', request);
        newFiles.push(...files);
        deletedFiles.push(...Object.keys(filesError));
      }
    }
    return {
      newFiles,
      deletedFiles,
    };
  } catch (error) {
    console.log(error);
  }
};

export const revisionFetchInitialData = (rfcId, loadFilesById) => {
  return {
    routine: types.revisionFetchInitialData,
    promise: client => new Promise(async (resolve, reject) => {
      try {
        const {
          revisions = [],
        } = await fetchRevisionsList(rfcId, client);
        const published = revisions.find(item => item.type === 'published');
        const draft = revisions.find(item => item.type === 'draft');
        const defaultRevision = draft || published || {};
        const revisionId = _.get(defaultRevision, 'revision_id');
        const {
          data = {},
          rfc_data: rfcData = {},
        } = await fetchRevisionData(rfcId, revisionId, client);

        const {
          header,
          footer,
          categories,
          filters,
          shortcuts,
          layout
        } = parseBlocks(data);
        const ids = getRfcFilesIds(header, footer, categories, shortcuts);
        const group = getGroup();
        const loadedFiles = getLoadedFiles(ids);
        const needToFetchIds = _.uniq(ids);
        const {newFiles, deletedFiles} = await fetchFilesList(needToFetchIds, group, client, loadFilesById, rfcId, true);
        const newUrls = needToFetchIds.length ? await fetchUrls(client, needToFetchIds, group, rfcId) : [];
        let tags = [];
        const filesFormStore = getFiles(store.getState());

        const files = [...Object.values(loadedFiles),
          ...newFiles.map(file => {
            const url = newUrls.find(item => item.file_id === file.file_id) || {};
            return { ...file, ...url };
          })];

        const loadedFilesIds = [
          ...files.map(file => file.file_id),
          ...Object.keys(filesFormStore),
        ].filter(id => !deletedFiles.includes(id));

        if (_.get(header, 'button.action') === 'open_video') {
          header.button = loadedFilesIds.includes(header.button.file_id) ? header.button : {label: ''};
        }

        if (_.get(header, 'logo_file.file_id') && !loadedFilesIds.includes(_.get(header, 'logo_file.file_id'))) {
          delete header.logo_file;
        }

        if (_.get(footer, 'logo_file.file_id') && !loadedFilesIds.includes(_.get(footer, 'logo_file.file_id'))) {
          delete footer.logo_file;
        }

        const filteredCatigories = categories.map(category => {
          const items = category.items.filter(item => {
            return item.type === 'link' || loadedFilesIds.includes(item.file_id);
          }).map( item => {
            if (item.tags) {
              tags = [
                ...tags,
                ...item.tags
              ];
            }

            if (item.thumbnail && !loadedFilesIds.includes(item.thumbnail.file_id)) {
              delete item.thumbnail;
            }

            if (_.get(item, 'owner_data.personImg.file_id') && !loadedFilesIds.includes(item.owner_data.personImg.file_id)) {
              delete item.owner_data.personImg.file_id;
            }

            return {
              ...item,
              card_id: item.card_id ? item.card_id : uuid(),
            };
          });

          return {
            ...category,
            items,
          };
        });

        const cardsArray = filteredCatigories.reduce((acc, category) => {
          const result = [...acc, ...category.items]
          return result
        }, []);
        
        const cards = _.keyBy(cardsArray, 'card_id')

        await store.dispatch(getEditors(rfcData.editors))

        const showEditorsWarning = rfcData.editors && rfcData.editors.filter(editor => editor.status === 'online').length > 1;

        if (showEditorsWarning) {
          await store.dispatch(someoneEditingPopup());
        }

        store.dispatch(getShortcutInitialData(shortcuts ? {
          ...shortcuts,
          items: shortcuts.items ? shortcuts.items.map(shortcut => {
            if (!loadedFilesIds.includes(_.get(shortcut, 'thumbnail.file_id'))) {
              delete shortcut.thumbnail;
            }
            return shortcut;
          }) : [],
        } : {}));

        resolve({
          published,
          rfcData,
          data,
          files,
          header,
          categories: filteredCatigories,
          footer,
          revisionId,
          revisions,
          firstLoad: (!filteredCatigories.length && !header && !footer ),
          cards,
          layout,
          filters: {
            filters : filters,
            tags,
          }
        });


      } catch (error) {
        reject(error);
      }
    }),
  };
};

export const revisionGenereteCsv = (params) => {
  return {
    routine: types.revisionGenereteCsv,
    promise: client => client.post('/rfc/analytics/generate-report', params),
  };
};

export const updateText = (textData) => {
  return {
    type: types.revisionUpdateText.REQUEST,
    payload: textData,
  };
};

export const updateSettings = (settings, isEditMode) => {
  return {
    type: types.updateSettings.REQUEST,
    payload: {
      settings,
      isEditMode,
    },
  };
};

export const updateRfc = (name, url) => {
  return {
    type: types.updateRfc.REQUEST,
    payload: {name, url},
  };
};

export const resetRfcData = () => {
  return store.dispatch({
    type: types.resetRfcData.REQUEST,
    payload: {},
  });
};

export const setCurrentRfcID = (id) => {
  return{
    type: types.setCurrentRfcID.REQUEST,
    payload: id,
  };
};

export const revisionDeleteFile = (id) => {
  return{
    type: types.revisionDeleteFile.REQUEST,
    payload: id,
  };
};

export const revisionRestore = params => {
  return {
    routine: types.revisionRestore,
    promise: client => new Promise(async (resolve, reject) => {
      try {

        await client.post('/rfc/revision/revert', params.restoreTo);

        resolve(params);

      } catch (error) {
        reject(error);
      }
    }),
  };
};
