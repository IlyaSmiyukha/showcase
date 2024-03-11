import React, {
  Fragment,
  Component,
} from 'react';
import PropTypes from 'prop-types';

import {
  connect,
} from 'react-redux';

import moment from 'moment';

import constants from '@/constants';

import './ItemsList.less';

import locale from '@/api/locale';

import ListHeader from '@/containers/ListHeader';
import Dropdown from '@/components/Dropdown';
import Scrollbar from '@/components/Scrollbar';
import EmptyList from '@/components/EmptyList';
import ListSkeleton from '@/components/ListSkeleton';
import Loader from '@/components/Loader';

import {
  getRfcCount,
  getRfcList,
  getRfcPage,
  getRfcIsLoadingList,
} from '@/store/selectors/rfc';

import {
  getViewUrl,
} from '@/store/selectors/auth';

import {
  showCreatePopup,
  showExportCsvPopup,
  showChangeOwnershipPopup,
  showDeleteShowcasePopup,
} from '@/store/actions/view';

import {
  fetchRfcList,
} from '@/store/actions/rfc';

import moreIcon from '@/assets/images/svg/icons/icon-more.svg';
import linkIcon from '@/assets/images/svg/icons/icon-external-view.svg';
import chartIcon from '@/assets/images/svg/icons/icon-chart.svg';
import SvgIcon from '@/components/SvgIcon';

