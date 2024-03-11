import React, {
  Component,
  Fragment,
} from 'react';
import {
  connect,
} from 'react-redux';
import PropTypes from 'prop-types';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertToRaw, Modifier } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';

import withPopup from '@/hocs/withPopup';
import {
  ButtonFlat,
  ButtonNormal,
} from '@/components/Buttons';
import {
  HSeparator,
} from '@/components/Separators';

import locale from '@/api/locale';

import {
  getModalInfo,
} from '@/store/selectors/view';

import {
  updateText,
} from '@/store/actions/revisions';

import './EditTextPopup.less';

class EditTextPopup extends Component {

  constructor(props) {
    super(props);
    const contentBlock = htmlToDraft(props.modalInfo.text);
    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
    const editorState = EditorState.createWithContent(contentState);
    this.state = {
      editorState,
    };
  }

  onChange = e => {
    this.setState({
      editorState: e,
    });
  }

  onSaveClick = () => {
    const {
      modalInfo,
      updateText,
      onCloseClick,
    } = this.props;

    const {
      editorState,
    } = this.state;

    updateText({
      path: modalInfo.path,
      text: draftToHtml(convertToRaw(editorState.getCurrentContent())),
    });

    onCloseClick();
  }

  getLengthOfText = (data = this.state.editorState) => {
    const currentContent = data.getCurrentContent();
    return currentContent.getPlainText().length;
  }

  handleBeforeInput = (val) => {
    const {
      modalInfo,
    } = this.props;
    const textLength = this.state.editorState.getCurrentContent().getPlainText().length;
    if (textLength >= modalInfo.maxLength) {
      return 'handled';
    }
    return 'not-handled';
  };

  handlePastedText = val => {
        const inputLength = this.state.editorState.getCurrentContent().getPlainText().length;
        const {
          modalInfo
        } = this.props;
        let remainingLength = modalInfo.maxLength - inputLength;
        if (val.length + inputLength >= modalInfo.maxLength) {
            const newContent = Modifier.insertText(
                this.state.editorState.getCurrentContent(),
                this.state.editorState.getSelection(),
                val.slice(0,remainingLength)
            );
            this.onChange(
                EditorState.push(
                    this.state.editorState,
                    newContent,
                    "insert-characters"
                )
            );
            return true;
        } else {
            return false;
        }
    };

  render() {
    const {
      onCloseClick,
      titleText,
      modalInfo,
    } = this.props;

    const {
      editorState,
    } = this.state;

    const toolbarOptions = ['inline',
      'link'];
    if (modalInfo.modalName !== 'footer') {
      toolbarOptions.push('blockType');
    }
    const title =  titleText.split(' ')[1];
    const titleCapitalized = `${title.charAt(0).toUpperCase()}${title.slice(1)}`;
    const contentLength = this.getLengthOfText();

    return (
      <div className="sc-form-wrapper sc-edit-text sc-padding-10">
        <div className="sc-param-container">
          <label className="sc-input-label">
            {titleCapitalized} text
          </label>
          <div className="sc-characters-counter">{modalInfo.maxLength ? `${modalInfo.maxLength - contentLength}/${modalInfo.maxLength}`: contentLength} character(s)</div>
          <Editor
            editorState={editorState}
            onEditorStateChange={this.onChange}
            stripPastedStyles={true}
            handleBeforeInput={this.handleBeforeInput}
            handlePastedText={this.handlePastedText}
            toolbar={{
              options: toolbarOptions,
              inline: {
                inDropdown: false,
                options: ['bold',
                  'italic',
                  'underline'],
                bold: {
                  className: 'sc-bold-icon',
                },
                italic: {
                  className: 'sc-italic-icon',
                },
                underline: {
                  className: 'sc-underline-icon',
                },
              },
              link: {
                inDropdown: false,
                defaultTargetOption: '_blank',
                options: ['link',
                  'unlink'],
              },
              blockType: {
                options: ['Normal',
                  'H1',
                  'H2',
                  'H3',
                  'H4',
                  'H5',
                  'H6'],
              },
            }}
          />
        </div>

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
            onClick={this.onSaveClick}
          >
            {locale.getResource('Save')}
          </ButtonNormal>
        </div>
      </div>
    );
  }
}

EditTextPopup.propTypes = {
  updateText: PropTypes.func,
  onCloseClick: PropTypes.func,
  modalInfo: PropTypes.object,
  titleText: PropTypes.string,
};

const mapStateToProps = state => ({
  modalInfo: getModalInfo(state),
});

const mapDispatchToProps = {
  updateText,
};

export default connect(mapStateToProps, mapDispatchToProps)(withPopup(EditTextPopup));
