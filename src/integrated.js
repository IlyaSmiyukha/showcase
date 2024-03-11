import React, {
  PureComponent,
} from 'react';
import {
  Provider,
} from 'react-redux';
import RootContainer from '@/containers/RootContainer';
import store from '@/store/store';

import PropTypes from 'prop-types';

import {
  showCreatePopup,
} from '@/store/actions/view';

import '@/containers/Popup/CreateShowcase/CreateShowcase';


class ShowcaseContainer extends PureComponent {
  render() {
    return <Provider store={store}>
      <RootContainer
        {...this.props}
        viewUrl={this.props.viewUrl || `${location.host}/showcase`}
      />
    </Provider>;
  }
}

ShowcaseContainer.propTypes = {
  accessToken: PropTypes.string,
  group: PropTypes.string,
  organizationId: PropTypes.string,
  navigateTo: PropTypes.func,
  openAnalytics: PropTypes.func,
  rfcId: PropTypes.string,
  viewUrl: PropTypes.string,
  apiUrl: PropTypes.string,
};

export {
  ShowcaseContainer,
  showCreatePopup,
};
