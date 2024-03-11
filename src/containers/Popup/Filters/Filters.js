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
import SelectComponent from '@/components/Select';

import {
  getFiltersTags,
} from '@/store/selectors/filters';

import {
  addFilters,
} from '@/store/actions/filters';

import './Filters.less';

import SvgIcon  from '@/components/SvgIcon';
import trashIcon from '@/assets/images/svg/icons/icon-trash.svg';

const epmtyFilterItem = {
  name: '',
  tags: [],
};

class Filters extends Component {
  constructor(props) {
    super(props);

    const {
      modalInfo,
    } = props;
    this.state = {
      name: modalInfo.name ? modalInfo.name : '',
      id: modalInfo.id ? modalInfo.id : uuid(),
      items: modalInfo.items && modalInfo.items.length ? modalInfo.items : [{
        ...epmtyFilterItem,
        id: uuid(),
      }],
      errors: {
        name: false,
        items: false,
      },
    };
  }

  handleFilterNameChange = e => {
    const input = e.target;
    clearTimeout(this.debounce);

    this.setState({
      name: input.value,
      errors: {
        ...this.state.errors,
        name: false,
      },
    });
  }

  handleFilterItemNameChange = (e, i) => {
    const items = [...this.state.items];
    items[i].name = e.target.value;
    this.setState({
      items,
      errors: {
        ...this.state.errors,
        items: false,
      },
    });
  }

  handleTagChange = (inputValue, i) => {
    const items = [...this.state.items];
    items[i].tags = inputValue ? inputValue.map(item => item.label) : [];
    this.setState({
      items,
      errors: {
        ...this.state.errors,
        items: false,
      },
    });
  }

  addNewItem = () => {
    this.setState({
      items: [...this.state.items,
        {
          ...epmtyFilterItem,
          id: uuid(),
        }],
    });
  }

  handleSave = () => {
    const {
      name,
      items,
    } = this.state;

    const errors = items.filter(item => !item.name || !item.tags.length);

    if (!name || errors.length) {
      this.setState({
        errors: {
          name: !name,
          items: !!errors.length,
        },
      });

      return;
    }

    const filter = {...this.state};

    delete filter.errors;

    this.props.addFilters({
      filter,
      actionType: this.props.modalInfo.action,
    });
    this.props.onCloseClick();
  }

  onDeleteItemClick = index => {
    const items = [...this.state.items];
    items.splice(index, 1);
    this.setState({
      items,
    });
  }

  handleSortItems = (index, moveTo) => {
    const {items} = this.state;
    const elm = items.splice(index, 1)[0];
    items.splice(moveTo, 0, elm);
    this.setState({
      items,
    });
  }

  render() {
    const {
      onCloseClick,
      allTagsList,
    } = this.props;

    const {
      name,
      items,
      errors,
    } = this.state;

    const tagsList = allTagsList.map(tag => ({
      label: tag,
      value: tag,
    }));

    return (
      <div className="sc-form-wrapper sc-add-filters">
        <Scrollbar
          autoHeight
          autoHeightMin={220}
          autoHeightMax={500}>

          <div className="sc-filter-name">
            <Input
              label={`Filter name`}
              value={name}
              type="text"
              onChange={this.handleFilterNameChange}
              placeholder={'Type filter name here…'}
            />
          </div>

          {
            errors.name && <div className="sc-input-error">
              {locale.getResource('FillFilterName')}
            </div>
          }

          {
            items.map((item, i) => <div className="sc-filter-option" key={item.id}>

              <div className="filter-action-buttons">
                {
                  i !== 0 && <div className="sc-filter-move sc-filter-move-up" data-testid={`sort-up-${i}`} onClick={() => {
                    this.handleSortItems(i, i-1);
                  }} />
                }
                {
                  i !== items.length - 1 && <div className="sc-filter-move sc-filter-move-down" data-testid={`sort-down-${i}`} onClick={() => {
                    this.handleSortItems(i, i+1);
                  }} />
                }
                {
                  items.length > 1 && <div className="sc-filter-delete" data-testid={`delete-${i}`} onClick={()=> this.onDeleteItemClick(i)}>
                    <SvgIcon
                      className="sc-icon-delete"
                      data={trashIcon}
                    />
                  </div>
                }
              </div>


              <Input
                label={`Filter item ${i + 1}`}
                value={item.name}
                type="text"
                onChange={(e) => this.handleFilterItemNameChange(e, i)}
                placeholder={'Type name for this item…'}
              />


              <SelectComponent
                options={tagsList}
                isMulti={true}
                isSearchable={true}
                isClearable={false}
                value={item.tags.map(tag => ({
                  label: tag,
                  value: tag,
                }))}
                onChange={value => this.handleTagChange(value, i)}
                placeholder={locale.getResource('FilterTagsPlaceholder')}
                className={'sc-select'}
                noOptionsMessage={() => 'No tags found'}
              />
            </div>)
          }

          {
            errors.items && <div className="sc-input-error">
              {locale.getResource('FillAllFields')}
            </div>
          }

          {items.length < 30 && <div className="sc-add-attachment" onClick={this.addNewItem}>+ Add new filter item</div>}


        </Scrollbar>

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
            {locale.getResource('SaveFilters')}
          </ButtonNormal>
        </div>
      </div>
    );
  }
}

Filters.propTypes = {
  onCloseClick: PropTypes.func,
  addFilters: PropTypes.func,
  modalInfo: PropTypes.object,
  allTagsList: PropTypes.array,
  action: PropTypes.string,
};

const mapStateToProps = state => ({
  allTagsList: getFiltersTags(state),
});

const mapDispatchToProps = {
  addFilters,
};

export default connect(mapStateToProps, mapDispatchToProps)(withPopup(Filters));
