import * as React from 'react';
import PropTypes from 'prop-types';

import './PublishedDate.less';

const PublishedDate = props => {

  const {
    timestamp,
  } = props;

  const formatDate = () => {
    const monthList = ['January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'];
    const a = new Date(timestamp);
    const year = a.getFullYear();
    const month = a.getMonth();
    const date = a.getDate();
    const time = a.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    const convertedDate = `${monthList[month]} ${date}, ${year} - ${time}`;
    return convertedDate;
  };

  const date = timestamp ? formatDate() : '';

  return (
    <div className="sc-tile-published">
      {date}
    </div>
  );
};

PublishedDate.propTypes = {
  timestamp: PropTypes.number,
};

export default PublishedDate;
