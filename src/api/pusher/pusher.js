import Pusher from 'pusher-js';

import store from '@/store/store';

import {
  getAuthTokenType,
  getAuthToken,
  getAuthGroupPath,
  getApiUrl,
} from '@/store/selectors/auth';

const cluster = 'mt1';
const state = store.getState();
const appKey =
  _.get(window, 'fabricInitConfig.appclient_config_web.pusherApiKey') ||
  'ff0c8001b1a4b7236993';
const apiUrl = getApiUrl(state);
const group = getAuthGroupPath(state);
const authEndpoint = `${apiUrl}/pusher/authorize?group=${group}`;
const headers = {
  Authorization: `${getAuthTokenType(state)} ${getAuthToken(state)}`,
};

const pusher = new Pusher(appKey, {
  encrypted: true,
  authEndpoint,
  cluster,
  disableStats: true,
  auth: {
    headers,
  },
  // authTransport: 'buffered',
  authDelay: 200,
});

export default pusher;
