import React, {
  Fragment,
  Component,
} from 'react';

import {
  connect,
} from 'react-redux';

import './Publish.less';

import withPopup from '@/hocs/withPopup';
import PropTypes from 'prop-types';

import specificPeopleIcon from '@/assets/images/svg/icons/icon-privacy-specific-people.svg';
import organizationIcon from '@/assets/images/svg/icons/icon-privacy-organization.svg';
import passwordIcon from '@/assets/images/svg/icons/icon-privacy-password.svg';
import linkIcon from '@/assets/images/svg/icons/icon-privacy-link.svg';
import eyeIcon from '@/assets/images/svg/icons/icon-who-viewed.svg';
import Checkbox from '@/components/Checkbox';
import Creatable from '@/components/CreatableSelect';

import {
  ButtonFlat,
  ButtonNormal,
} from '@/components/Buttons';
import SvgIcon from '@/components/SvgIcon';
import Radio from '@/components/Radio';
import Input from '@/components/Input';

import {
  getRfcPermissions,
} from '@/store/selectors/rfc';

import {
  getSettings,
} from '@/store/selectors/revisions';


import {
  editRfcPermissions,
} from '@/store/actions/rfc';

import {
  revisionPublish,
} from '@/store/actions/revisions';

import {
  hideSpecialPopup,
} from '@/store/actions/view';

import {
  checkDomain,
  checkEmail,
} from '@/helpers';

import locale from '@/api/locale';


class Published extends Component {

  constructor(props) {
    super(props);
    const {
      permissions: {
        organizations = [],
        password = '',
        anyone = false,
        emails,
        email_domains: domains,
        'internal-password': internalPassword = ''
      } = {},
      organizationId,
      sharingAnyoneWithTheLink,
      sharingAnyoneWithTheLinkAndPassword
    } = props;
    const members = organizations.find(item => +item === +organizationId);

    let selected = sharingAnyoneWithTheLink ? 'link' : 'members';
    let emailsDomains = [];

    if (members) {
      selected = 'members';
    }

    if (password) {
      selected = 'password';
    }

    if (emails && emails.length || domains && domains.length) {
      selected = 'domains';
      emailsDomains = [...emails,
        ...domains];
    }

    if (selected === 'link' && !sharingAnyoneWithTheLink || selected === 'password' && !sharingAnyoneWithTheLinkAndPassword) {
      selected = 'members';
    }

    this.state = {
      selected: selected,
      password,
      internalPassword,
      showPasswordField: !!internalPassword,
      showPassword: true,
      sendMessage: false,
      customMessage: '',
      emailsDomains,
      emailsDomainsError: false
    };

    this.options = [{
      name: 'members',
      title: locale.getResource('MembersLink'),
      description: locale.getResource('MembersLinkDescription'),
      icon: organizationIcon,
    },
    {
      name: 'domains',
      title: locale.getResource('SpecificDomains'),
      description: locale.getResource('SpecificDomainsDescription'),
      icon: specificPeopleIcon,
    },
    {
      name: 'password',
      title: locale.getResource('AnyoneWithLinkAndPassword'),
      description: locale.getResource('AnyoneWithLinkAndPasswordDescription'),
      icon: passwordIcon,
    },
    {
      name: 'link',
      title: locale.getResource('AnyoneWithLink'),
      description: locale.getResource('AnyoneWithLinkDescription'),
      icon: linkIcon,
    }];
  }

  handleAddEmail = value => {
    const list = value.reduce((acc, item) => {
      const {value} = item;
      if (value.includes(';') || value.includes(',')) {
        acc = [...acc, ..._.uniq(value.replace(/\s/g, '').split(/;|,/).filter(item => checkEmail(item) || checkDomain(item)))]
      } else {
        acc = [...acc, value]
      }
      return acc
    }, [])
    this.setState({
      emailsDomains: _.uniq(list),
      emailsDomainsError: false
    });
  }

