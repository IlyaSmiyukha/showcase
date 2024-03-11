import React, {
  Fragment,
  Component,
} from 'react';
import PropTypes from 'prop-types';

import {
  connect,
} from 'react-redux';

import withPopup from '@/hocs/withPopup';

import {
  ButtonNormal,
} from '@/components/Buttons';
import {
  HSeparator,
} from '@/components/Separators';
import locale from '@/api/locale';

import {
  getEditors,
} from '@/store/selectors/managePeople';

import './SomeoneEditing.less';

class SomeoneEditing extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {
      onCloseClick,
      editors,
      modalInfo,
      currentUserId,
    } = this.props;

    const currentEditor = editors.find(editor => modalInfo.editorId ?
      editor.user_id === modalInfo.editorId && editor.user_id !== currentUserId
      : editor.user_id !== currentUserId && editor.status === 'online');

    return (
      <div className="sc-form-wrapper sc-editing sc-padding-10">
        {  modalInfo.editorId ? <Fragment>
          <p>
            <span>
              {currentEditor && currentEditor.first_name} {currentEditor && currentEditor.last_name} ({currentEditor && currentEditor.email})
            </span>
            {locale.getResource('PersonJoined')}
          </p>
          <ol>
            <li>{locale.getResource('SaveShowcase')}</li>
            <li>{locale.getResource('GetInTouch')}</li>
          </ol>
        </Fragment> : <Fragment>
          <p>
            <span>
              {currentEditor.first_name} {currentEditor.last_name} ({currentEditor.email})
            </span>
            {locale.getResource('PersonEditing')}
          </p>
          <ol>
            <li>{locale.getResource('CloseEditor')}</li>
            <li>{locale.getResource('GetInTouch')}</li>
          </ol>
        </Fragment>
        }

        <HSeparator />

        <div className="sc-buttons-container">
          <ButtonNormal
            className="confirmation-yes"
            onClick={onCloseClick}
          >
            OK
          </ButtonNormal>
        </div>
      </div>
    );
  }
}

SomeoneEditing.propTypes = {
  onCloseClick: PropTypes.func,
  editors: PropTypes.array,
  modalInfo: PropTypes.object,
  currentUserId: PropTypes.string,
};

const mapStateToProps = state => ({
  editors: getEditors(state),
});


export default connect(mapStateToProps)(withPopup(SomeoneEditing));
