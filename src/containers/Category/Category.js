import React, {
  PureComponent,
  Fragment,
} from 'react';

import {
  connect,
} from 'react-redux';

import PropTypes from 'prop-types';

import locale from '@/api/locale';

import EditorItemText from '@/components/EditorItemText';
import FileTile from '@/components/FileTile';
import AddVideo from '@/components/AddVideo';
import Dropdown from '@/components/Dropdown';
import SliderArrow from '@/components/SliderArrow';

import SvgIcon from '@/components/SvgIcon';
import moreIcon from '@/assets/images/svg/icons/icon-more.svg';

import {
  ButtonNormal,
} from '@/components/Buttons';

import {
  Droppable,
  Draggable,
} from 'react-beautiful-dnd';

import {
  deleteCategory,
} from '@/store/actions/categories';

import {
  showWithCapsPopup,
  showWebItemPopup,
  showEditItemPopup,
  showDeleteCardPopup,
  showAddFilePopup
} from '@/store/actions/view';

import {
  deleteColumn
} from '@/store/actions/layout';

import {
  getPlaceholderProps,
} from '@/store/selectors/view';

import {
  getFiles,
  getUploadingState,
  getProcessingState,
} from '@/store/selectors/files';

import './Category.less';

function getStyle(style, snapshot) {
  if (!snapshot.isDragging) {
    return {};
  }
  if (!snapshot.isDropAnimating) {
    return style;
  }

  return {
    ...style,
    transitionDuration: '0.001s',
  };
}

const getItemStyle = (isDragging, draggableStyle, translate) => {
  return {
    userSelect: 'none',
    ...draggableStyle,
    transform: draggableStyle.transform && !draggableStyle.width ?  `translate(${translate}px, 0)` : draggableStyle.transform
  };
};

