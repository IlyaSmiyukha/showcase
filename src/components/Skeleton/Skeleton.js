import React from 'react';

import './Skeleton.less';

import FileTile from './parts/FileTile';
import Header from './parts/Header';
import Heading from './parts/Heading';

const skeletonTiles = [0,
  1,
  2,
  3];

const  Skeleton = () => {
  return (
    <div className="sc-skeleton">
      <div className="sc-skeleton-content-wrap">
        <Header />
        <div className="sc-skeleton-content">
          <Heading />
          <div className="flex-wrap sc-skeleton-cat">
            <div className="sc-skeleton-cat-title sc-skeleton-text-item"/>
            <div className="sc-skeleton-cat-actions sc-skeleton-text-item"/>
          </div>
          <div className="sc-skeleton-cat-tiles">
            {
              skeletonTiles.map(item => <FileTile key={`right-item-${item}`}/>)
            }
          </div>
        </div>
        <div className="flex-wrap flex-center">
          <div className="sc-skeleton-add-cat sc-skeleton-text-item"/>
        </div>
        <div className="flex-wrap flex-center">
          <div className="sc-skeleton-footer-logo sc-skeleton-text-item"/>
        </div>
      </div>

      <div className="sc-skeleton-right-panel">
        <div className="sc-skeleton-right-panel-header">
          <div className="sc-skeleton-right-panel-dropdown sc-skeleton-text-item" />
        </div>
        <div className="sc-skeleton-right-panel-content">
          {
            skeletonTiles.map(item => <FileTile key={`right-item-${item}`}/>)
          }
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
