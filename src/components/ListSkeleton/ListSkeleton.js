import React from 'react';

import './ListSkeleton.less';


const ListSkeleton= () =>  {
  const items = Array.from(Array(4));

  return items.map((item, pos) => (
    <div key={`sk-${pos}`} className="loading-tile-row"  data-testid={`loading-${pos}`}>
      <div className="loading-tile-left"></div>
      <div className="loading-tile-right"></div>
    </div>
  ));
};


export default ListSkeleton;
