import React, {
  useState,
  useEffect
 } from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames';

import locale from '@/api/locale';
import CategoryItem from './CategoryItem';
import AnalyticsTotal from '@/components/AnalyticsTotal';

import {
  getCards,
  getIsCategoriesLoading,
  getTotalAnalyticsStats
} from '@/store/selectors/analytics';
import {
  getFiles
} from '@/store/selectors/files';
import {
  getCategoriesForAnalytics,
  getCardsInfo
} from '@/store/selectors/categories';

import './AnalyticsCategoriesStats.less';

const AnalyticsCategoriesStats = props =>  {
  const categoriesFromStore = useSelector(state => getCategoriesForAnalytics(state));
  const cards = useSelector(state => getCards(state));
  const isLoading = useSelector(state => getIsCategoriesLoading(state));
  const totalStats = useSelector(state => getTotalAnalyticsStats(state));
  const cardsCategoryInfo = useSelector(state => getCardsInfo(state));
  const files = useSelector(state => getFiles(state));

  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState({
    name: '',
    asc: false
  });

  const calcData = (category) => {
    const total = category.items.reduce((acc, cardId) => {
      const item = {
        ...cards[cardId],
        ...cardsCategoryInfo[cardId],
      } || {};
      const file = files[item.file_id];
      const cardsCount = file
          && (file.type === 'video'|| file.type === 'audio' || file.type === 'performance')
          ? acc.cardsCount + 1 : acc.cardsCount
      return {
        clicks: (acc.clicks + item.total_clicks) || 0,
        uniqClicks: (acc.uniqClicks + item.unique_clicks) || 0,
        plays: (acc.plays + item.total_plays) || 0,
        uniqPlays: (acc.uniqPlays + item.unique_plays) || 0,
        avgWatch: (acc.avgWatch + item.average_watch) || 0,
        cardsCount
      }
    }, {
      clicks: 0,
      uniqClicks: 0,
      plays: 0,
      uniqPlays: 0,
      avgWatch: 0,
      cardsCount: 0
    });
    total['clicksPersent'] = !!total.clicks ? (total.clicks / totalStats.clicks * 100).toFixed(2) : 0
    total['uniqClicksPersent'] = !!total.uniqClicks ? (total.uniqClicks / totalStats.uniqClicks * 100).toFixed(2) : 0

    return {
      ...category,
      total: {
        ...total,
        avgWatch: total.cardsCount ? total.avgWatch / total.cardsCount : 0
      },
    }
  }

  useEffect(() => {
    if (Object.keys(cards).length) {
      const categoriesTotal = categoriesFromStore.reduce((acc, category) => {
        const parsedCategory = calcData(category);
        acc = [...acc, parsedCategory]
        return acc;
      }, []);
      setCategories(categoriesTotal)
    }
  }, [cards])

  const classNames = classnames({
    'sc-analytics-loading': isLoading
  });

  const handleSort = (name) => {
    if (categories.length) {
      setSortBy({
        name,
        asc: name === sortBy.name ?  !sortBy.asc : false
      })
    }
  }

  useEffect(() => {
    const sortedCategories = _.orderBy(categories, [`total.${sortBy.name}`], [sortBy.asc ? 'asc' : 'desc']);
    setCategories(sortedCategories)
  }, [sortBy]);

  const sortIndicatorClassNames = (asc) => (classnames({
    'sc-sort-indicator': true,
    asc: asc,
    desc: asc !== null && !asc,
  }));

  return (
    <div className="sc-analytics-block" >
      <div className="sc-analytics-title" >
        <h3>{locale.getResource('CategoriesStats')}</h3>
      </div>
      <table className="sc-analytics-info">
        <thead>
          <tr>
            <th>Name</th>
            <th onClick={() => handleSort('clicks')}>
              <span>
                Total <br/> clicks
                <i className={sortIndicatorClassNames(sortBy.name === 'clicks' ? sortBy.asc : null )} />
              </span>
            </th>
            <th onClick={() => handleSort('uniqClicks')}>
              <span>
                Unique <br/> clicks
                <i className={sortIndicatorClassNames(sortBy.name === 'uniqClicks' ? sortBy.asc : null )} />
              </span>
            </th>
            <th onClick={() => handleSort('plays')}>
              <span>
                Total <br/> plays
                <i className={sortIndicatorClassNames(sortBy.name === 'plays' ? sortBy.asc : null )} />
              </span>
            </th>
            <th onClick={() => handleSort('uniqPlays')}>
              <span>
                Unique <br/> plays
                <i className={sortIndicatorClassNames(sortBy.name === 'uniqPlays' ? sortBy.asc : null )} />
              </span>
            </th>
            <th onClick={() => handleSort('avgWatch')}>
              <span>
                Avg. watch <br/> duration
                <i className={sortIndicatorClassNames(sortBy.name === 'avgWatch' ? sortBy.asc : null )} />
              </span>
            </th>
          </tr>
        </thead>
        <tbody className={classNames}>
          {
            categories.map(category => (
              <CategoryItem key={category.id}
                          {...category}/>
            ))
          }
          <AnalyticsTotal />
        </tbody>
      </table>
    </div>
  );
};


export default AnalyticsCategoriesStats;
