import React, {
  useState,
  useEffect
} from 'react';

import { useSelector } from 'react-redux';
import classnames from 'classnames';

import locale from '@/api/locale';

import {
  getCards,
  getTotalAnalyticsStats,
  getIsCategoriesLoading
} from '@/store/selectors/analytics';

import {
  getCardsInfo,
} from '@/store/selectors/categories';

import {
  getFiles
} from '@/store/selectors/files';

import CardItem from './CardItem'

import {
  getFileType
} from '@/helpers';

import SvgIcon from '@/components/SvgIcon';
import AnalyticsTotal from '@/components/AnalyticsTotal';
import iconArrow from '@/assets/images/svg/icons/icon-arrow.svg';

import './AnalyticsCardsStats.less';

const AnalyticsCardsStats = props =>  {
  const cardsAnalytics = useSelector(state => getCards(state));
  const cardsCategoryInfo = useSelector(state => getCardsInfo(state));
  const files = useSelector(state => getFiles(state));
  const total = useSelector(state => getTotalAnalyticsStats(state));
  const isLoading = useSelector(state => getIsCategoriesLoading(state));

  const [cardTotalObject, setCardTotalObject] = useState([]);
  const [sortBy, setSortBy] = useState({
    name: '',
    asc: false
  });

  const getThumb = (fileId) => {

    const currentFile = files[fileId];

    const thumb = _.get(currentFile, 'urls.thumbs.640x360.status') !== 'failed' && _.get(currentFile, 'urls.thumbs.640x360.url')
      || _.get(currentFile, 'urls.thumbs.400.status') !== 'failed' && _.get(currentFile, 'urls.thumbs.400.url')
      || _.get(currentFile, 'urls.thumbs.300x225.status') !== 'failed' && _.get(currentFile, 'urls.thumbs.300x225.url');

    return thumb
  }

  const handleSort = (name) => {
    if (cardTotalObject.length) {
      setSortBy({
        name,
        asc: name === sortBy.name ?  !sortBy.asc : false
      })
    }
  }

  useEffect(() => {
    const sortedCards = _.orderBy(cardTotalObject, [sortBy.name], [sortBy.asc ? 'asc' : 'desc']);
    setCardTotalObject(sortedCards)
  }, [sortBy]);


  useEffect(() => {
    const totalCardsObject = [];
    Object.keys(cardsCategoryInfo).forEach((id, i) => {
      const file = files[cardsCategoryInfo[id].file_id] || {};

      let fullCard = {
        ...cardsCategoryInfo[id],
        name: cardsCategoryInfo[id].name || file.name,
        type: file.type ?  getFileType(file) : 'link',
      };

      fullCard['thumb'] = getThumb(fullCard.thumbnail ? fullCard.thumbnail.file_id : file.file_id)

      if (cardsAnalytics[id]) {
        fullCard = {
          ...fullCard,
          ...cardsAnalytics[id]
        }
      }
      totalCardsObject.push(fullCard)
    });

    setCardTotalObject(totalCardsObject)
  }, [cardsAnalytics]);

  const cardIds = Object.keys(cardTotalObject);

  const classNames = classnames({
    'sc-analytics-loading': isLoading
  });

  const sortIndicatorClassNames = (asc) => (classnames({
    'sc-sort-indicator': true,
    asc: asc,
    desc: asc !== null && !asc,
  }));

  return (
    <div className="sc-analytics-block" >
      <div className="sc-analytics-title" >
        <h3>{locale.getResource('CardsStats')}</h3>
      </div>
      <table className="sc-analytics-info">
        <thead>
          <tr>
            <th>Name</th>
            <th onClick={() => handleSort('total_clicks')}>
              <span>
                Total <br/> clicks
                <i className={sortIndicatorClassNames(sortBy.name === 'total_clicks' ? sortBy.asc : null )} />
              </span>
            </th>
            <th onClick={() => handleSort('unique_clicks')}>
              <span>
                Unique <br/> clicks
                <i className={sortIndicatorClassNames(sortBy.name === 'unique_clicks' ? sortBy.asc : null )} />
              </span>
            </th>
            <th onClick={() => handleSort('total_plays')}>
              <span>
                Total <br/> plays
                <i className={sortIndicatorClassNames(sortBy.name === 'total_plays' ? sortBy.asc : null )} />
              </span>
            </th>
            <th onClick={() => handleSort('unique_plays')}>
              <span>
                Unique <br/> plays
                <i className={sortIndicatorClassNames(sortBy.name === 'unique_plays' ? sortBy.asc : null )} />
              </span>
            </th>
            <th onClick={() => handleSort('average_watch')}>
              <span>
                Avg. watch <br/> duration
                <i className={sortIndicatorClassNames(sortBy.name === 'average_watch' ? sortBy.asc : null )} />
              </span>
            </th>
          </tr>
        </thead>
        <tbody className={classNames}>
          {
            cardTotalObject.length ?
            cardTotalObject.map(card => <CardItem {...card} isLoading={isLoading} key={card.card_id} total={total}/>)
            : <tr><td className="sc-analytics-no-cards"><span> No cards available </span></td></tr>
          }
          <AnalyticsTotal />
        </tbody>
      </table>
    </div>
  );
};


export default AnalyticsCardsStats;
