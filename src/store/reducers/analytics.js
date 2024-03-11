import * as types from '@/store/types/analytics';

import {
  resetRfcData,
} from '@/store/types/revisions';

const currentDate = new Date();
const timeFrom = currentDate.setDate(currentDate.getDate() - 30);

const initialState = {
  showAnalytics: false,
  date: {
    title: 'Last 30 days',
    timeTo: Math.round(Date.now() / 1000),
    timeFrom: Math.round(timeFrom / 1000),
  },
  visits: {
    total: 0,
    results: []
  },
  uniqueVisits: {
    total: 0,
    results: []
  },
  averageDuration: 0,
  cards: {},
  isCategoriesLoading: false,
  total: {
    clicks: 0,
    uniqClicks: 0,
    totalPlays: 0,
    uniqPlays: 0,
    avgWatch: 0,
    sessionCount: 0
  }
};

export default function analytics(state = initialState, action) {
  switch (action.type) {
    case types.showAnalytics.REQUEST: {
      return action.payload ? {
        ...state,
        showAnalytics: action.payload,
      } : initialState;
    }

    case types.setAnalyticsDate.REQUEST: {
      return {
        ...state,
        date: action.payload,
      };
    }

    case types.getTotalVisits.SUCCESS: {
      const {
        visits,
        unique_visits,
        average_duration
      } = action.result
      return {
        ...state,
        visits,
        uniqueVisits: unique_visits,
        averageDuration: average_duration
      };
    }

    case types.getCardsAnalytics.REQUEST: {
      return {
        ...state,
        isCategoriesLoading: true
      };
    }

    case types.getCardsAnalytics.SUCCESS: {
      const {
        cards,
        total
      } = action.result
      return {
        ...state,
        cards,
        total,
        isCategoriesLoading: false
      };
    }

    case resetRfcData.REQUEST:
      return initialState;

    default: {
      return state;
    }
  }
}
