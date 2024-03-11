import React from 'react';

import {CopyToClipboard} from 'react-copy-to-clipboard';
import {NotificationManager} from 'react-notifications';

import withPopup from '@/hocs/withPopup';
import PropTypes from 'prop-types';
import Input from '@/components/Input';

import {
  ButtonFlat,
  ButtonNormal,
} from '@/components/Buttons';

import locale from '@/api/locale';

import {
  HSeparator,
} from '@/components/Separators';

import './Published.less';


const Published = props => {

  const {
    url,
    onCloseClick,
  } = props;

  const handleONCopy = () => {
    NotificationManager.success(locale.getResource('Copied'));
  };

  return (
    <div className="published-wrapper sc-padding-10">
      <div className="congratulations">{locale.getResource('Congratulations')}</div>
      <div className="description">{locale.getResource('ShowcasePublished')}</div>
      <div className="copy-wrapper">
        <Input
          type={'text'}
          placeholder=""
          readOnly={true}
          value={url}
        />
        <CopyToClipboard text={url}
          onCopy={handleONCopy}>
          <ButtonNormal
            disabled={false}
          >
            {locale.getResource('CopyLink')}
          </ButtonNormal>
        </CopyToClipboard>
      </div>
      <a
        className="rfc-view-link"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {locale.getResource('ViewShowcase')}
      </a>
      <HSeparator />
      <ButtonFlat
        className="rfc-done"
        disabled={false}
        onClick={onCloseClick}
      >
        {locale.getResource('Done')}
      </ButtonFlat>
    </div>
  );
};

Published.propTypes = {
  url: PropTypes.string,
  onCloseClick: PropTypes.func,
};

export default withPopup(Published);
