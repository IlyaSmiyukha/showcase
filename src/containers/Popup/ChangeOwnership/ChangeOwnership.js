import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';

import {
  connect,
} from 'react-redux';

import {NotificationManager} from 'react-notifications';

import withPopup from '@/hocs/withPopup';

import {
  ButtonFlat,
  ButtonNormal,
} from '@/components/Buttons';
import locale from '@/api/locale';
import SelectComponent from '@/components/Select';

import {
  getPeopleToShare,
  getPeopleLoading,
} from '@/store/selectors/managePeople';

import {
  fetchPeopleToShare,
  changeOwnership,
} from '@/store/actions/managePeople';

import {
  HSeparator,
} from '@/components/Separators';

import './ChangeOwnership.less';

class ChangeOwnership extends Component {

  constructor(props) {
    super(props);

    this.state = {
      newOwner: '',
    };

    this.debounce = null;
  }

  getPeoples = (value) => {
    clearTimeout(this.debounce);

    this.debounce = setTimeout(() => {
      this.props.fetchPeopleToShare(value ? value : null);
    }, 400);
  }

  setUser = (value) => {
    this.setState({
      newOwner: value,
    });
  }

  clearPeopleToShare = () => {
    this.setState({
      peopleToShare: '',
    });
  }

  changeOwnership = () => {
    const {
      modalInfo,
      changeOwnership,
      group,
      onCloseClick,
      navigateTo,
    } = this.props;

    changeOwnership({
      group,
      rfc_id: modalInfo.rfcId,
      user_id: this.state.newOwner.value.user_id,
    });

    NotificationManager.success(`Ownership for ${modalInfo.rfcName} showcase was changed to ${this.state.newOwner.label}`);
    this.clearPeopleToShare();
    onCloseClick();
    setTimeout(() => navigateTo());
  }

  render() {
    const {
      onCloseClick,
      isPeopleLoading,
      peopleToShare,
      currentUserId,
    } = this.props;

    const options = peopleToShare.filter(user => user.user_id !== currentUserId).map(user => (
      {
        label: `${user.first_name} ${user.last_name} (${user.email})`,
        value: user,
      }
    ));

    return (
      <div className="sc-form-wrapper sc-manage-people sc-padding-10">
        <label className="sc-input-label">{locale.getResource('ChangeOwnershipLabel')}</label>
        <SelectComponent
          name="form-field-name"
          isClearable={false}
          onInputChange={this.getPeoples}
          isLoading={isPeopleLoading}
          options={options}
          onChange={this.setUser}
          value={this.state.newOwner}
          className={'sc-select'}
          placeholder={'Type people names or emails…'}
          noOptionsMessage={() => 'No users found'}
        />

        <HSeparator />
        <div className="sc-buttons-container">
          {
            <ButtonFlat
              className="confirmation-cancel"
              onClick={onCloseClick}
            >
              {locale.getResource('Cancel')}
            </ButtonFlat>
          }
          <ButtonNormal
            onClick={this.changeOwnership}
            disabled={!this.state.newOwner}
          >
            {locale.getResource('ChangeOwnership')}
          </ButtonNormal>
        </div>
      </div>
    );
  }
}

ChangeOwnership.propTypes = {
  onCloseClick: PropTypes.func,
  fetchPeopleToShare: PropTypes.func,
  changeOwnership: PropTypes.func,
  navigateTo:  PropTypes.func,
  peopleToShare: PropTypes.array,
  isPeopleLoading: PropTypes.bool,
  group: PropTypes.string,
  modalInfo: PropTypes.object,
  currentUserId: PropTypes.string,
};

const mapStateToProps = state => ({
  peopleToShare: getPeopleToShare(state),
  isPeopleLoading: getPeopleLoading(state),
});

const mapDispatchToProps = {
  fetchPeopleToShare,
  changeOwnership,
};

export default connect(mapStateToProps, mapDispatchToProps)(withPopup(ChangeOwnership));
