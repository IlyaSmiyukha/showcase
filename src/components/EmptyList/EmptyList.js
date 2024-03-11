import React from 'react';

import PropTypes from 'prop-types';
import locale from '@/api/locale';

import {
  ButtonNormal,
} from '@/components/Buttons';

import './EmptyList.less';

const EmptyList= props =>  {
  const {
    onClick,
    listType,
  } = props;
  return (
    <div className="no-showcases">
      {
        listType === 'my-showcases' && <ButtonNormal
          onClick={onClick}
        >
          {locale.getResource('CreateShowcase')}
        </ButtonNormal>
      }
      <div>{listType === 'my-showcases' ? locale.getResource('NoShowcases') : locale.getResource('NoSharedShowcases')}</div>
    </div>
  );
};

EmptyList.propTypes = {
  onClick: PropTypes.func,
  listType: PropTypes.string,
};

export default EmptyList;
