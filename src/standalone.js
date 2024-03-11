import React from 'react';
import ReactDOM from 'react-dom';
import constants from '@/constants';

import _ from 'lodash';

import {
  ShowcaseContainer,
} from '@/integrated.js';

const accessToken = _.get(config, 'initConfig.access_token');
const group = _.get(config, 'initConfig.group');
const viewUrl = _.get(config, 'initConfig.view_url');

ReactDOM.render(<ShowcaseContainer
  accessToken={accessToken}
  group={group}
  navigateTo={() => null}
  openAnalytics={() => null}
  rfcId={'2931b141dcbd4292b9cd4ff771d8a2b3'}
  // list="my-showcases"
  pathname='g/new/showcase/2931b141dcbd4292b9cd4ff771d8a2b3/'
  organizationId="1"
  apiUrl="https://fabric-api.touchcast.io"
  viewUrl={viewUrl}
  user={'428689488013689092'}
  playerConfig={constants.playerConfig}
  sharingAnyoneWithTheLink={true}
  standalone={true}
/>, document.getElementById('base-wrapper'));
