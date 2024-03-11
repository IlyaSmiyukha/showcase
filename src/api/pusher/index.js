import {
  PusherObserver,
} from './pusherObserver';

import {
  EventsObserver,
} from './eventsObserver';

export default isStandalone => isStandalone ? PusherObserver : EventsObserver;
