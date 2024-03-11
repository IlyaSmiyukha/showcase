import React from 'react';
import PropTypes from 'prop-types';

import Loader from '@/components/Loader';

import './Background.less';

const Background = props => {
  const {
    background,
    bgType,
  } = props;

  return (
    <div className="sc-background-container">
      {background === 'loading' && <Loader />}
      {background && background !== 'loading' && (
        <div className="sc-background" style={{backgroundImage: `url(${background})`}} role="img">
          {bgType !== 'image' && <video src={background} autoPlay muted loop="loop"/>}
        </div>
      )}
    </div>
  );
};

Background.propTypes = {
  addBackgroundClick: PropTypes.func,
  background: PropTypes.string,
  bgType: PropTypes.string,
};

export default Background;
