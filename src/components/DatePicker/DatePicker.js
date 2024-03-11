import React, {
  useState,
} from 'react';

import PropTypes from 'prop-types';

import {
  formatDate,
  formatTime,
} from '@/helpers';

import './DatePicker.less';

const DatePicker = props =>  {
  const {
    timestamp,
    handlePublishedChange,
  } = props;

  const [
    time,
    setTime,
  ] = useState(formatTime(timestamp));

  const [
    date,
    setDate,
  ] = useState(formatDate(timestamp));

  const setCardPublishedDate = (date, time) => {
    const timeArr = time.split(':');
    const dateArr = date.split('-');
    const newDate = new Date(+dateArr[0], dateArr[1] - 1, +dateArr[2], +timeArr[0], +timeArr[1]);
    handlePublishedChange(Date.parse(newDate));
  };

  const onTimeChange = e => {
    const time = e.target.value;
    setTime(time);
    setCardPublishedDate(date, time);
  };

  const onDateChange = e => {
    const date = e.target.value;
    setDate(date);
    setCardPublishedDate(date, time);
  };



  return (
    <div className="sc-date-picker-wrap">
      <div className="sc-date-picker-item sc-date-picker-date">
        <label className="sc-input-label" htmlFor="published">Published date</label>

        <input
          type="date"
          className="sc-input"
          value={date}
          onChange={onDateChange}
          name={'published'}
          id={'published'}/>
      </div>

      <div className="sc-date-picker-item sc-date-picker-time">
        <input
          type="time"
          className="sc-input"
          value={time}
          onChange={onTimeChange}
          name={'published'}
          id={'published'}/>
      </div>
    </div>
  );
};

DatePicker.propTypes = {
  timestamp: PropTypes.number,
  handlePublishedChange: PropTypes.func,
};

export default DatePicker;
