import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';
import {
  connect,
} from 'react-redux';

import withPopup from '@/hocs/withPopup';
import Radio from '@/components/Radio';
import {
  ButtonFlat,
  ButtonNormal,
} from '@/components/Buttons';
import Input from '@/components/Input';
import {
  HSeparator,
} from '@/components/Separators';

import {
  formatDate,
} from '@/helpers';

import locale from '@/api/locale';

import {
  setAnalyticsDate,
} from '@/store/actions/analytics';
import { getSelectedDate } from '@/store/selectors/analytics'

const timeTypes = [
  'All',
  'Last 7 days',
  'Last 30 days',
  'Custom',
];

class AnalyticsDate extends Component {
  constructor(props) {
    super(props);
    const minTimeValue = props.modalInfo.created * 1000;
    const maxTimeValue = Date.now();
    this.state = {
      period: props.date.title,
      time: {
        timeFrom: formatDate(props.date.timeFrom * 1000),
        timeFromTimestamp: props.date.timeFrom * 1000,
        timeTo: formatDate(props.date.timeTo * 1000),
        timeToTimestamp: maxTimeValue,
        max: formatDate(maxTimeValue),
        min: formatDate(minTimeValue),
        customDateStart: formatDate(props.date.title === 'Custom' ? props.date.timeFrom * 1000 : minTimeValue)
      },
      errors: {
        date: '',
      },
    };
  }

  handleChangeOption = type => {
    this.setState({
      period: type,
    });
  }

  handleExport = () => {
    const {
      modalInfo,
      onCloseClick,
      setAnalyticsDate
    } = this.props;

    const {
      time,
      period,
    } = this.state;

    if (time.timeFromTimestamp > time.timeToTimestamp) {
      this.setState({
        errors: {
          ...this.state.errors,
          date:  'Please enter correct date!',
        },
      });
      return;
    }

    const params = {
      title: period
    };

    switch (period) {
      case 'Custom':
        params['timeFrom'] = Math.round(time.timeFromTimestamp / 1000);
        params['timeTo'] = Math.round(time.timeToTimestamp / 1000);
        break;
      case 'Last 7 days':
      {
        const myDate = new Date(time.timeToTimestamp);
        const nextDate = myDate.getDate() - 7;
        params['timeFrom'] = Math.round(myDate.setDate(nextDate) / 1000);
        params['timeTo'] = Math.round(time.timeToTimestamp / 1000);
        break;
      }
      case 'Last 30 days':
      {
        const myDate = new Date(time.timeToTimestamp);
        const nextDate = myDate.getDate() - 30;
        params['timeFrom'] = Math.round(myDate.setDate(nextDate) / 1000);
        params['timeTo'] = Math.round(time.timeToTimestamp / 1000);
        break;
      }
      case 'All':
      {
        params['timeFrom'] = modalInfo.created;
        params['timeTo'] = Math.round(Date.now() / 1000);
        break;
      }
    }
    setAnalyticsDate(params)
    onCloseClick();
  }

  getMaxTimeForStart = () => {
    const myDate = new Date(this.state.time.timeToTimestamp);
    const nextDate = myDate.getDate() - 1;
    return myDate.setDate(nextDate);
  }

  getMinTimeForEnd = () => {
    const myDate = new Date(this.state.time.timeFromTimestamp);
    const nextDate = myDate.getDate() + 1;
    return myDate.setDate(nextDate);
  }

  handleTimeChange = (e) => {
    const input = e.target;
    if (input.name === 'timeFrom') {
      this.setState({
        time: {
          ...this.state.time,
          customDateStart: input.value,
          timeFromTimestamp: input.valueAsNumber,
        },
      });
    } else {
      this.setState({
        time: {
          ...this.state.time,
          timeTo: input.value,
          timeToTimestamp: input.valueAsNumber,
        },
      });
    }
  }

  render() {
    const {
      onCloseClick,
    } = this.props;

    const {
      time,
      errors,
      period,
    } = this.state;

    return (
      <div className="sc-export-csv sc-csv-exporting sc-form-wrapper sc-padding-10">
        <label className="sc-input-label">Period</label>
        {
          timeTypes.map(name =>(
            <Radio
              key={`period-${name}`}
              disabled={false}
              defaultChecked={period === name}
              id={`publish-option-${name}`}
              name={`publish-option`}
              value={name}
              onChange={() => {
                this.handleChangeOption(name);
              }}>
              {name}
            </Radio>
          ))
        }

        {
          period === 'Custom' &&  <div className="sc-date-picker">
            <div className="sc-date-picker-item">
              <label className="sc-input-label" htmlFor="timeFrom">Time from</label>
              <input
                type="date"
                className="sc-input"
                value={time.customDateStart}
                onChange={this.handleTimeChange}
                name={'timeFrom'}
                min={time.min}
                max={formatDate(this.getMaxTimeForStart())}
                id={'timeFrom'}/>
            </div>
            <div className="sc-date-picker-item">
              <label className="sc-input-label"  htmlFor="timeTo">Time to</label>
              <input
                type="date"
                className="sc-input"
                value={time.timeTo}
                name={'timeTo'}
                onChange={this.handleTimeChange}
                min={formatDate(this.getMinTimeForEnd())}
                max={time.max}
                id={'timeTo'}/>
            </div>
          </div>
        }
        {
          !!errors.date && <div className="sc-input-error">
            {errors.date}
          </div>
        }

        <HSeparator />

        <div className="sc-buttons-container">
          <ButtonFlat
            className="confirmation-cancel"
            onClick={onCloseClick}
          >
            {locale.getResource('Cancel')}
          </ButtonFlat>

          <ButtonNormal
            className="confirmation-yes"
            onClick={this.handleExport}
          >
            {locale.getResource('ChooseDate')}
          </ButtonNormal>
        </div>
      </div>
    );
  }
}

AnalyticsDate.propTypes = {
  revisionGenereteCsv: PropTypes.func,
  onCloseClick: PropTypes.func,
  modalInfo: PropTypes.object,
  group:  PropTypes.string,
};

const mapStateToProps = state => ({
  date: getSelectedDate(state)
});

const mapDispatchToProps = {
  setAnalyticsDate,
};

export default connect(mapStateToProps, mapDispatchToProps)(withPopup(AnalyticsDate));
