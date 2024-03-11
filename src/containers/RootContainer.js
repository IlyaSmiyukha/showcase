import React, {
  Component,
  Fragment,
} from 'react';

import {
  connect,
} from 'react-redux';

import PropTypes from 'prop-types';

import getPusher from '@/api/pusher/index';

import {
  setAuthData,
} from '@/store/actions/auth';

import {
  clearFilesData,
} from '@/store/actions/files';

import constants from '@/constants';

import SingleItem from '@/containers/SingleItem';
import RightPanel from '@/containers/RightPanel';
import ItemsList from '@/containers/ItemsList';
import Skeleton from '@/components/Skeleton';
import SkeletonAnalytics from '@/components/SkeletonAnalytics';

import PopupContainer from '@/containers/Popup';

import { getDragData } from '@/store/selectors/view';
import { getShowAnalytics } from '@/store/selectors/analytics';
import { getFiles } from '@/store/selectors/files';
import { showSkeleton } from '@/store/selectors/revisions';

import {
  setPlaceholderProps,
} from '@/store/actions/view';

import {
  fetchMyFiles,
} from '@/store/actions/files';

import {
  addNewItems,
  sortCategoriesOnDrop,
} from '@/store/actions/categories';

import {
  setCurrentRfcID,
} from '@/store/actions/revisions';


import {
  DragDropContext,
} from 'react-beautiful-dnd';


class RootContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedCategory: null,
      selectedVideo: null,
    };

    this.pusher = null;
  }

  componentDidMount() {
    this.loadInitialData();
  }

  initPusher = () => {
    const {
      group,
      apiUrl,
      accessToken,
      user,
      standalone
    } = this.props;
    const PusherSC = getPusher(standalone);
    this.pusher = new PusherSC({
      group,
      apiUrl,
      accessToken,
      user,
    });
  }

  componentDidUpdate(prevProps) {
    const {
      rfcId,
      user,
    } = this.props;

    if (!this.pusher && user) {
      this.initPusher();
    }

    if (prevProps.rfcId && !rfcId && this.pusher) {
      this.pusher.disconnect();
      this.pusher = null;
      this.props.clearFilesData();
    }

    if (prevProps.rfcId !== rfcId) {
      this.loadInitialData();
    }
  }

  handleSelectCategory = ({
    categoryId,
    selectedVideo,
  }) => {
    this.setState({
      selectedCategory: categoryId,
      selectedVideo,
    });
  }

  loadInitialData = async () => {
    const {
      setAuthData,
      group,
      accessToken,
      viewUrl,
      rfcId,
      myFiles,
      fetchMyFiles,
      organizationId,
      apiUrl,
      setCurrentRfcID,
      user,
    } = this.props;
    this.props.clearFilesData();

    await setAuthData(accessToken, group, organizationId, viewUrl, apiUrl);

    setCurrentRfcID(rfcId);

    if (rfcId && _.isEmpty(myFiles)) {
      fetchMyFiles({currentUserId: user});
    }
  }

  handleDragEnd = result => {
    const {
      addNewItems,
      setPlaceholderProps,
      group,
      files,
    } = this.props;


    setPlaceholderProps({
      index: -1,
      category: -1,
    });
    
    if (!result.destination || result.destination.droppableId === 'new') {
      return;
    }

    const {
      draggableId,
      source: {
        index: startPos,
        droppableId: startCategory,
      },
      destination: {
        droppableId: endCategory,
        index: endPos,
      },
    } = result;

    const filesToAdd =  files[draggableId] && files[draggableId].type === 'folder' ?
      files[draggableId].extra.folder.items.filter(item => item.type !== 'folder').map(item => item.id) :
      [draggableId];

    startCategory === 'new'
      ? addNewItems(endCategory, filesToAdd, endPos, group)
      : sortCategoriesOnDrop({
        startPos,
        endPos,
        startCategory,
        endCategory,
      });
  }

  handleDragUpdate = update => {
    if (!update.destination) {
      return;
    }
    const {
      setPlaceholderProps,
    } = this.props;

    const {
      destination: {
        droppableId: category,
        index,
      },
    } = update;
    setPlaceholderProps({
      index,
      category,
    });
  };

  handleDragStart = ({
    source = {},
  }) => {
    const {
      setPlaceholderProps,
    } = this.props;
    const {
      droppableId,
      index,
    } = source;
    const category = droppableId === 'new' ? -1 : droppableId;

    setPlaceholderProps({
      index,
      category,
    });
  }

  render() {
    const {
      rfcId,
      list,
      group,
      currentRevisionPublished,
      navigateTo,
      organizationId,
      showSkeleton,
      playerConfig,
      loadFilesById,
      user,
      isShowAnalytics,
      openAnalytics,
      pathname,
      sharingAnyoneWithTheLink,
      sharingAnyoneWithTheLinkAndPassword
    } = this.props;

    const {
      lists = [],
    } = constants;

    const listExists = !!list && lists.includes(list);
    return (
      <Fragment>
        <PopupContainer
          group={group}
          playerConfig={playerConfig}
          navigateTo={navigateTo}
          rfcId={rfcId}
          organizationId={organizationId}
          currentUserId={user}
          pusher={this.pusher}
          sharingAnyoneWithTheLink={sharingAnyoneWithTheLink}
          sharingAnyoneWithTheLinkAndPassword={sharingAnyoneWithTheLinkAndPassword}
        />

        {
          rfcId
            ?
            <div className="wrapper showcase-wrapper">
              <DragDropContext
                onDragEnd={this.handleDragEnd}
                onDragUpdate={this.handleDragUpdate}
                onDragStart={this.handleDragStart}
              >
                <SingleItem
                  currentRevisionPublished={currentRevisionPublished}
                  group={group}
                  rfcId={rfcId}
                  organizationId={organizationId}
                  playerConfig={playerConfig}
                  loadFilesById={loadFilesById}
                  currentUserId={user}
                  isShowAnalytics={isShowAnalytics}
                  navigateTo={navigateTo}
                  openAnalytics={openAnalytics}
                  pathname={pathname}
                  sharingAnyoneWithTheLink={false}
                  sharingAnyoneWithTheLinkAndPassword={false}
                />

                {
                  !isShowAnalytics && <RightPanel group={group}/>
                }

              </DragDropContext>

              {
                showSkeleton && (
                  pathname.includes('analytics') ? <SkeletonAnalytics /> : <Skeleton />
                )
              }

            </div>
            :
            organizationId && listExists && <ItemsList
              list={list}
              navigateTo={navigateTo}
              organizationId={organizationId}
              openAnalytics={openAnalytics}
            />
        }
      </Fragment>
    );
  }
}

