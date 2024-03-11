import React, {
  useEffect
} from 'react';

import { useSelector, useDispatch } from 'react-redux';

import Scrollbar from '@/components/Scrollbar';
import AnalyticsOveralStats from '@/components/AnalyticsOveralStats';
import AnalyticsGraph from '@/components/AnalyticsGraph';
import AnalyticsCategoriesStats from '@/components/AnalyticsCategoriesStats';
import AnalyticsCardsStats from '@/components/AnalyticsCardsStats';

import {
  getTotalVisits,
  getCardsAnalytics
 } from '@/store/actions/analytics'

import {
  getSelectedDate,
} from '@/store/selectors/analytics'

import {
  getCurrentRfcId,
} from '@/store/selectors/revisions'

import {
  getCardsIds
} from '@/store/selectors/categories'

import locale from '@/api/locale';

import './AnalyticsDashboard.less';

const AnalyticsDashboard = props => {
  const dispatch = useDispatch();

  const rfcId = useSelector(state => getCurrentRfcId(state));
  const date = useSelector(state => getSelectedDate(state));
  const cardsIds = useSelector(state => getCardsIds(state));

  useEffect(() => {
    dispatch(getTotalVisits({
      rfcId: rfcId,
      start: date.timeFrom,
      end: date.timeTo,
      resolution: "day"
    }));

    dispatch(getCardsAnalytics({
      rfcId: rfcId,
      start: date.timeFrom,
      end: date.timeTo,
      ids: cardsIds,
    }))

  }, [date]);

  return (
    <div className="sc-analytics-wrapper">
      <Scrollbar>
        <AnalyticsOveralStats />
        <AnalyticsGraph />
        <AnalyticsCategoriesStats />
        <AnalyticsCardsStats />
      </Scrollbar>
    </div>
  );
};


export default AnalyticsDashboard;
