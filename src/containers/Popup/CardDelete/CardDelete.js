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
  deleteItem,
} from '@/store/actions/categories';

import './CardDelete.less';

class CardDelete extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  handleDelete = () => {
    const {
      deleteItem,
      modalInfo,
    } = this.props;
    deleteItem(modalInfo.categoryId, modalInfo.cardId, modalInfo.index);
    this.props.onCloseClick();
  }

  render() {
    const {
      onCloseClick,
      modalInfo
    } = this.props;
    return (
      <div className="sc-padding-10">
        <div className="description">{locale.getResource('cardDelete')}</div>
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

CardDelete.propTypes = {
  modalInfo: PropTypes.object,
  deleteItem: PropTypes.func,
  onCloseClick: PropTypes.func,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  deleteItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(withPopup(CardDelete));
