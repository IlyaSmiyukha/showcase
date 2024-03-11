import * as types from '@/store/types/users';

export const getUsers = user => {
  return {
    type: types.getUsers.REQUEST,
    payload: user,
  };
};
