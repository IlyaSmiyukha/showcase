import * as types from '@/store/types/footer';

export const updateFooterLogo = (
  logo,
  group,
) => {
  return {
    type:
      types
        .updateFooterLogo
        .REQUEST,
    payload: {
      logo,
      group,
    },
  };
};


export const editFooterMenu = data => {
  return{
    type: types.editFooterMenu.REQUEST,
    payload: data,
  };
};

export const sortFooterMenu = data => {
  return{
    type: types.sortFooterMenu.REQUEST,
    payload: data,
  };
};

export const deleteFooterMenu = id => {
  return{
    type: types.deleteFooterMenu.REQUEST,
    payload: id,
  };
};
