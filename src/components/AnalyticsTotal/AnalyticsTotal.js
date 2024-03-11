import React, {
  useEffect,
  useState
} from 'react';

import { useSelector } from 'react-redux';

import locale from '@/api/locale';

import {
  getTotalAnalyticsStats
} from '@/store/selectors/analytics';
import {
  getCardsInfo,
} from '@/store/selectors/categories';
import {
  getFiles
} from '@/store/selectors/files';

import {
  formatDuration
} from '@/helpers';

const AnalyticsTotal = props =>  {
  const [cardsCount, setCardsCount] = useState(0)
  const total = useSelector(state => getTotalAnalyticsStats(state));
  const cardsCategoryInfo = useSelector(state => getCardsInfo(state));
  const files = useSelector(state => getFiles(state));

  useEffect(() => {
    const counter = Object.values(cardsCategoryInfo).reduce((acc, card) => {
      const file = files[card.file_id];
      acc = file &&
            (file.type === 'video' || file.type === 'audio' || file.type === 'performance')
            ? acc + 1 : acc
      return acc
    }, 0);
    setCardsCount(counter)
  }, [cardsCategoryInfo])

  return (
    <tr className='sc-analytics-info-total'>
      <td>
        TOTAL
      </td>
      <td>{total.clicks} <span>(100%)</span></td>
      <td>{total.uniqClicks} <span>(100%)</span></td>
      <td>{total.totalPlays}</td>
      <td>{total.uniqPlays}</td>
      <td>{formatDuration(cardsCount ? total.avgWatch / cardsCount : 0)}</td>
    </tr>
  );
};


export default AnalyticsTotal;
