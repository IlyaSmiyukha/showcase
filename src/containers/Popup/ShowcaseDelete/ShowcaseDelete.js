import React, {
  Component,
} from 'react';

import {
  connect,
} from 'react-redux';

import withPopup from '@/hocs/withPopup';
import PropTypes from 'prop-types';

import {
  ButtonFlat,
  ButtonNormal,
} from '@/components/Buttons';

import locale from '@/api/locale';

import {
  HSeparator,
} from '@/components/Separators';

import {
  deleteRfc,
} from '@/store/actions/rfc';

class ShowcaseDelete extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  handleDelete = () => {
    this.props.deleteRfc(this.props.modalInfo.rfcId);
    this.props.onCloseClick();
  }

  render() {
    const {
      onCloseClick,
    } = this.props;
    return (
      <div className="sc-padding-10">
        <div className="description">{locale.getResource('ShowcaseDelete')}</div>
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
            onClick={this.handleDelete}
          >
            Delete
          </ButtonNormal>
        </div>
      </div>
    );
  }
}

ShowcaseDelete.propTypes = {
  modalInfo: PropTypes.object,
  deleteRfc: PropTypes.func,
  onCloseClick: PropTypes.func,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  deleteRfc,
};

export default connect(mapStateToProps, mapDispatchToProps)(withPopup(ShowcaseDelete));
