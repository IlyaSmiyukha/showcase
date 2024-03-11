import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid-random';

import {
  connect,
} from 'react-redux';

import withPopup from '@/hocs/withPopup';

import {
  ButtonFlat,
  ButtonNormal,
} from '@/components/Buttons';
import Input from '@/components/Input';
import {
  HSeparator,
} from '@/components/Separators';
import Scrollbar from '@/components/Scrollbar';

import locale from '@/api/locale';

import SvgIcon  from '@/components/SvgIcon';
import trashIcon from '@/assets/images/svg/icons/icon-trash.svg';

import {
  editFooterMenu,
} from '@/store/actions/footer';

import './FooterMenu.less';

class FooterMenu extends Component {
  constructor(props) {
    super(props);

    const {
      modalInfo,
    } = props;

    this.state = {
      name: modalInfo.name ? modalInfo.name : '',
      links:  modalInfo.links ? modalInfo.links : [{}],
      id:  modalInfo.id ? modalInfo.id : uuid(),
      actionType: modalInfo.id ? 'edit' : 'add',
      errors: {
        title: false,
        links: false,
      },
    };
  }

  handleAddNewLink = () => {
    if (this.state.links.length < 10) {
      this.setState({
        links: [...this.state.links,
          {}],
        errors: {
          title: false,
          links: false,
        },
      });
    }
  }

  handleChange = e => {
    const newText = e.target.value;
    const path = e.target.name.split('-');

    const links = [...this.state.links];

    links[path[1]] = {
      ...links[path[1]],
      [path[0]]: newText,
    };

    this.setState({
      links,
      errors: {
        title: false,
        links: false,
      },
    });
  }

  handleChangeName = e => {
    this.setState({
      name: e.target.value,
    });
  }

  handleSave = () => {
    const {
      links,
      name,
      id,
      actionType,
    } = this.state;

    const errors = links.filter(link => !link.title || !link.url);

    if (errors.length || !name) {
      this.setState({
        errors: {
          links: !!errors.length,
          name: !name,
        },
      });
      return;
    }

    this.props.editFooterMenu({
      menuItem: {
        name,
        links,
        id,
      },
      type: actionType,
    });
    this.props.onCloseClick();
  }

  handleDelete = (index) => {
    const links = [...this.state.links];
    links.splice(index, 1);

    if (links.length === 0) {
      links.push({});
    }

    this.setState({links});
  }

  handleSortItems = (index, moveTo) => {
    const links = [...this.state.links];
    const elm = links.splice(index, 1)[0];
    links.splice(moveTo, 0, elm);
    this.setState({
      links,
    });
  }

  render() {
    const {
      onCloseClick,
    } = this.props;

    const {
      links,
      name,
      errors,
    } = this.state;

    return (
      <div className="sc-form-wrapper sc-add-menu sc-add-hyperlinks">
        <Scrollbar
          autoHeight
          autoHeightMin={102}
          autoHeightMax={500}>

          <Input
            label="Menu title"
            value={name ? name : ''}
            type="text"
            onChange={this.handleChangeName}
            name="name"
            placeholder={'Type menu name here…'}
          />

          {errors.name && <div className="sc-input-error sc-name-error">
              Please fill name
          </div>}

          {
            links.map((link, i) => {
              return (
                <div className="sc-param-container" key={`form-${i}`}>
                    <div className="filter-action-buttons">
                      {
                        i !== 0 && <div className="sc-filter-move sc-filter-move-up" data-testid={`sort-up-${i}`} onClick={() => {
                          this.handleSortItems(i, i-1);
                        }} />
                      }
                      {
                        i !== links.length - 1 && <div className="sc-filter-move sc-filter-move-down" data-testid={`sort-down-${i}`} onClick={() => {
                          this.handleSortItems(i, i+1);
                        }} />
                      }
                      {
                        links.length > 1 && <div className="sc-filter-delete" data-testid={`delete-${i}`} onClick={()=> this.handleDelete(i)}>
                          <SvgIcon
                            className="sc-icon-delete"
                            data={trashIcon}
                          />
                        </div>
                      }
                    </div>

                    <Input
                      label={`Link ${i+1}`}
                      value={link.title ? link.title : ''}
                      type="text"
                      onChange={this.handleChange}
                      name={`title-${i}`}
                      placeholder={'Type link name here…'}
                    />

                    <Input
                      value={link.url ? link.url : ''}
                      type="text"
                      onChange={this.handleChange}
                      name={`url-${i}`}
                      placeholder={'Type link URL here…'}
                    />
                </div>
              );
            })
          }

          {links.length < 10 && <div className="sc-add-attachment" onClick={this.handleAddNewLink}>{locale.getResource('NewLink')}</div>}

        </Scrollbar>
        {errors.links && <div className="sc-input-error">
          {locale.getResource('FillAllFields')}
        </div>}


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
            onClick={this.handleSave}
          >
            {locale.getResource('SaveMenu')}
          </ButtonNormal>
        </div>
      </div>
    );
  }
}

FooterMenu.propTypes = {
  onCloseClick: PropTypes.func,
  editFooterMenu: PropTypes.func,
  modalInfo: PropTypes.object,
};

const mapStateToProps = state => ({

});

const mapDispatchToProps = {
  editFooterMenu,
};

export default connect(mapStateToProps, mapDispatchToProps)(withPopup(FooterMenu));
