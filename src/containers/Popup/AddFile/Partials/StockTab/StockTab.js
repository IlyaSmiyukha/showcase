import React from 'react';
import locale from '@/api/locale';

const StockTab = () =>  {
    return (
        <div className="stock-tab">
            <div className="logo" />
            <div className="title">{locale.getResource('CommingSoon')}</div>
            <div className="description">{locale.getResource('StockDescription')}</div>
        </div>
    );
};


export default StockTab;
