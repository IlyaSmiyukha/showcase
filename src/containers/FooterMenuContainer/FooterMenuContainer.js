import React, {
  Component,
} from 'react';

import {
  connect,
} from 'react-redux';
import PropTypes from 'prop-types';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import locale from '@/api/locale';

import AddItem from '@/components/AddItem';
import FooterMenu from '@/components/FooterMenu';

import {
  getFooter,
} from '@/store/selectors/footer';

import {
  showFooterMenuPopup,
} from '@/store/actions/view';

import {
  deleteFooterMenu,
  sortFooterMenu,
} from '@/store/actions/footer';

import {
  reorder,
} from '@/helpers';

import './FooterMenuContainer.less';

class  FooterMenuContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      menu: props.footer.menu || [],
    };
  }

  addNewItem = () => {
    this.props.showFooterMenuPopup();
  };

  editItem = (item) => {
    this.props.showFooterMenuPopup(item);
  };

  deleteItem = id => {
    this.props.deleteFooterMenu(id);
  };

  onDragEnd = (result) => {
    // dropped outside the list
    const {
      menu,
    } = this.state;

    if (!result.destination) {
      return;
    }

    const newMenu = reorder(menu, result.source.index, result.destination.index);
    this.props.sortFooterMenu(newMenu);
  };

  componentDidUpdate() {
    if (this.props.footer.menu !== this.state.menu) {
      this.setState({
        menu: this.props.footer.menu,
      });
    }
  }

  render() {

    const {
      menu,
    } = this.state;

    return (
      <div className="sc-footer-menu-wrap">
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable" direction="horizontal">
            {
              (provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="sc-footer-menu-list"
                >
                  {
                    menu.map((item, i) => (
                      <Draggable key={item.id} draggableId={item.id} index={i}>
                        {
                          (provided) => (
                            <div ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}>
                              <FooterMenu
                                menu={item}
                                onClick={this.editItem}
                                onDeleteClick={this.deleteItem} />
                            </div>
                          )
                        }
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )
            }
          </Droppable>
        </DragDropContext>
        {(!menu ||  menu && menu.length < 4) && <AddItem onClick={this.addNewItem} text={locale.getResource('AddFooterMenu')}/>}
      </div>
    );
  }

};

FooterMenuContainer.propTypes = {
  footer: PropTypes.object,
  showFooterMenuPopup: PropTypes.func,
  deleteFooterMenu: PropTypes.func,
  sortFooterMenu: PropTypes.func,
};

const mapStateToProps = state => ({
  footer: getFooter(state),
});

const mapDispatchToProps = {
  showFooterMenuPopup,
  deleteFooterMenu,
  sortFooterMenu,
};

export default connect(mapStateToProps, mapDispatchToProps)(FooterMenuContainer);
