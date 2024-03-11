import Pusher from 'pusher-js';
import store from '@/store/store';

import {
  revisionDeleteFile,
} from '@/store/actions/revisions';

import {
  deleteVideoFile,
  addFile,
  trackProcessingProgress,
} from '@/store/actions/files';

import {
  someoneEditingPopup,
} from '@/store/actions/view';

import {
  getEditors,
} from '@/store/selectors/managePeople';
import {
  getUsers,
} from '@/store/selectors/users';


import { NotificationManager } from 'react-notifications';


class PusherSC {
  globalChannel = null;
  userChannel = null;
  folderChannel = null;
  group = null;
  user = null;

  constructor(state) {
    const cluster = 'mt1';
    const appKey = _.get(window, 'fabricInitConfig.appclient_config_web.pusherApiKey') || 'ff0c8001b1a4b7236993';
    const {
      apiUrl,
      group,
      accessToken,
      user,
    } = state;
    this.group = group;
    this.user = user;
    const authEndpoint = `${apiUrl}/pusher/authorize?group=${group}`;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    this.pusher = new Pusher(appKey, {
      encrypted: true,
      authEndpoint,
      cluster,
      disableStats: true,
      auth: {
        headers,
      },
      //authTransport: 'buffered',
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

  listenGlobalChannel = (e, data) => {
    /*switch (e) {
      
      default:
    }*/
  }

  listenUserChannel = (e, data, user) => {
    if (data.file && data.file.type === 'standalone') {
      return;
    }
    switch (e) {
      case 'File:Archive':
        this.handleFileDelete(data.file_id);
        break;
      case 'File:Deleted':
        this.handleFileDelete(data.file_id);
        break;
      case 'File:Updated:OwnershipChanged':
        this.handleFileDelete(data.file.file_id);
        break;
      case 'File:Created':
      case 'File:Updated':
        if (data.status !== 'removed') {
          this.handleFileUpdate(data, user);
        }
        break;
      case 'File:Updated:Progress':
        this.handleFileProcessing(data);
        break;
      case 'Rfc:Collaboration:Status':
        this.handleUserChangeStatus(data, user);
        break;
      case 'Rfc:Collaboration:RevisionUpdate':
        this.handleRevisionUpdate(data, user);
        break;
    }
  }

  subscribeOnFolderChannel = (folderID) => {
    this.folderChannel = this.pusher.subscribe(`private-folder-${folderID}`);
    this.folderChannel.bind_global(this.listenFolderChannel);
  }

  unsubscribeFromFolderChannel = (folderID) => {
    this.folderChannel = null;
    this.pusher.unsubscribe(`private-folder-${folderID}`);
  }

  listenFolderChannel = (e, data) => {
    if (data.file && data.file.type === 'standalone') {
      return;
    }
    switch (e) {
      case 'File:Updated:OwnershipChanged':
        this.handleFileDelete(data.file.file_id);
        break;
      case 'File:Created':
      case 'File:Updated':
        this.handleFileUpdate(data, this.user);
        break;
      case 'File:Updated:Progress':
        this.handleFileProcessing(data);
        break;
    }
  }

  handleFileDelete = (id) => {
    store.dispatch(revisionDeleteFile(id));
    store.dispatch(deleteVideoFile(id));
  }

  handleFileUpdate = (file, user) => {
    const users = getUsers(store.getState());
    const currentUser = users[user];
    const fileEntity = {
      ...file,
      owner_data: currentUser,
    };
    store.dispatch(addFile(fileEntity, this.group));
  }

  handleFileProcessing = (processing) => {
    store.dispatch(trackProcessingProgress(processing.file_id, Math.round(processing.percent)));
  }

  handleUserChangeStatus = (data, user) => {
    const location = window.location.pathname;
    if (location.includes('showcase')
        && `${data.rfc_id}` === location.substring(location.lastIndexOf('/') + 1)
        && user !== data.user_id) {
      store.dispatch(someoneEditingPopup({
        editorId: data.user_id,
        modalTitle: 'ANOTHER PERSON OPENED THE EDITOR',
      }));
    }
  }

  handleRevisionUpdate = (data, user) => {
    const location = window.location.pathname;
    if (location.includes('showcase')
      && `${data.rfc_id}` === location.substring(location.lastIndexOf('/') + 1)
      && user !== data.user_id) {
      const editors = getEditors(store.getState());
      const editor = editors.find(editor => editor.user_id === `${data.user_id}`);
      NotificationManager.listNotify.pop();
      NotificationManager.error(`This showcase was updated by ${editor.first_name} ${editor.last_name} (${editor.email}). Please refresh the page to avoid conflicts.`, '', 60 * 60 * 24 * 1000);
    }
  }
}

export default PusherSC;
