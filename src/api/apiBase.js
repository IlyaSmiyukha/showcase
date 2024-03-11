import axios from 'axios';
import constants from '@/constants';
import _ from 'lodash';
import store from '@/store/store.js';

import {
  getAuthTokenType,
  getAuthToken,
  getAuthGroupPath,
  getApiUrl,
} from '@/store/selectors/auth';

const apiBase = axios.create({});

const _get = apiBase.get;

apiBase.get = function (url, query = {}, config = {}) {
  return _get(url, { params: { ...query }, ...config });
}.bind(apiBase);

apiBase.interceptors.request.use(function (config) {
  const state = store.getState();
  config.baseURL = getApiUrl(state);

  config.headers['Authorization'] = `${getAuthTokenType(state)} ${getAuthToken(state)}`;
  config.params = config.params || {};

  if (config.data && !config.data['group']) {
    config.data['group'] = getAuthGroupPath(state);
  }

  if (config.method === 'get') {
    _.forOwn(config.params, (
      value,
      key,
    ) => {
      config.params[key] = value;
    });

    if(!config.params['group']) {
      config.params['group'] = getAuthGroupPath(state);
    }
  }

  _.forEach(constants.apiAdditionalParams, item => {
    config.params[item.name] = item.value;
  });

  return config;

}, error => {
  return Promise.reject(error);
});

apiBase.interceptors.response.use(response => {
  return response.data;
}, error => {
  return Promise.reject(error);
});

export default apiBase;
