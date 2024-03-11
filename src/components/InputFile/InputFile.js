import React from 'react';

import PropTypes from 'prop-types';

import {
  ButtonNormal,
} from '@/components/Buttons';

import './InputFile.less';

const InputFile = props =>  {

  const {
    onClick,
    buttonName,
    fileName,
  } = props;

  return (
    <div className="sc-file-input">
      <ButtonNormal
        onClick={onClick}
      >
        {buttonName}
      </ButtonNormal>
      <span>{fileName}</span>
    </div>
  );
};

InputFile.propTypes = {
  onClick: PropTypes.func,
  buttonName: PropTypes.string,
  fileName: PropTypes.string,
};

export default InputFile;
