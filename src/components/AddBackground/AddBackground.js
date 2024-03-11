import React from 'react';

import locale from '@/api/locale';

import SvgIcon  from '@/components/SvgIcon';
import videoIcon from '@/assets/images/svg/icons/icon-video.svg';

import './AddBackground.less';

const  AddBackground = () => {
  return (
    <div className="sc-background-container">
      <SvgIcon
        className="sc-video-icon"
        data={videoIcon}
      />

      <span>
        {locale.getResource('AddVideoOrImage')}
      </span>
    </div>
  );
};

export default AddBackground;
