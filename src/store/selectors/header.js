import { createSelector } from 'reselect';

import {
  getFiles,
} from '@/store/selectors/files';

export const getHeader = createSelector([state => _.get(state, 'header')], header => header);

export const getHyperlinks = createSelector([getHeader], header => {
  return  _.get(header, 'hyperlinks');
});

export const getButton = createSelector([getHeader], header => {
  return  _.get(header, 'button');
});

export const getLogo = createSelector([getHeader,
  getFiles], (
  header,
  files,
) => {
  const fileId = _.get(header, 'logo_file.file_id');
  const file = files[fileId] || null;
  let image='';
  if (file) {
    image = file.status === 'ok' || file.status === 'ready' ? _.get(file, 'urls.file') : 'loading';
  }

  return image;
});

export const getHeaderBacground = createSelector([getHeader,
  getFiles], (
  header,
  files,
) => {
  const fileId = _.get(header, 'video_background.file_id');
  const file = files[fileId] || null;
  let url = '';
  if (file && file.type === 'image') {
    url = file.status === 'ok' || file.status === 'ready' ? _.get(file, 'urls.file') : 'loading';
  } else if (file) {
    url =  file.status === 'ok' || file.status === 'ready' ? _.get(file, 'urls.file', null) : 'loading';
  }
  return url;
});

export const getHeaderBacgroundType = createSelector([getHeader,
  getFiles], (
  header,
  files,
) => {
  const fileId = _.get(header, 'video_background.file_id');
  const file = files[fileId] || null;
  return file && file.type;
});
