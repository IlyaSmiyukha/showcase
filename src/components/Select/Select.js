import React from 'react';

import Select from 'react-select-new';

import {selectStyles} from '@/helpers';

const SelectComponent = props =>  {
  return (
    <Select  {...props}  styles={selectStyles} />
  );
};

export default SelectComponent;
