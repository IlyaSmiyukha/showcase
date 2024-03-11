import React from 'react';
import classnames from 'classnames';

import {
  formatDuration
} from '@/helpers';

import locale from '@/api/locale';

const CardItem = ({
  thumb,
  name,
  type,
  total_clicks,
  unique_clicks,
  total_plays,
  unique_plays,
  average_watch,
  total,
}) => {
  const showPlays = type === 'video' || type === 'performance' || type === 'audio';
  const classNamePreview = classnames({
    'sc-analytics-img-wrapper': true,
    'sc-analytics-document': !showPlays,
    'sc-analytics-webpage': type === 'link',
    'sc-analytics-project': type === 'project',
  });

  return (
      <tr>
        <td>
          <div className='sc-analytics-card-info'>
            <div className={classNamePreview}>
              {thumb && <img src={thumb}/>}
            </div>
            <div>
              {name} <br/>
              <span className='sc-card-type'>{type}</span>
            </div>
          </div>
        </td>
        <td>{total_clicks || 0} <span>({total_clicks ?  (total_clicks / total.clicks * 100).toFixed(2) : 0}%)</span></td>
        <td>{unique_clicks || 0} <span>({unique_clicks ? (unique_clicks / total.uniqClicks * 100).toFixed(2) : 0}%)</span></td>
        <td>{ showPlays ? total_plays || 0 : '' }</td>
        <td>{ showPlays ? unique_plays || 0 : '' }</td>
        <td>{ showPlays ? formatDuration(showPlays ? average_watch || 0 : '') : '' }</td>
      </tr>
  );
};

export default CardItem;
