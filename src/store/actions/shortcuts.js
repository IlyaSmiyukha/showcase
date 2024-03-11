import * as types from '@/store/types/shortcuts';

export const getShortcutInitialData = data => {
  return {
    type: types.getShortcutInitialData.REQUEST,
    payload: data,
  };
};

export const addShortcut = (shortcut) => {
  return {
    type: types.addShortcut.REQUEST,
    payload: shortcut,
  };
};

export const editShortcut = (data) => {
  return {
    type: types.editShortcut.REQUEST,
    payload: data,
  };
};

export const deleteShortcut = (id) => {
  return {
    type: types.deleteShortcut.REQUEST,
    payload: id,
  };
};
