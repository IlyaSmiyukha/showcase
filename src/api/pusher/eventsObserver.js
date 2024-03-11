import {
  EventsEmitter,
} from './eventsEmitter';

export class EventsObserver extends EventsEmitter {
  constructor(props) {
   
    super(props);
    
    document.addEventListener('pusher-main-event', this.subscribeOnPusherChannel);
    console.log('Subscribed on Pusher Events');
  }

  subscribeOnPusherChannel = ev => {
    
    const {
      detail = {},
    } = ev || {};
    const {
      channel,
      data,
      event,
      user,
    } = detail;

    switch (channel) {
      case 'folder-channel':
        this.listenFolderChannel(event, data);
        break;
      case 'user-channel':
        this.listenUserChannel(event, data, user);
        break;
    }
  }

  subscribeOnFolderChannel = folder => {
    const customEvent = new CustomEvent('pusher-folder-event', {
      detail: {
        folder,
      },
      bubbles: true,
      cancelable: true,
      composed: false,
    });
    document.dispatchEvent(customEvent);
  }

  disconnect = () => {
    document.removeEventListener('pusher-main-event', this.subscribeOnPusherChannel);
    console.log('Unsubscribed from Pusher Events');
  }
}
