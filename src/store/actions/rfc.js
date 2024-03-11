import * as types from '@/store/types/rfc';
import store from '@/store/store';

import {updateRfc} from './revisions';
import {getUsers} from './users';

export const createRfc = data => {
  const {
    name,
    type,
    url,
  } = data;

  return {
    routine: types.createRfc,
    promise: client => client.post('/rfc/create', {
      name,
      type,
      url,
    }),
  };
};

export const clearRfcError = () => {
  return {
    type: types.clearRfcError.SUCCESS,
    payload: {},
  };
};

export const editRfc = data => {
  return {
    routine: types.editRfc,
    promise: client => new Promise(async (resolve, reject) => {
      try {

        await client.post('/rfc/edit', data);

        store.dispatch(updateRfc(data.name, data.url));

        resolve({
          data,
        });
      } catch (error) {
        reject(error);
      }
    }),
  };
};

export const duplicateRfc = data => {
  const {
    name,
    type,
    url,
  } = data;

  return {
    routine: types.createRfc,
    promise: client => client.post('/rfc/duplicate', data),
  };
};

export const deleteRfc = rfcId => {
  return {
    routine: types.deleteRfc,
    payload: {
      rfcId,
    },
    promise: client => client.post('/rfc/delete', {
      rfc_id: rfcId,
    }),
  };
};

export const getRfcInfo = url => {
  return {
    routine: types.getRfcInfo,
    promise: client => client.get('/rfc/info', {
      url,
    }),
  };
};


export const fetchRfcList = ({
  page = 0,
  limit = 50,
  sort = 'created', //created | updated | name
  sortDirection = 'desc', //asc | desc
  search = void 0,
  organizationId,
  offset = 0,
  clear = false,
  listType,
}) => {
  return {
    routine: types.fetchRfcList,
    payload: {
      page, //this param only for state, don't add it to url params
      clear,
    },
    promise: client => new Promise(async (resolve, reject) => {
      try {

        const config = {
          limit,
          sort,
          sort_direction: sortDirection,
          search,
          organization_id: organizationId,
          offset,
        };
        if (listType === 'showcases-shared-with-me') {
          config.shared = true;
        }

        const resp = await client.get('/rfc/list', config);
        const userTofetch = _.uniq(resp.items.map(item => item.user_id));
        const usersList = await client.post('/user/get', {
          ids: userTofetch,
        });
        const usersListById = _.keyBy(usersList, 'user_id');

        store.dispatch(getUsers(usersListById));

        resolve({
          ...resp,
          items: resp.items.map(item => ({
            ...usersListById[item.user_id],
            ...item,
          })),
        });

      } catch (e) {
        reject(e);
      }
    }),
  };
};


export const editRfcPermissions = ({
  group,
  rfcId,
  granted,
}) => {
  const {
    add,
    remove,
  } = granted;

  return {
    routine: types.editRfcPermissions,
    promise: client => client.post('/permission/edit', {
      group,
      object_type: 'rfc',
      object_id: rfcId,
      permissions: [{
        type: 'rfc.view',
        operation: 'add',
        granted_to: add,
      },
      {
        type: 'rfc.view',
        operation: 'remove',
        granted_to: remove,
      }],
      options: {
        send_email: 0,
      },
    }),
  };
};
