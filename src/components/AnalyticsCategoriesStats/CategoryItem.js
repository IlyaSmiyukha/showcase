import React, {
  useEffect,
  useState
} from 'react';

import {
  formatDuration
} from '@/helpers';

import locale from '@/api/locale';

const CategoryItem = ({
  title,
  items,
  total,
}) =>  {

  return (
      <tr>
        <td>
          {title}
          <span>{items.length} {items.length === 1 ? 'card' : 'cards'}</span>
        </td>
        <td>{total.clicks} <span>({total.clicksPersent}%)</span></td>
        <td>{total.uniqClicks} <span>({total.uniqClicksPersent}%)</span></td>
        <td>{total.plays}</td>
        <td>{total.uniqPlays}</td>
        <td>{formatDuration(total.avgWatch)}</td>
      </tr>
  );
};

export default CategoryItem;
