import React from 'react';

import { useSelector, useDispatch } from 'react-redux';

import PropTypes from 'prop-types';

import locale from '@/api/locale';

import EditorItemText from '@/components/EditorItemText';
import EditorItemFile from '@/components/EditorItemFile';
import SvgIcon  from '@/components/SvgIcon';
import editIcon from '@/assets/images/svg/icons/icon-edit.svg';

import {
  showHyperlynksPopup,
  showButtonPopup,
  showAddFilePopup,
} from '@/store/actions/view';

import {
  getHeader,
  getLogo,
} from '@/store/selectors/header';
import {
  getFieldsLimits
} from '@/store/selectors/revisions';

import './Heading.less';

const Heading = props => {
  const dispatch = useDispatch();

  const header = useSelector(state => getHeader(state));
  const logo = useSelector(state => getLogo(state));
  const fieldsLimits = useSelector(state => getFieldsLimits(state));

  const addLogoClick = () => {
    dispatch(showAddFilePopup({
      acceptType: ['image',
        'folder'],
      path: 'header-logo',
      modalTitle: 'Choose logo',
      buttonLabel: 'Add logo',
    }));
  };

  const addBackgroundClick = () => {
    dispatch(showAddFilePopup({
      acceptType: ['image',
        'video',
        'performance',
        'folder'],
      path: 'background',
      modalTitle: 'Choose background',
      buttonLabel: 'Add background',
    }));
  };

  const hyperlinksClick = () => dispatch(showHyperlynksPopup());
  const changeButtonClick = () => dispatch(showButtonPopup());
  return (
    <div className="sc-heading-wrapper">
      <div className="sc-heading-background" >
        <span onClick={addBackgroundClick}>
          {props.background && props.background !== 'loading' ? locale.getResource('ChangeBackground') : locale.getResource('AddBackground')}
          <SvgIcon
            className="edit-icon"
            data={editIcon}
          />
        </span>
      </div>

      <div className="sc-heading-items-wrap">

        <div className="logo-container">
          <EditorItemFile
            itemDefaultText={locale.getResource('Logo')}
            itemType={'header-logo'}
            itemUrl={logo}
            onItemClick={addLogoClick}
          />

          <EditorItemText itemType={'header-link'}
            itemText={`${locale.getResource('AddLinks')}${(header.hyperlinks && header.hyperlinks.length)? ` (${header.hyperlinks.length})` : ''}`}
            onItemClick={hyperlinksClick} />
        </div>

        <EditorItemText
          itemType={'header-heading'}
          itemText={header.heading}
          maxWidth={header.settings.headingMaxWidth}
          maxWidthName={'headingMaxWidth'}
          maxLength={fieldsLimits.heading}/>
        <EditorItemText
          itemType={'header-description'}
          itemText={header.description}
          maxWidth={header.settings.descriptionMaxWidth}
          maxWidthName={'descriptionMaxWidth'}
          maxLength={fieldsLimits.description}/>
        <EditorItemText
          itemType={'button'}
          itemText={header.button && header.button.label ? header.button.label : '' }
          onItemClick={changeButtonClick}/>

      </div>
    </div>
  );
};

Heading.defaultProps = {
  background: '',
};

Heading.propTypes = {
  background: PropTypes.string,
};

export default Heading;
