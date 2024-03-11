import * as types from '@/store/types/header';

export const updateHeaderLogo = (logo, group) => {
  return {
    type: types.updateHeaderLogo.REQUEST,
    payload: {logo, group},
  };
};

export const updateHyperlinks = (hyperlinks) => {
  return {
    type: types.updateHyperlinks.REQUEST,
    payload: hyperlinks,
  };
};

export const updateButton = (button) => {
  return {
    type: types.updateButton.REQUEST,
    payload: button,
  };
};

export const updateBackground = (background, group) => {
  return {
    type: types.updateBackground.REQUEST,
    payload: {background, group},
  };
};

export const updateHeaderSettings = (settings) => {
  return {
    type: types.updateHeaderSettings.REQUEST,
    payload: settings,
  };
};
