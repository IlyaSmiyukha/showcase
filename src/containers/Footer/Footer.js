import React, {
  Component,
  Fragment,
} from 'react';

import {
  connect,
} from 'react-redux';

import PropTypes from 'prop-types';

import locale from '@/api/locale';

import EditorItemText from '@/components/EditorItemText';
import EditorItemFile from '@/components/EditorItemFile';
import FooterMenuContainer from '@/containers/FooterMenuContainer';

import {
  getFooter,
  getFooterLogo,
} from '@/store/selectors/footer';

import {
  showAddFilePopup,
} from '@/store/actions/view';

import {
  getSettings,
} from '@/store/selectors/revisions';

import './Footer.less';

class Footer extends Component {

  constructor(props) {
    super(props);
  }

  addLogoClick = () => {
    this.props.showAddFilePopup({
      acceptType: ['image',
        'folder'],
      path:'footer-logo',
      modalTitle:'Choose footer logo',
      buttonLabel:'Add logo'});
  }

  render() {
    const {
      footer,
      footerLogo,
      settings,
    } = this.props;

    return (
      <Fragment>

        <FooterMenuContainer />

        <div className="btn-container footer-logo-container">
          <EditorItemFile
            itemDefaultText={locale.getResource('FooterLogo')}
            itemType={'footer-logo'}
            itemUrl={footerLogo}
            onItemClick={this.addLogoClick}
          />
        </div>
        <EditorItemText itemType="footer-text" itemText={footer.text} maxLength={settings.fieldsLimits.footer}/>

      </Fragment>
    );
  }
}

Footer.propTypes = {
  showAddFilePopup: PropTypes.func,
  footer: PropTypes.object,
  footerLogo: PropTypes.string,
  settings:  PropTypes.object,
};

const mapStateToProps = state => ({
  footer: getFooter(state),
  footerLogo: getFooterLogo(state),
  settings: getSettings(state),
});


const mapDispatchToProps = {
  showAddFilePopup,
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
