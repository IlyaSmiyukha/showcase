import React from 'react';
import PropTypes from 'prop-types';

import glassIcon from '@/assets/images/svg/icons/icon-glass.svg';
import SvgIcon from '@/components/SvgIcon';

import locale from '@/api/locale';

import './NoSearchResults.less';

const  NoSearchResults = props => {

  return (
    <div className="sc-no-search-results">
      <SvgIcon
        data={glassIcon}
      />
      <span>{locale.getResource('NoMatches')}<span className="search-word"> {props.search}</span></span>
      <span>{locale.getResource('DifferentWords')}</span>
    </div>
  );

};

NoSearchResults.propTypes = {
  search: PropTypes.string,
};

export default NoSearchResults;