class Category extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hideLeft: true,
      hideRight: true,
      items: [],
      filesList: {},
    };

    this.scrollable = React.createRef();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.filesList !== nextProps.filesList) {
      return {
        filesList: nextProps.filesList,
      };
    }
    return null;
  }

  componentDidMount() {
    this.scroll(1);
    this.setNewItems();
  }

  setNewItems = () => {
    this.setState({
      items: this.props.items.filter(item => (this.props.filesList[item.file_id] || item.type === 'link')).map((file, pos) => ({
        id: `${this.props.id}-${pos}`,
        content: file,
      })),
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.items !== this.props.items
      || Object.keys(prevState.filesList).length !== Object.keys(this.state.filesList).length) {
      this.setNewItems();
    }
    if (prevState.items.length !== this.state.items.length || prevProps.isTwoColumns !== this.props.isT) {
      this.handleScroll();
    }
  }

  handleArrowClick = (e, flip) => {
    const {
      offsetWidth,
      scrollLeft,
    } = this.scrollable;
    const scrollTo = scrollLeft + (flip ? -offsetWidth : offsetWidth);
    const fileTileOuterWidth = this.getTileWidth();

    if (this.scrollable.scroll ) {
      this.scroll(scrollTo - scrollTo % fileTileOuterWidth);
    } else {
      //Safari, IE and Edge
      const path = offsetWidth - offsetWidth % fileTileOuterWidth;
      const devider = 300;
      const step = Math.ceil(offsetWidth / devider);
      for (let i = 0; i < path; i += step) {
        _.delay(() => {
          flip ? this.scrollable.scrollLeft -= step : this.scrollable.scrollLeft += step;
        }, 0);
      }

    }
  }

  scroll = leftPos => {
    if (this.scrollable.scroll) {
      this.scrollable.scroll(leftPos, 0);
    } else {
      this.scrollable.scrollLeft = leftPos;
    }
  }

  isOverflown = () => {
    const {
      items = [],
    } = this.state;
    const {
      clientWidth = 0,
    } = this.scrollable;
    const fileTileOuterWidth = this.getTileWidth()
    return items.length * fileTileOuterWidth > clientWidth;
  }

  handleScroll = () => {
    const throttleFunc = _.throttle(() => {
      const {
        offsetWidth,
        scrollLeft,
        scrollWidth,
      } = this.scrollable;
      const isOverflown = this.isOverflown();
      const hideRight = scrollWidth <= scrollLeft + offsetWidth + 1 || !isOverflown;
      const hideLeft = scrollLeft === 0 || !isOverflown;
      this.setState({
        hideLeft,
        hideRight,
      });
    }, 300);

    throttleFunc();
  }

  setRef = (innerRef, ...params) => {
    const [elem] = params;
    this.scrollable = elem;

    return innerRef(...params);
  }

  handleEditWebItem = data => {
    this.props.showWebItemPopup({
      ...data,
      categoryId: this.props.id,
    });
  }

  handleEditItem = data => {
    this.props.showEditItemPopup({
      ...data,
      categoryId: this.props.id,
    });
  }

  handleChangeCategoryTitleClick = (value, id, caps) => {
    this.props.showWithCapsPopup({
      value,
      id,
      caps,
    });
  }

  showDeleteCardModal = (cardId, index) => {
    this.props.showDeleteCardPopup({
      categoryId: this.props.id,
      cardId,
      index
    });
  }

  onAddVideoClick = () => {
    this.props.showAddFilePopup({
      path:  null,
      modalTitle:'Add files to category',
      buttonLabel:'Add files',
      categoryId: this.props.id
    });
  }

  handleDeleteCategory = () => {
    const {
      id,
      rowId,
      columnId,
      deleteCategory,
      deleteColumn
    } = this.props

    deleteCategory(id);
    deleteColumn(rowId, columnId);
  }

  getTileWidth = () => {
    const {
      isTwoColumns
    } = this.props;
    const wWidth = window.innerWidth;
    let tileWidth = this.scrollable.clientWidth;
    if (wWidth > 700 && wWidth < 900) {
      tileWidth = this.scrollable.clientWidth / 2
    } else if (wWidth > 900 && wWidth < 1128) {
      tileWidth = this.scrollable.clientWidth / 3
    } else if (wWidth > 1128 && wWidth < 1800) {
      tileWidth = this.scrollable.clientWidth / (!isTwoColumns ? 4 : 2)
    } else if (wWidth > 1800 && wWidth < 2400) {
     tileWidth = this.scrollable.clientWidth / (!isTwoColumns ? 6 : 3)
    } else if (wWidth > 2400) {
      tileWidth = this.scrollable.clientWidth / (!isTwoColumns ? 8 : 4)
    }
    return tileWidth
  }

  render = () => {
    const {
      id,
      title,
      placeholderProps,
      categoryPos,
      filesList,
      caps,
      uploadingState,
      processingState,
      showWebItemPopup,
      settings,
    } = this.props;

    const {
      items,
      hideLeft,
      hideRight,
    } = this.state;
    const fileTileOuterWidth = this.getTileWidth();
    
    return (
      <div
        key={`category-${id}`}
        className="sc-category-wrap"
      >
        <div className="flex-container category-header">
          <div className="categoty-title-wrap">
            <EditorItemText
              itemType="categoty-title"
              itemText={title || locale.getResource('CategoryTitle')}
              onItemClick={() => this.handleChangeCategoryTitleClick(title, id, caps)}
              withCaps={caps}
            />
          </div>
          <Dropdown
            className="sc-category-dropdown"
            activeItem={
              <ButtonNormal>
                {locale.getResource('addFiles')}
              </ButtonNormal>
            }
            itemsList={[{
              title: 'Add files',
              onItemClick: this.onAddVideoClick,
            },
            {
              title: 'Add link',
              onItemClick: () => showWebItemPopup({categoryId: id}),
            }]} />

          <Dropdown
            className="dots"
            activeItem={<SvgIcon className="link-icon" data={moreIcon} testid="category-dropdown"/>}
            itemsList={[{
              title: locale.getResource('Delete'),
              onItemClick: this.handleDeleteCategory,
            }]} />
        </div>
        <div
          className="sc-category-list"
        >
          {!hideLeft && <SliderArrow flipped={true} onClick={this.handleArrowClick} display={true}/>}
          <Droppable
            droppableId={id}

            direction="horizontal"
          >
            {(provided) => {
              return (
                <div
                  className="category-scroll-container"
                  onScroll={this.handleScroll}
                  style={{
                    alignContent: !items.length ? 'stretch' : 'flex-end',
                  }}
                  ref={(...params) => this.setRef(provided.innerRef, ...params)}
                  {...provided.droppableProps}
                >
                  {!items.length &&
                  <Draggable
                    key={`${id}-new`}
                    draggableId={`${id}-new`}
                    index={0}
                    isDragDisabled={true}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getStyle(provided.draggableProps.style, snapshot)}
                      >
                        <AddVideo
                          category={id}
                          onClick={this.onAddVideoClick}
                          settings={settings}
                        />
                      </div>
                    )}

                  </Draggable>}

                  {items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <Fragment>
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={
                              getItemStyle(snapshot.isDragging, provided.draggableProps.style, fileTileOuterWidth)
                            }
                          >
                            {
                              (filesList[item.content.file_id] || item.content.type === 'link') && <FileTile
                                key={`file-${categoryPos}-${index}`}
                                file={item.content}
                                onDeleteClick={this.showDeleteCardModal}
                                uploadingState={uploadingState}
                                processingState={processingState}
                                editWebItem={this.handleEditWebItem}
                                editItem={this.handleEditItem}
                                filesList={filesList}
                                itemIndex={index}
                                settings={settings}
                              />
                            }
                          </div>
                          {
                            placeholderProps.category === id &&
                          <div
                            className="empty-placeholder"
                            style={{
                              left: fileTileOuterWidth * placeholderProps.index + 5,
                              width: fileTileOuterWidth - 10,
                            }}
                          />
                          }
                        </Fragment>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              );
            }}
          </Droppable>
          {!hideRight && <SliderArrow flipped={false} onClick={this.handleArrowClick} display={true}/>}
        </div>
      </div>
    );
  }
}

Category.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  items: PropTypes.array,
  filesList: PropTypes.object,
  categoryPos: PropTypes.number,
  onAddVideoClick: PropTypes.func,
  showWithCapsPopup: PropTypes.func,
  deleteCategory: PropTypes.func,
  showDeleteCardPopup:  PropTypes.func,
  placeholderProps: PropTypes.object,
  totalCat: PropTypes.number,
  caps: PropTypes.bool,
  uploadingState: PropTypes.object,
  processingState: PropTypes.object,
  showWebItemPopup: PropTypes.func,
  showEditItemPopup:  PropTypes.func,
  settings: PropTypes.object,
};

const mapStateToProps = state => ({
  placeholderProps: getPlaceholderProps(state),
  filesList: getFiles(state),
  uploadingState: getUploadingState(state),
  processingState: getProcessingState(state),
});

const mapDispatchToProps = {
  deleteCategory,
  showWithCapsPopup,
  showWebItemPopup,
  showEditItemPopup,
  showDeleteCardPopup,
  showAddFilePopup,
  deleteColumn
};

export default connect(mapStateToProps, mapDispatchToProps)(Category);
