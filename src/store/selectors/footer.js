import { createSelector } from 'reselect';

import {
  getFiles,
} from '@/store/selectors/files';

export const getFooter = createSelector([state => _.get(state, 'footer')], footer => footer);

export const getFooterLogo = createSelector([getFooter,
  getFiles], (
  footer,
  files,
) => {
  const fileId = _.get(footer, 'logo_file.file_id');
  const file = files[fileId] || null;
  let image = '';
  if (file) {
    image =  file.status === 'ok' || file.status === 'ready' ? _.get(file, 'urls.file') : 'loading';
  }

  return image;
});
