import React from 'react';

import PropTypes from 'prop-types';

import {
  ButtonNormal,
} from '@/components/Buttons';

import locale from '@/api/locale';

import './ListHeader.less';

const ListHeader = ({ 
  onCreateShowcaseClick,
  text,
  count,
  viewName
}) => {

  const handleCreateShowcaseClick = async (e) => {
    await onCreateShowcaseClick();
  }

  return (
    <div className="showcase-header showcase-list-header">
      <div className="showcase-title-wrapper">
        <div className="showcase-list-title">
          {text}
        </div>
        <div className="showcase-count">
          {count}
        </div>
      </div>
      { viewName === 'my-showcases' && 
        <ButtonNormal
          className="rfc-create"
          disabled={false}
          onClick={handleCreateShowcaseClick}
        >
          {locale.getResource('CreateShowcase')}
        </ButtonNormal>
      }
    </div>
  );
}

ListHeader.propTypes = {
  text: PropTypes.string,
  count: PropTypes.number,
  onCreateShowcaseClick: PropTypes.func,
};

export default ListHeader;
