import React, {
  useRef,
  useState,
  useEffect
 } from 'react';

import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

import { useSelector } from 'react-redux';

import {
  getChartStats
} from '@/store/selectors/analytics';

import locale from '@/api/locale';

import { formatAnalyticsDate } from '@/helpers'

import './AnalyticsGraph.less';

const AnalyticsGraph = props =>  {
  const parentRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(500);
  const [chartData, setChartData] = useState([]);
  const stats = useSelector(state => getChartStats(state));

  const parseData = () => {
    const result = stats.visits.map(item => {
      const uniq = stats.uniqueVisits.find(uniqItem => uniqItem.timestamp === item.timestamp);
      return {
        name: formatAnalyticsDate(item.timestamp) || 0,
        'Total visits': item.visits || 0,
        'Unique visitors': uniq ? uniq.visits : 0
      }
    })
    return result
  }

  useEffect(() => {
    setChartWidth(parentRef.current.clientWidth - 40);
    setChartData(parseData())
  }, [stats]);

  return (
    <div className="sc-analytics-block" ref={parentRef}>
      <div className="sc-analytics-title" >
        <h3>{locale.getResource('AnalyticsGraphTitle')}</h3>
      </div>
      <AreaChart width={chartWidth} height={250} data={chartData}>
        <XAxis dataKey="name" interval='preserveEnd'/>
        <YAxis />
        <Tooltip />
        <Legend />
        <CartesianGrid vertical={false} strokeDasharray="4" />
        <Area type="monotone" dataKey="Total visits" stroke="#a246d1" fillOpacity={1} fill="#612b5e" />
        <Area type="monotone" dataKey="Unique visitors" stroke="#4754d0" fillOpacity={1} fill="#4655d2" />
      </AreaChart>
    </div>
  );
};


export default AnalyticsGraph;
