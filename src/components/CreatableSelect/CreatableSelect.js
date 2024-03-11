import React from 'react';

import CreatableSelect from 'react-select-new/creatable';

import {selectStyles} from '@/helpers';

const Creatable = props =>  {
  return (
    <CreatableSelect  {...props}  styles={selectStyles} />
  );
};

export default Creatable;
