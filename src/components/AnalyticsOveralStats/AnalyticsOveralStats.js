import React, {
  useState,
  useEffect
} from 'react';

import { useSelector, useDispatch } from 'react-redux';

import locale from '@/api/locale';

import {
  getSelectedDate,
  getOveralStats
 } from '@/store/selectors/analytics'
import { getCreatedTime } from '@/store/selectors/revisions'
import { showAnalyticsDatePopup } from '@/store/actions/view'

import {
  formatDuration
} from '@/helpers'

import SvgIcon  from '@/components/SvgIcon';

import './AnalyticsOveralStats.less';

const AnalyticsOveralStats = props =>  {

  const dispatch = useDispatch();
  const date = useSelector(state => getSelectedDate(state));
  const created = useSelector(state => getCreatedTime(state));
  const stats = useSelector(state => getOveralStats(state));

  const handleClick = () => dispatch(showAnalyticsDatePopup({
    date,
    created
  }));

  return (
    <div className="sc-analytics-block" >

      <div className="sc-analytics-title" >
        <h3>{locale.getResource('OverallStats')}</h3>
        <button className='sc-button-analytics' onClick={handleClick}>
          {date.title}
        </button>
      </div>

      <div className="sc-analytics-overall-block" >

          <div className="sc-analytics-overall-item" >
            <span>{stats.visits}</span>
            {locale.getResource('TotalVisits')}
          </div>

          <div className="sc-analytics-overall-item" >
            <span>{stats.uniqueVisits}</span>
            {locale.getResource('UniqVisits')}
          </div>

          <div className="sc-analytics-overall-item" >
            <span>{formatDuration(stats.averageDuration / 1000 || 0)}</span>
            {locale.getResource('AverageVisits')}
          </div>

      </div>

    </div>
  );
};


export default AnalyticsOveralStats;
