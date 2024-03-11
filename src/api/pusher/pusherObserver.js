import Pusher from 'pusher-js';

import {
  EventsEmitter,
} from './eventsEmitter';

export class PusherObserver extends EventsEmitter {

  constructor(state) {
    super(state);
    
    const cluster = 'mt1';
    const appKey = _.get(window, 'fabricInitConfig.appclient_config_web.pusherApiKey') || 'ff0c8001b1a4b723699';
    const {
      apiUrl,
      group,
      accessToken,
      user,
    } = state;
    this.group = group;
    this.user = user;
    const authEndpoint = `${apiUrl}/pusher/authorize?group=${group}`;
    console.error(apiUrl)
    //fabric-api.touchcast.io/pusher/authorize?group=touchcastdev-new-ihIczB06

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
   
    this.globalChannel = null;
    this.userChannel = null;
    this.pusher = new Pusher(appKey, {
      wsHost: 'fabric-socket-api-useast.touchcast.io',
      wsPort: 80,
      enabledTransports: ['ws'],
      encrypted: true,
      authEndpoint,
      cluster,
      disableStats: true,
      auth: {
        headers,
      },
      authDelay: 200,
    });
    this.pusherSubscription(user);
  }

  pusherSubscription = (user) => {
    this.globalChannel = this.pusher.subscribe('private-global');
    this.globalChannel.bind_global(this.listenGlobalChannel);

    this.userChannel = this.pusher.subscribe(`private-user-${user}`);
    this.userChannel.bind_global((e, data) => this.listenUserChannel(e, data, user));
  }

  disconect = () => {
    this.pusher.disconnect();
  }
  
  subscribeOnFolderChannel = (folderID) => {
    this.folderChannel = this.pusher.subscribe(`private-folder-${folderID}`);
    this.folderChannel.bind_global(this.listenFolderChannel);
  }
  
  unsubscribeFromFolderChannel = (folderID) => {
    this.folderChannel = null;
    this.pusher.unsubscribe(`private-folder-${folderID}`);
  }

}

