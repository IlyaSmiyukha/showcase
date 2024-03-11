import { combineReducers } from 'redux';

import files from '@/store/reducers/files';
import auth from '@/store/reducers/auth';
import rfc from '@/store/reducers/rfc';
import view from '@/store/reducers/view';
import revisions from '@/store/reducers/revisions';
import filters from '@/store/reducers/filters';
import shortcuts from '@/store/reducers/shortcuts';
import managePeople from '@/store/reducers/managePeople';
import header from '@/store/reducers/header';
import footer from '@/store/reducers/footer';
import categories from '@/store/reducers/categories';
import users from '@/store/reducers/users';
import analytics from '@/store/reducers/analytics';
import layout from '@/store/reducers/layout';

const reducers = {
  auth,
  files,
  rfc,
  view,
  revisions,
  filters,
  shortcuts,
  managePeople,
  header,
  footer,
  categories,
  users,
  analytics,
  layout
};

export default combineReducers(reducers);
