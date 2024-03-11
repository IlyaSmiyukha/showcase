import React, {
  Component,
} from 'react';

import {
  connect,
} from 'react-redux';

import PropTypes from 'prop-types';

import locale from '@/api/locale';

import Header from '@/containers/Header';
import Heading from '@/containers/Heading';
import Shortcuts from '@/containers/Shortcuts';
import Footer from '@/containers/Footer';
import Filters from '@/containers/Filters';
import AnalyticsDashboard from '@/containers/AnalyticsDashboard';
import Layout from '@/containers/Layout';

import Scrollbar from '@/components/Scrollbar';
import AddBackground from '@/components/AddBackground';
import Background from '@/components/Background';
import AddCategoryBtn from '@/components/AddCategoryBtn';


import {
  revisionFetchInitialData,
} from '@/store/actions/revisions';

import {
  showAnalytics
} from '@/store/actions/analytics';

import {
  getFiles,
} from '@/store/selectors/files';

import {
  getRfcData,
  getSettings,
} from '@/store/selectors/revisions';

import {
  getHeaderBacground,
  getHeaderBacgroundType,
} from '@/store/selectors/header';

import './SingleItem.less';

class SingleItem extends Component {
  constructor(props) {
    super(props);
    this.dragCounter = 0;
    this.state = {
      data: {},
      files: [],
    };
  }

  fetchInitialData = async () => {
    const {
      revisionFetchInitialData,
      rfcId,
      loadFilesById,
      showAnalytics,
      pathname
    } = this.props;

    const {
      data,
      files,
    } = await revisionFetchInitialData(rfcId, loadFilesById);

    this.clearButtonState(data, files);

    this.setState({
      data,
      files,
    });
    if (pathname.includes('analytics')) {
      showAnalytics(true)
    }
  }

  clearButtonState = (data, files) => {
    const {
      filesList,
    }  = this.props;

    const header = data.blocks && data.blocks.filter(block => {
      return block.type === 'showcase-header';
    })[0] || {};

    if (header.button) {
      if (header.button.file_id && !filesList[header.button.file_id] && !files.filter(file => file.file_id === header.button.file_id).length) {
        this.props.updateButton({
          label: '',
        });
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.rfcId && prevProps.rfcId !== this.props.rfcId) {
      this.fetchInitialData();
    }
    if (prevProps.pathname !== this.props.pathname) {
      this.props.showAnalytics(this.props.pathname.includes('analytics'))
    }
  }

  componentDidMount() {
    this.fetchInitialData();
  }

  render() {
    const {
      background = '',
      currentRevisionPublished,
      rfcId,
      rfcData,
      organizationId,
      group,
      bgType,
      playerConfig,
      settings,
      currentUserId,
      isShowAnalytics,
      navigateTo,
      openAnalytics
    } = this.props;

    return (
      <div className={`showcase-item-container ${isShowAnalytics ? 'showcase-item-analytics' : ''}`}>
        <Header
          currentRevisionPublished={currentRevisionPublished}
          text={rfcData.name || ''}
          rfcId={rfcId}
          organizationId={organizationId}
          group={group}
          playerConfig={playerConfig}
          currentUserId={currentUserId}
          navigateTo={navigateTo}
          openAnalytics={openAnalytics}
        />
        {
          isShowAnalytics && <AnalyticsDashboard />
        }
        {
          !isShowAnalytics &&  <div className="showcase-item-content">
          {
            !background && <AddBackground background={background}/>}
            <Scrollbar>
              <Background
                background={background}
                bgType={bgType}/>

              <Heading
                background={background}
              />

              {
                settings.showShortcuts && <Shortcuts />
              }

              {
                settings.showFilters && <Filters />
              }

              <Layout />

              <AddCategoryBtn />

              <Footer />

            </Scrollbar>
          </div>
        }
      </div>
    );
  }
}

SingleItem.propTypes = {
  revisionFetchInitialData: PropTypes.func,
  loadFilesById: PropTypes.func,
  updateButton:  PropTypes.func,
  filesList: PropTypes.object,
  rfcData: PropTypes.object,

  rfcId: PropTypes.string,
  group: PropTypes.string,

  currentRevision: PropTypes.object,

  background: PropTypes.string,
  currentRevisionPublished: PropTypes.bool,
  organizationId: PropTypes.string,
  bgType: PropTypes.string,
  playerConfig: PropTypes.object,
  settings: PropTypes.object,
  currentUserId: PropTypes.string,
};

const mapStateToProps = state => ({
  filesList: getFiles(state),
  background: getHeaderBacground(state),
  rfcData: getRfcData(state),
  bgType: getHeaderBacgroundType(state),
  settings: getSettings(state),
});


const mapDispatchToProps = {
  revisionFetchInitialData,
  showAnalytics
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleItem);
