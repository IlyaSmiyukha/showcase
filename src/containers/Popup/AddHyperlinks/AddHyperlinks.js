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
import Input from '@/components/Input';
import {
  HSeparator,
} from '@/components/Separators';
import Scrollbar from '@/components/Scrollbar';

import locale from '@/api/locale';

import {
  getHyperlinks,
} from '@/store/selectors/header';

import {
  updateHyperlinks,
} from '@/store/actions/header';

import './AddHyperlinks.less';
import SvgIcon  from '@/components/SvgIcon';
import trashIcon from '@/assets/images/svg/icons/icon-trash.svg';
import addIcon from '@/assets/images/svg/icons/icon-add.svg';



class AddHyperlinks extends Component {

  constructor(props) {
    super(props);
    this.state = {
      links: [],
      errors: false,
    };
  }

  componentDidMount() {
    const {
      hyperlinks,
    } = this.props;

    if (hyperlinks && hyperlinks.length) {
      this.setState({
        links: [...hyperlinks],
      });
    } else {
      this.setState({
        links: [{}],
      });
    }
  }

  handleAddNewLink = () => {
    if (this.state.links.length < 6) {
      this.setState({
        links: [...this.state.links,
          {}],
        errors: false,
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
      errors: false,
    });
  }

  handleSave = () => {
    const {
      links,
    } = this.state;

    const errors = links.filter(link => !link.title || !link.url);
    if (errors.length && links[0].title) {
      this.setState({
        errors: true,
      });
      return;
    }

    this.props.updateHyperlinks(links[0].title ? links : []);
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
      errors,
    } = this.state;

    return (
      <div className="sc-form-wrapper sc-add-hyperlinks">
        <Scrollbar
          autoHeight
          autoHeightMin={102}
          autoHeightMax={500}>
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
                      <div className="sc-filter-delete" data-testid={`delete-${i}`} onClick={()=> this.handleDelete(i)}>
                        <SvgIcon
                          className="sc-icon-delete"
                          data={trashIcon}
                        />
                      </div>
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

        </Scrollbar>
        {errors && <div className="sc-input-error">
          {locale.getResource('FillAllFields')}
        </div>}

        {links.length < 6 && <div className="btn-wrap">
          <ButtonNormal
            className="confirmation-yes sc-button-plus"
            onClick={this.handleAddNewLink}
            testId="add-btn"
          >
            <SvgIcon
              className="add-icon"
              data={addIcon}
            />
          </ButtonNormal>
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
            {locale.getResource('SaveMenuItems')}
          </ButtonNormal>
        </div>
      </div>
    );
  }
}

AddHyperlinks.propTypes = {
  onCloseClick: PropTypes.func,
  updateHyperlinks: PropTypes.func,
  hyperlinks: PropTypes.array,
};

const mapStateToProps = state => ({
  hyperlinks: getHyperlinks(state),
});

const mapDispatchToProps = {
  updateHyperlinks,
};

export default connect(mapStateToProps, mapDispatchToProps)(withPopup(AddHyperlinks));
