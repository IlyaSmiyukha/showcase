import React from 'react';

import PropTypes from 'prop-types';

import './AddItem.less';

const AddItem = props =>  {
  return (
    <div className="sc-add-item" onClick={props.onClick}>
      {props.text}
    </div>
  );
};

AddItem.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string,
};

export default AddItem;
