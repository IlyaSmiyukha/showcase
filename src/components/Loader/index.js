import * as React from 'react';
import Lottie from 'react-lottie';
import * as animationData from './animation.json';

import './Loader.less';

const Loader = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      progressiveLoad: true,
    },
  };
  return (
    <div className={'FabricanimationTriangleLoaderWrapper'} role="progressbar">
      <Lottie
        options={defaultOptions}
        height={'100%'}
        width={'100%'}
      />
    </div>
  );
};

export default Loader;
