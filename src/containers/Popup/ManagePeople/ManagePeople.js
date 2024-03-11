import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';

import {
  connect,
} from 'react-redux';

import withPopup from '@/hocs/withPopup';

import {
  ButtonFlat,
  ButtonNormal,
} from '@/components/Buttons';
import SelectComponent from '@/components/Select';
import locale from '@/api/locale';
import EditorsTable from '@/components/EditorsTable';

import {
  getEditors,
  getPeopleToShare,
  getPeopleLoading,
} from '@/store/selectors/managePeople';

import {
  fetchPeopleToShare,
  permisionEdit,
} from '@/store/actions/managePeople';

import './ManagePeople.less';


class ManagePeople extends Component {

  constructor(props) {
    super(props);

    this.state = {
      peopleToShare: null,
    };

    this.debounce = null;
  }

  getPeoples = (value) => {
    clearTimeout(this.debounce);

    this.debounce = setTimeout(() => {
      this.props.fetchPeopleToShare(value ? value : null);
    }, 400);
  }

  clearPeopleToShare = () => {
    this.setState({
      peopleToShare: null,
    });
  }

  setUser = (value) => {
    this.setState({
      peopleToShare: value,
    });
  }

  permisionEdit = (operation, userId) => {
    const {
      peopleToShare,
    } = this.state;

    const {
      permisionEdit,
      rfcId,
    } = this.props;

    permisionEdit({
      operation,
      users: userId ? [{user_id: userId}] : peopleToShare.map(user => user.value),
      id: rfcId,
    });

    this.clearPeopleToShare();
  }

  render() {
    const {
      onCloseClick,
      editors,
      isPeopleLoading,
      peopleToShare,
    } = this.props;

    const options = peopleToShare.filter(person => !editors.find(editor => person.user_id === editor.user_id)).map(user => (
      {
        label: `${user.first_name} ${user.last_name} (${user.email})`,
        value: user,
      }
    ));

    return (
      <div className="sc-form-wrapper sc-manage-people sc-padding-10">
        <label className="sc-input-label">{locale.getResource('PeopleInvite')}</label>
        <SelectComponent
          name="form-field-name"
          isMulti={true}
          isClearable={false}
          onInputChange={this.getPeoples}
          isLoading={isPeopleLoading}
          options={options}
          onChange={this.setUser}
          value={this.state.peopleToShare}
          className={'sc-select'}
          placeholder={'Type people names or emails…'}
          noOptionsMessage={() => 'No results found'}
        />
        <div className="sc-buttons-container">
          {
            (this.state.peopleToShare && !!this.state.peopleToShare.length) &&   <ButtonFlat
              className="confirmation-cancel"
              onClick={this.clearPeopleToShare}
              disabled={!this.state.peopleToShare}
            >
              {locale.getResource('Cancel')}
            </ButtonFlat>
          }
          <ButtonNormal
            onClick={() => this.permisionEdit('add')}
            disabled={!this.state.peopleToShare || !this.state.peopleToShare.length}
          >
            Send invite
          </ButtonNormal>
        </div>


        <label className="sc-input-label">{locale.getResource('PeopleEdit')}</label>
        <EditorsTable editors={editors} permisionEdit={this.permisionEdit}/>

        <div className="sc-buttons-container">
          <ButtonFlat
            className="confirmation-cancel"
            onClick={onCloseClick}
          >
            {locale.getResource('Done')}
          </ButtonFlat>
        </div>
      </div>
    );
  }
}

ManagePeople.propTypes = {
  onCloseClick: PropTypes.func,
  fetchPeopleToShare: PropTypes.func,
  permisionEdit: PropTypes.func,
  editors: PropTypes.array,
  peopleToShare: PropTypes.array,
  isPeopleLoading: PropTypes.bool,
  rfcId: PropTypes.string,
};

const mapStateToProps = state => ({
  editors: getEditors(state),
  peopleToShare: getPeopleToShare(state),
  isPeopleLoading: getPeopleLoading(state),
});

const mapDispatchToProps = {
  fetchPeopleToShare,
  permisionEdit,
};

export default connect(mapStateToProps, mapDispatchToProps)(withPopup(ManagePeople));
