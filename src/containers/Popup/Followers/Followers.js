import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';

import {
  connect,
} from 'react-redux';

import withPopup from '@/hocs/withPopup';

import {
  fetchFollowers
} from '@/store/actions/managePeople'

import {
  getFollowers,
  getPeopleLoading
} from '@/store/selectors/managePeople'

import Loader from '@/components/Loader'

import './Followers.less';

const PER_PAGE = 25;

class Followers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      totalPages: 1
    }
  }

  componentDidMount() {
    const {
      fetchFollowers,
      rfcId
    } = this.props
    fetchFollowers(rfcId, 0)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.followers.total_items !== nextProps.followers.total_items) {
      this.setState({
        totalPages:5
      });
    }
  }

   convertDate(timestamp)  {
    const date = new Date(timestamp * 1000);
    const months = ['Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  goToPage(page) {
    const {
      fetchFollowers,
      rfcId
    } = this.props;

    this.setState({
      page: page
    }, () => {
      fetchFollowers(rfcId, page * PER_PAGE)
    })
  }

  render() {
    const {
      followers,
      isLoading
    } = this.props;

    const {
      totalPages,
      page
    } = this.state;

    return (
      <div className="sc-form-wrapper sc-padding-10">
        <div className='sc-modal-content sc-followers-modal '>
         
          {!isLoading && (
            followers.items.length ? <>
              <label className="sc-input-label">List of people following this showcase</label>
              <p>People listed below will receive an email notification on showcase publish.</p>
              <div className="sc-followers-list">
                <div className='sc-followers-list-head'>
                  <div>name</div>
                  <div>email</div>
                  <div>followed on</div>
                </div>
                <div className='sc-followers'>
                  {
                    followers.items.map(follower => (
                      <div key={follower.user_id} className='sc-follower-item'>
                        <div>
                          {follower.first_name} {follower.last_name}
                        </div>
                        <div>{follower.email}</div>
                        <div>{this.convertDate(follower.created)}</div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </>
            : <div className='sc-no-followers'>No followers</div>
          )}

          {
            isLoading && <Loader />
          }

          {
            totalPages > 1 && (
              <div className='sc-pagination'>
                {
                  [...Array(totalPages).keys()].map(i => 
                      <button className={`sc-page-btn ${i=== page ? 'active' : ''}`} key={i} onClick={() => this.goToPage(i)}>
                        {i + 1}
                      </button>)
                }
              </div>
            )
          }
        </div>
      </div>
    );
  }
}


const mapStateToProps = state => ({
  followers: getFollowers(state),
  isLoading: getPeopleLoading(state)
});

const mapDispatchToProps = {
  fetchFollowers
};

export default connect(mapStateToProps, mapDispatchToProps)(withPopup(Followers));
