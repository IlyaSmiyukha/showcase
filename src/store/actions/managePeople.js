import * as types from '@/store/types/managePeople';

export const fetchPeopleToShare = (query) => {
  return {
    routine: types.fetchPeopleToShare,
    promise: client => new Promise(async(resolve, reject) => {
      try {
        if (query) {
          const usersList = await client.post('/user/search', {
            query,
          });

          resolve(usersList);
          return;
        }

        resolve([]);

      } catch (error) {
        reject(error);
      }
    }),
  };
};

export const permisionEdit = (data) => {
  return {
    routine: types.permisionEdit,
    promise: client => new Promise(async(resolve, reject) => {
      try {
        const usersIds = data.users.map(user => user.user_id);
        const options = {
          object_type: 'rfc',
          object_id: data.id,
          options: {
            send_email: 1,
          },
          permissions: [
            {
              type: 'rfc.edit',
              operation: data.operation,
              granted_to: {
                user_ids: usersIds,
              },
            },
            {
              type: 'rfc.view',
              operation: data.operation,
              granted_to: {
                user_ids: usersIds,
              },
            },
          ],
        };

        const usersList = await client.post('/permission/edit', options);
        if (data.operation === 'remove') {

          resolve({
            actionType: data.operation,
            users: usersIds,
          });

        } else if (data.operation === 'add') {
          resolve({
            actionType: data.operation,
            users: data.users.map(user => ({
              role: 'editor',
              joined: Math.round(Date.now() / 1000),
              status: 'offline',
              first_name: user.first_name,
              last_name: user.last_name,
              user_id: user.user_id,
              email: user.email,
            })),
          });

        }

      } catch (error) {
        reject(error);
      }
    }),
  };
};


export const sendStatus = (status, rfcId) => {
  return {
    routine: types.fetchPeopleToShare,
    promise: client => client.post('rfc/editor/update', {
      status,
      rfc_id: rfcId,
    }),
  };
};

export const fetchFollowers = (rfcId, offset) => {
  return {
    routine: types.fetchFollowers,
    promise: client => client.get('rfc/followers/list', {
      rfc_id: rfcId,
      limit: 25,
      offset
    }),
  };
};

export const changeOwnership = params => {
  return {
    routine: types.changeOwnership,
    promise: client => new Promise(async (resolve, reject) => {
      try {

        await client.post('/rfc/change-ownership', params);

        resolve(params.rfc_id);

      } catch (error) {
        reject(error);
      }
    }),
  };
};

export const getEditors = (editors) => {
  return {
    type: types.getEditors.REQUEST,
    payload: editors,
  };
};


