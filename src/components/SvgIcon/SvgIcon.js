import React from 'react';
import PropTypes from 'prop-types';

import uuid from 'uuid-random';

import './SvgIcon.less';

const  SvgIcon  = props => {

  const id = `svg-${uuid()}`;
  const {
    data,
    className,
    testid,
  } = props;

  const getParsedHTML = () => {
    const {
      data,
    } = props;
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(data.content, 'text/html');
    const node = htmlDoc.querySelector('symbol');

    return node ? node.innerHTML : null;
  };

  const content = _.get(data, 'node.innerHTML') || getParsedHTML();
  const {
    viewBox,
  } = data;

  return (
    <svg
      className={className}
      version="1.1"
      id={id}
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox={viewBox}
      data-testid={testid}
      dangerouslySetInnerHTML={{ __html: content }}>
    </svg>
  );
};

SvgIcon.propTypes = {
  className: PropTypes.string,
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]),
};

export default SvgIcon;