class ItemsList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showSkeleton: true
    }
    this.scrollRef = React.createRef();;
  }

  componentDidMount() {
    this.fetchData(true);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.list !== this.props.list) {
      this.fetchData(true);
      this.setState({
        showSkeleton: true
      })
      if (this.scrollRef && this.scrollRef.current) {
        this.scrollRef.current.nv.scrollToTop()
      }
    }
  }

  fetchData = async (initial = false) => {
    const {
      fetchRfcList,
      list,
      organizationId,
      items,
      count,
      page,
    } = this.props;
    const {
      itemsPerPage,
    } = constants;
    const loaded = !!count && items.length === count;

    if ((list === 'my-showcases' || list === 'showcases-shared-with-me')&& organizationId && (initial || !loaded)) {
      await fetchRfcList({
        organizationId,
        page: initial ? 1 : page + 1,
        offset: initial ? 0 : page * itemsPerPage,
        clear: initial,
        listType: list,
      });
    }

    this.setState({
      showSkeleton: false
    })
  }

  renderHeader = () => {
    return (
      <div className="items-header">
        <div className="items-col items-col-wide">
          {locale.getResource('Name')}
        </div>
        <div className="items-col items-col-normal">
          {locale.getResource('Status')}
        </div>
        {
          this.props.list === 'showcases-shared-with-me' && <div className="items-col items-col-normal">
            {locale.getResource('Owner')}
          </div>
        }
        <div className="items-col items-col-normal">
          {locale.getResource('Created')}
        </div>
        <div className="items-col items-col-normal">
          {locale.getResource('Updated')}
        </div>
        <div className="items-col items-col-small">
        </div>
        <div className="items-col items-col-small">
        </div>
        <div className="items-col items-col-small">
        </div>
      </div>
    );
  }

  onDropdownClick = (e, rfcId) => {
    e.stopPropagation();
    e.preventDefault();

    this.props.showDeleteShowcasePopup({rfcId});
  }

  onAnalyticsClick = async (e, rfcId) => {
    e.stopPropagation();
    await this.props.openAnalytics(rfcId);
  }

  renderItemsRow = ({
    rfc_id: rfcId,
    name,
    organization_url: url,
    status,
    updated,
    created,
    last_name,
    first_name,
    enable_search_indexing,
    group
  }) => {

    const {
      viewUrl,
      navigateTo = () => null,
      showExportCsvPopup,
      showChangeOwnershipPopup,
    } = this.props;

    return (
      <div
        key={`row-${rfcId}`}
        className="items-row"
        onClick={() => navigateTo(rfcId)}
      >
        <div className="items-col items-col-wide">
          <div className="items-col-title">{name}</div>
          <div className="items-col-link">{`${viewUrl}/${url}`}</div>
        </div>
        <div className="items-col items-col-normal status">
          {status}
        </div>
        {
          this.props.list === 'showcases-shared-with-me' && <div className="items-col items-col-normal owner">
            {first_name} {last_name}
          </div>
        }
        <div className="items-col items-col-normal">
          {moment(created * 1000).format('MMM D, YYYY')}
        </div>
        <div className="items-col items-col-normal">
          {moment(updated * 1000).format('MMM D, YYYY')}
        </div>
        <div className="items-col items-col-small">
          {
            status === 'published' &&

              <a
                target="_blank"
                onClick={e => e.stopPropagation()}
                rel="noopener noreferrer"
                href={`//${viewUrl}/${url}`}
              >
                View
                <SvgIcon className="link-icon" data={linkIcon} />
              </a>

          }
        </div>
        <div className="items-col items-col-small">
            <a onClick={e => this.onAnalyticsClick(e, rfcId)}>
              <SvgIcon className="link-icon" data={chartIcon} />
            </a>
        </div>
        <div className="items-col items-col-small">
          {
            this.props.list === 'my-showcases' &&   <Dropdown
              right={true}
              className="dots"
              activeItem={<SvgIcon className="link-icon" data={moreIcon} testid="dropdown" />}
              itemsList={[
                {
                  title: locale.getResource('Delete'),
                  onItemClick: e => this.onDropdownClick(e, rfcId),
                },
                {
                  title: locale.getResource('ExportCsv'),
                  onItemClick: () => {
                    showExportCsvPopup({
                      rfcId,
                      createdTime: created,
                    });
                  },
                },
                {
                  title: locale.getResource('ChangeOwnership'),
                  onItemClick: () => {
                    showChangeOwnershipPopup({
                      rfcId,
                      rfcName: name,
                    });
                  },
                },
                {
                  title: locale.getResource('Duplicate'),
                  onItemClick: () => {
                    showCreatePopup({
                      enable_search_indexing,
                      group,
                      name: `${name} copy`,
                      rfc_id: rfcId,
                      url: `${url}-copy`,
                      duplicate: true
                    })
                  },
                }
              ]} />
          }
        </div>
      </div>
    );
  }

  scrollHandler = event => {
    var element = event.target;
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      this.fetchData();
    }
  }


  render() {
    const {
      showCreatePopup,
      count,
      items,
      list,
      isListLoading,
    } = this.props;

    const {
      showSkeleton
    } = this.state;

    return (
      <Fragment>
        <ListHeader
          text={list === 'my-showcases' ? locale.getResource('MyShowcases') : locale.getResource('SharedShowcases')}
          count={count}
          onCreateShowcaseClick={showCreatePopup}
          viewName={list}
        />
        <div className="items-list-wrapper">
          {items && !!items.length && this.renderHeader()}
          <div className="items-list-scroll-container">
            {
              !showSkeleton
                ?
                (
                  items && items.length
                    ?
                    <Scrollbar onScroll={this.scrollHandler} ref={this.scrollRef}>
                      {items.map(item => this.renderItemsRow(item))}
                      {
                        count !== items.length && <div className='items-list-loader'>
                          {isListLoading && <Loader />}
                        </div>
                      }
                    </Scrollbar>
                    :
                    <EmptyList onClick={showCreatePopup} listType={list}/>
                )
                :
                <ListSkeleton />
            }
          </div>
        </div>
      </Fragment>
    );
  }
}

ItemsList.propTypes = {
  fetchRfcList: PropTypes.func,
  showCreatePopup: PropTypes.func,
  showExportCsvPopup: PropTypes.func,
  navigateTo: PropTypes.func,
  showChangeOwnershipPopup: PropTypes.func,
  showDeleteShowcasePopup: PropTypes.func,

  organizationId: PropTypes.string,

  items: PropTypes.array,
  count: PropTypes.number,
  page: PropTypes.number,
  viewUrl: PropTypes.string,
  list: PropTypes.string,
  isListLoading: PropTypes.bool,
};

const mapStateToProps = state => ({
  count: getRfcCount(state),
  items: getRfcList(state),
  viewUrl: getViewUrl(state),
  page: getRfcPage(state),
  isListLoading: getRfcIsLoadingList(state),
});

const mapDispatchToProps = {
  fetchRfcList,
  showCreatePopup,
  showExportCsvPopup,
  showChangeOwnershipPopup,
  showDeleteShowcasePopup,
};

export default connect(mapStateToProps, mapDispatchToProps)(ItemsList);