  getQuery = () => {
    const {
      permissions: {
        password: oldPassword,
        'internal-password': oldInternalPassword
      },
      organizationId,
    } = this.props;
    const {
      selected,
      password,
      emailsDomains,
      internalPassword,
      showPasswordField
    } = this.state;

    const data = {
    };


    switch (selected) {
      case 'members':
        data.add = {
          organization_id: organizationId,
        };
        if (internalPassword && showPasswordField) {
          data.add['internal-password'] = internalPassword
        }
        data.remove = {
          anyone: true,
          emails: this.props.permissions.emails,
          domains: this.props.permissions.email_domains,
        };
        if (oldPassword) {
          data.remove.password = oldPassword;
        }
        if (!showPasswordField) {
          data.remove['internal-password'] = oldInternalPassword;
        }
        break;
      case 'password':
        if (password) {
          data.add = {
            password,
          };
          data.remove = {
            organization_id: organizationId,
            anyone: true,
            emails: this.props.permissions.emails,
            domains: this.props.permissions.email_domains,
          };
          if (oldInternalPassword) {
            data.remove['internal-password'] = oldInternalPassword;
          }
        } else {
          data.add = {
            anyone: true,
          };
          data.remove = {
            organization_id: organizationId,
            emails: this.props.permissions.emails,
            domains: this.props.permissions.email_domains,
          };
          if (oldInternalPassword) {
            data.remove['internal-password'] = oldInternalPassword;
          }
        }
        break;
      case 'link':
        data.add = {
          anyone: true,
        };
        data.remove = {
          organization_id: organizationId,
          emails: this.props.permissions.emails,
          domains: this.props.permissions.email_domains,
        };
        if (oldPassword) {
          data.remove.password = oldPassword;
        }
        if (oldInternalPassword) {
          data.remove['internal-password'] = oldInternalPassword;
        }
        break;
      case 'domains':
        const emails = emailsDomains && emailsDomains.filter(item => checkEmail(item));
        const domains = emailsDomains && emailsDomains.filter(item => checkDomain(item));

        const removeEmails = this.props.permissions.emails && this.props.permissions.emails.filter(email => !emails.includes(email));
        const removeDomains =  this.props.permissions.email_domains && this.props.permissions.email_domains.filter(domain => !domains.includes(domain));

        data.add = {
          emails,
          domains,
        };
        data.remove = {
          anyone: true,
          organization_id: organizationId,
          emails: removeEmails,
          domains: removeDomains,
        };
        if (oldPassword) {
          data.remove.password = oldPassword;
        }
        if (oldInternalPassword) {
          data.remove['internal-password'] = oldInternalPassword;
        }
        break;
    }
    return data;
  }

  handlePasswordChange = (e, name) => {
    const {
      value: password,
    } = e.target;
    if (name === 'members') {
      this.setState({
        internalPassword: password,
      });
    } else {
      this.setState({
        password,
      });
    }
  }

  handlePasswordShow = () => {
    this.setState({
      showPassword: !this.state.showPassword,
    });
  }

  handleOptionChange = selected => {
    this.setState({
      selected,
    });
  };

  handleCheckboxChange = () => {
    this.setState({
      sendMessage: !this.state.sendMessage,
    });
  };

  handleMessageChange = (e) => {
    this.setState({
      customMessage: e.target.value,
    });
  };

  handleShowPasswordMembers = (e) => {
    this.setState({
      showPasswordField: !this.state.showPasswordField,
    });
  };

  handleSave = async () => {
    const {
      hideSpecialPopup,
      group,
      rfcId,
      editRfcPermissions,
    } = this.props;

    const granted = this.getQuery();

    if (!this.state.emailsDomains.length && this.state.selected === 'domains') {
      this.setState({
        emailsDomainsError: true
      })
      return
    }

    try {
      await editRfcPermissions({
        group,
        rfcId,
        granted,
      });
      await this.publishRevision();
    } catch (e) {
      console.log(e);
      throw (e);
    }
    hideSpecialPopup('publishPopup');
  }

  publishRevision = async () => {
    const {
      rfcId,
      revisionPublish,
    } = this.props;

    const {
      sendMessage,
      customMessage,
    } = this.state;

    try {
      await revisionPublish(rfcId, sendMessage, customMessage);
    } catch (e) {
      console.log(e);
    }
  }

  isValidNewOptionCheck = (inputValue) => {
      return inputValue && (checkDomain(inputValue) || checkEmail(inputValue) || inputValue.includes(';') || inputValue.includes(','))
  }

