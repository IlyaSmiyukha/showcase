import React, {
  PureComponent,
} from 'react';

import PropTypes from 'prop-types';
import uuid from 'uuid-random';

import Input from '@/components/Input';

import SvgIcon from '@/components/SvgIcon/SvgIcon';
import trashIcon from '@/assets/images/svg/icons/icon-trash.svg';

import './Attachments.less';

const emptyItem = {
  name: '',
  type: '',
  url: '',
};

class Attachments extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      attachments: props.attachments.length ? props.attachments : [],
    };
  }

  handleChange = (e, index) => {
    const attachments = [...this.state.attachments];
    const input = e.target;
    attachments[index] = {
      ...attachments[index],
      [input.name]: input.value,
    };
    this.setState({
      attachments,
    });
  }

  addNewAttachment = () => {
    this.setState({
      attachments: [
        ...this.state.attachments,
        {
          ...emptyItem,
          id:  uuid(),
        },
      ],
    });
  }

  deleteAttachment = (index) => {
    const attachments = [...this.state.attachments];
    attachments.splice(index, 1);
    this.props.updateAttachments(attachments);
    this.setState({
      attachments,
    });
  }

  componentDidUpdate() {
    this.props.updateAttachments(this.state.attachments);
  }

  render() {
    const {
      attachments,
    } = this.state;
    return (
      <div className="sc-attachments-form">
        <label className="sc-input-label">Attachments</label>
        {attachments && attachments.map((item, i) => (
          <div className="sc-attachment-item" key={item.id}>
            <label className="sc-attachment-label">Attachment {i + 1}</label>
            <Input
              value={item.name}
              type="text"
              onChange={e => (this.handleChange(e, i))}
              placeholder={'Type attachment title here…'}
              name="name"
              classNames={'sc-attachment-name'}
            />
            <Input
              value={item.url}
              type="text"
              onChange={e => (this.handleChange(e, i))}
              placeholder={'Type attachment url here…'}
              name="url"
            />
            <Input
              value={item.type}
              type="text"
              onChange={e => (this.handleChange(e, i))}
              placeholder={'Type attachment type here…'}
              name="type"
            />
            <button
              className="sc-delete-button"
              onClick={() => this.deleteAttachment(i)}
              role={'button'}
            >
              <SvgIcon
                data={trashIcon}
                className={'icon-trash'}
              />
            </button>
          </div>
        ))}
        {attachments.length < 10 && <div className="sc-add-attachment" onClick={this.addNewAttachment}>+ Add new attachment</div>}
      </div>
    );
  }
}

Attachments.propTypes = {
  attachments: PropTypes.array,
  updateAttachments: PropTypes.func,
};

export default Attachments;
