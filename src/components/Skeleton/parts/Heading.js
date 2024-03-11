import React from 'react';

const  Heading = () => {
  return (
    <div className="sc-skeleton-heading">
      <div className="flex-wrap">
        <div className="sc-skeleton-heading-logo sc-skeleton-text-item" />
        <div className="sc-skeleton-heading-hyperlinks sc-skeleton-text-item" />
      </div>
      <div className="sc-skeleton-heading-title sc-skeleton-text-item" />
      <div className="sc-skeleton-heading-paragraph sc-skeleton-text-item" />
      <div className="sc-skeleton-heading-button sc-skeleton-text-item" />
    </div>
  );
};

export default Heading;
