import * as types from '@/store/types/auth';

export const setAuthData = (
  accessToken,
  group,
  organizationId,
  viewUrl,
  apiUrl,
) => {
  return {
    type: types.setAuthData.SUCCESS,
    payload: {
      accessToken,
      group,
      organizationId,
      viewUrl,
      apiUrl,
    },
  };
};
