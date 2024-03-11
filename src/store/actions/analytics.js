import store from '@/store/store';
import * as types from '@/store/types/analytics';

export const showAnalytics = analytics => ({
  type: types.showAnalytics.REQUEST,
  payload: analytics
});

export const setAnalyticsDate = date => ({
  type: types.setAnalyticsDate.REQUEST,
  payload: date
});

export const getTotalVisits = ({rfcId, start, end, resolution}) => {
  return {
    routine: types.getTotalVisits,
    promise: client => new Promise(async (resolve, reject) => {
      try {
        const data =  await client.post('/analytics/data/rfc/visits-per-time', {
          rfc_id: rfcId,
          time_start: start,
          time_end: end,
          time_resolution: resolution
        });
        resolve(data);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    }),
  };
};

export const getCardsAnalytics = ({rfcId, start, end, ids}) => {
  return {
    routine: types.getCardsAnalytics,
    promise: client => new Promise(async (resolve, reject) => {
      try {
        if (!ids.length) {
          resolve({
            cards: {},
            total: {
              clicks: 0,
              uniqClicks: 0,
              totalPlays: 0,
              uniqPlays: 0,
              avgWatch: 0,
            }
          });
          return
        }
        const data =  await client.post('/analytics/data/rfc/card-stats', {
          rfc_id: rfcId,
          time_start: start,
          time_end: end,
          card_ids: ids,
        });

        let result = {};

        if (data) {
          result = data.reduce((acc, card) => {
            acc['cards'][card.card_id] = card;
            acc['total'] = {
              clicks: card.total_clicks + acc.total.clicks,
              uniqClicks: card.unique_clicks + acc.total.uniqClicks,
              totalPlays: card.total_plays + acc.total.totalPlays,
              uniqPlays: card.unique_plays + acc.total.uniqPlays,
              avgWatch: card.average_watch + acc.total.avgWatch,
            }
            return acc
          }, {
            cards: {},
            total: {
              clicks: 0,
              uniqClicks: 0,
              totalPlays: 0,
              uniqPlays: 0,
              avgWatch: 0,
            }
          })
          resolve(result);
        } else {
          reject();
        }

      } catch (error) {
        console.log(error);
        reject(error);
      }
    }),
  };
};