RootContainer.propTypes = {
  setAuthData: PropTypes.func,
  files: PropTypes.object,

  navigateTo: PropTypes.func,
  setPlaceholderProps: PropTypes.func,
  fetchMyFiles: PropTypes.func,
  addNewItems: PropTypes.func,
  sortCategoriesOnDrop: PropTypes.func,
  setCurrentRfcID: PropTypes.func,
  clearFilesData: PropTypes.func,
  loadFilesById: PropTypes.func,

  rfcId: PropTypes.string,
  list: PropTypes.string,

  group: PropTypes.string,
  accessToken: PropTypes.string,
  organizationId: PropTypes.string,
  viewUrl: PropTypes.string,
  apiUrl: PropTypes.string,

  dragData: PropTypes.object,

  myFiles: PropTypes.array,

  currentRevisionPublished: PropTypes.bool,
  standalone: PropTypes.bool,

  showSkeleton: PropTypes.bool,
  user:  PropTypes.string,
  playerConfig: PropTypes.object,
};

RootContainer.defaultProps = {
  standalone: false,
  showModal: void 0,
  files: {},
  myFiles: [],
};

const mapStateToProps = state => {
  return ({
    dragData: getDragData(state),

    showSkeleton: showSkeleton(state),
    files: getFiles(state),
    isShowAnalytics: getShowAnalytics(state)
  });
};

const mapDispatchToProps = {
  setAuthData,
  setPlaceholderProps,
  addNewItems,
  fetchMyFiles,
  sortCategoriesOnDrop,
  setCurrentRfcID,
  clearFilesData,
};

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer);
