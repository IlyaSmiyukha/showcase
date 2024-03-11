import React from 'react';

import './Skeleton.less';

import Header from './parts/Header';

const  SkeletonAnalytics = () => {
  return (
    <div className="sc-skeleton sc-skeleton-analytics">
      <div className="sc-skeleton-content-wrap">
        <Header />
        <div className="flex-wrap sc-skeleton-cat">
          <div className="sc-skeleton-cat-title sc-skeleton-text-item"/>
          <div className="sc-skeleton-cat-actions sc-skeleton-text-item"/>
        </div>
        <div className="sc-skeleton-overal-stats sc-skeleton-text-item" />
        <div className="flex-wrap sc-skeleton-cat">
          <div className="sc-skeleton-cat-title sc-skeleton-text-item"/>
        </div>
        <div className="sc-skeleton-chart sc-skeleton-text-item" />
        <div className="flex-wrap sc-skeleton-cat">
          <div className="sc-skeleton-cat-title sc-skeleton-text-item"/>
        </div>
        <div className="sc-skeleton-list">
          <div className="sc-skeleton-list-item sc-skeleton-text-item"/>
          <div className="sc-skeleton-list-item sc-skeleton-text-item"/>
          <div className="sc-skeleton-list-item sc-skeleton-text-item"/>
          <div className="sc-skeleton-list-item sc-skeleton-text-item"/>
        </div>
      </div>
    </div>
  );
};

export default SkeletonAnalytics;
