import store from '@/store/store';

import {
  addFile,
  deleteVideoFile,
  trackProcessingProgress,
} from '@/store/actions/files';

import {
  someoneEditingPopup,
} from '@/store/actions/view';

import {
  revisionDeleteFile,
} from '@/store/actions/revisions';

import {
  getEditors,
} from '@/store/selectors/managePeople';

import {
  getUsers,
} from '@/store/selectors/users';

import {
  NotificationManager,
} from 'react-notifications';

export class EventsEmitter {
  constructor({
    userId,
    showcaseId,
    editors,
  }) {
    this.userId = userId;
    this.showcaseId = showcaseId;
    this.editors = editors;
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


  handleFileDelete = (id) => {
    store.dispatch(revisionDeleteFile(id));
    store.dispatch(deleteVideoFile(id));
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
}
