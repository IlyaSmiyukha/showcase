import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';
import {
  connect,
} from 'react-redux';

import {NotificationManager} from 'react-notifications';

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
  checkEmail,
} from '@/helpers';


import locale from '@/api/locale';

import {
  revisionGenereteCsv,
} from '@/store/actions/revisions';

import './ExportCsv.less';

const timeTypes = [
  'All',
  'Last 7 days',
  'Last 30 days',
  'Custom',
];

class ExportCsv extends Component {

  constructor(props) {
    super(props);

    const minTimeValue = props.modalInfo.createdTime * 1000;
    const maxTimeValue = Date.now();
    this.state = {
      email: '',
      period: 'All',
      time: {
        timeFrom: formatDate(minTimeValue),
        timeFromTimestamp: minTimeValue,
        timeTo: formatDate(maxTimeValue),
        timeToTimestamp: maxTimeValue,
        max: formatDate(maxTimeValue),
        min: formatDate(minTimeValue),
      },
      errors: {
        email: '',
        date: '',
      },
    };
  }

  handleChange = e => {
    const input = e.target;
    this.setState({
      [input.name]: input.value,
      errors: {
        email: '',
      },
    });
  }

  handleChangeOption = type => {
    this.setState({
      period: type,
    });
  }

  handleExport = () => {
    const {
      modalInfo,
      revisionGenereteCsv,
      group,
      onCloseClick,
    } = this.props;

    const {
      email,
      time,
      period,
    } = this.state;

    if (!email || !checkEmail(email)) {
      this.setState({
        errors: {
          ...this.state.errors,
          email: !email ? 'Please fill email!' : 'Please enter valid email!',
        },
      });
      return;
    }

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
      emails: [email],
      rfc_id: modalInfo.rfcId,
      group,
    };

    switch (period) {
      case 'Custom':
        params['time_from'] = Math.round(time.timeFromTimestamp / 1000);
        params['time_to'] = Math.round(time.timeToTimestamp / 1000);
        break;
      case 'Last 7 days':
      {
        const myDate = new Date(time.timeToTimestamp);
        const nextDate = myDate.getDate() - 7;
        params['time_from'] = Math.round(myDate.setDate(nextDate) / 1000);
        params['time_to'] = Math.round(time.timeToTimestamp / 1000);
        break;
      }
      case 'Last 30 days':
      {
        const myDate = new Date(time.timeToTimestamp);
        const nextDate = myDate.getDate() - 30;
        params['time_from'] = Math.round(myDate.setDate(nextDate) / 1000);
        params['time_to'] = Math.round(time.timeToTimestamp / 1000);
        break;
      }
    }

    revisionGenereteCsv(params);
    NotificationManager.success(`A CSV with analytics for this showcase is now generating and it will be delivered to your email.`);
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
          timeFrom: input.value,
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
      email,
      time,
      errors,
      period,
    } = this.state;

    return (
      <div className="sc-export-csv sc-csv-exporting sc-form-wrapper sc-padding-10">
        <Input
          value={email}
          type="text"
          onChange={this.handleChange}
          placeholder={'Type email here…'}
          label={'Email'}
          name="email"
        />
        {
          !!errors.email && <div className="sc-input-error">
            {errors.email}
          </div>
        }
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
                value={time.timeFrom}
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
            disabled={!email}
          >
            {locale.getResource('ExportCsv')}
          </ButtonNormal>
        </div>
      </div>
    );
  }
}

ExportCsv.propTypes = {
  revisionGenereteCsv: PropTypes.func,
  onCloseClick: PropTypes.func,
  modalInfo: PropTypes.object,
  group:  PropTypes.string,
};

const mapStateToProps = state => ({

});

const mapDispatchToProps = {
  revisionGenereteCsv,
};

export default connect(mapStateToProps, mapDispatchToProps)(withPopup(ExportCsv));