  renderTextBlock = (
    title,
    description,
    showPasswordInput,
    showSelect,
    name
  ) => {
    const {
      password,
      showPassword,
      emailsDomains,
      emailsDomainsError,
      showPasswordField,
      internalPassword
    } = this.state;
    return (
      <div className="publish-line">
        <div className="publish-title">{title}</div>
        <p className="publish-description">{description}</p>
        {
          (name === 'members' && showPasswordInput) &&  <Checkbox
              defaultChecked={showPasswordField}
              name="showPasswordField"
              value="showPasswordField"
              onChange={this.handleShowPasswordMembers}>
              Protect by password
            </Checkbox>
        }
        {
          ((name === 'password' && showPasswordInput) || (name === 'members' && showPasswordInput && showPasswordField)) &&
          <span className="password-wrap">
            <Input
              type={showPassword ? 'password' : 'text'}
              placeholder={locale.getResource('SpecifyPassword')}
              onChange={(e) => {this.handlePasswordChange(e, name)}}
              value={name === 'members' ? internalPassword : password}
              autocomplete="new-password"
              id={`showcase-password-${Date.now()}`}
              name={`showcase-password-${Date.now()}`}
            />
            <span className={`toggle-password ${showPassword ? '' : 'active'}`} onClick={this.handlePasswordShow}>
              <SvgIcon
                className="publish-option-icon"
                data={eyeIcon}
              />
            </span>
          </span>
        }
        {
          showSelect && <Creatable
            className={'sc-select'}
            onChange={this.handleAddEmail}
            isMulti={true}
            isClearable={false}
            isValidNewOption={this.isValidNewOptionCheck}
            formatCreateLabel={label => checkDomain(label) && `Add domain ${label}` || checkEmail(label) && `Add email ${label}` || ((label.includes(';') || label.includes(',')) && 'Add list of emails and domains')}
            noOptionsMessage={() => 'Type to add emails or domains...'}
            placeholder={'Type to add emails or domains...'}
            value={emailsDomains.map(item => ({
              label: item,
              value: item,
            }))}/>
        }
        {
          (showSelect && emailsDomainsError) && <div className="sc-input-error">
            Please fill emails or domains!
          </div>
        }
      </div>
    );
  }

  renderOptionBlock = ({
    name,
    title,
    description,
    icon,
  }, pos) => {
    const {
      selected,
    } = this.state;

    const {
      sharingAnyoneWithTheLink,
      sharingAnyoneWithTheLinkAndPassword
    } = this.props;
    const showPasswordInput = (name === 'password' || name === 'members') && selected === name;
    const showSelect = name === 'domains' && selected === name;

    return ( ((!sharingAnyoneWithTheLink && name === 'link')
              || (!sharingAnyoneWithTheLinkAndPassword && name === 'password')) ? null :
      <Fragment
        key={`publish-option-${pos}`}
      >
        <div
          className="publish-option"
        >
          <Radio
            disabled={false}
            defaultChecked={selected === name}
            id={`publish-option-${name}`}
            name={`publish-option`}
            value={name}
            onChange={() => this.handleOptionChange(name)}>
            <SvgIcon
              className="publish-option-icon"
              data={icon}
            />
          </Radio>
          {this.renderTextBlock(title, description, showPasswordInput, showSelect, name)}
        </div>
      </Fragment>
    );
  }


  renderFollowBlock = () => {
    const {
      sendMessage,
      customMessage,
    } = this.state;
    return <div className="sc-param-container checkbox-conteiner">
      <Checkbox
        defaultChecked={sendMessage}
        name="showFollow"
        value="showFollow"
        onChange={this.handleCheckboxChange}>
        {locale.getResource('SendNotification')}
      </Checkbox>

      {
        sendMessage && <textarea
          className="sc-textarea"
          placeholder={locale.getResource('NotificationMessage')}
          value={customMessage}
          onChange={this.handleMessageChange}/>
      }
    </div>;
  }

  render() {
    const {
      onCloseClick,
      settings,
    } = this.props;
    return (
      <div className="publish-wrapper sc-padding-10">
        {this.renderTextBlock(locale.getResource('ShowcasePrivacy'), locale.getResource('ShowcasePrivacyDescription'))}
        {this.options.map((item, pos) => this.renderOptionBlock(item, pos))}
        {(settings.showFollow && (this.state.selected === 'members' || this.state.selected === 'domains')) && this.renderFollowBlock()}
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
            {locale.getResource('PublishShowcase')}
          </ButtonNormal>
        </div>
      </div>
    );
  }
}

Published.propTypes = {
  rfcId: PropTypes.string.isRequired,
  organizationId: PropTypes.string.isRequired,
  onCloseClick: PropTypes.func,
  hideSpecialPopup: PropTypes.func,
  handleClosePopupClick:  PropTypes.func,
  permissions: PropTypes.object,
  group: PropTypes.string,
  editRfcPermissions: PropTypes.func,
  revisionPublish: PropTypes.func,
  settings: PropTypes.object,
};

const mapStateToProps = state => {
  return ({
    permissions: getRfcPermissions(state),
    settings: getSettings(state),
  });
};

const mapDispatchToProps = {
  editRfcPermissions,
  revisionPublish,
  hideSpecialPopup,
};

export default connect(mapStateToProps, mapDispatchToProps)(withPopup(Published));
