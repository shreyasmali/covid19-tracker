import { STATE_CODES } from '../constants';

import axios from 'axios';
import { startOfDay, parse, isBefore } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

const STATES_DATA = 'https://api.covid19india.org/data.json';
const STATES_DAILY_DATA = 'https://api.covid19india.org/states_daily.json';

export const fetchStatesData = async () => {
  const {
    data: { statewise },
  } = await axios.get(STATES_DATA);

  const indiaUpdate = statewise.shift();

  return { indiaUpdate, statewise };
};

const getIndiaDay = () => {
  return startOfDay(utcToZonedTime(new Date(), 'Asia/Kolkata'));
};

const convert = (str) => {
  var date = new Date(str),
    mnth = ('0' + (date.getMonth() + 1)).slice(-2),
    day = ('0' + date.getDate()).slice(-2);
  return [date.getFullYear(), mnth, day].join('-');
};

export const parseStateTimeseries = ({ states_daily: data }) => {
  const statewiseSeries = Object.values(STATE_CODES).reduce((a, c) => {
    a[c] = [];
    return a;
  }, {});

  const today = getIndiaDay();
  for (let i = 0; i < data.length; i += 3) {
    const date = parse(data[i].date, 'dd-MMM-yy', new Date());
    // Skip data from the current day
    if (isBefore(date, today)) {
      Object.entries(statewiseSeries).forEach(([k, v]) => {
        const stateCode = k.toLowerCase();
        const prev = v[v.length - 1] || {};
        // Parser
        const dailyconfirmed = +data[i][stateCode] || 0;
        const dailyrecovered = +data[i + 1][stateCode] || 0;
        const dailydeceased = +data[i + 2][stateCode] || 0;
        const totalconfirmed = +data[i][stateCode] + (prev.totalconfirmed || 0);
        const totalrecovered =
          +data[i + 1][stateCode] + (prev.totalrecovered || 0);
        const totaldeceased =
          +data[i + 2][stateCode] + (prev.totaldeceased || 0);
        // Push
        v.push({
          date: convert(date.toString()),
          dailyconfirmed: dailyconfirmed,
          dailyrecovered: dailyrecovered,
          dailydeceased: dailydeceased,
          totalconfirmed: totalconfirmed,
          totalrecovered: totalrecovered,
          totaldeceased: totaldeceased,
          // Active = Confimed - Recovered - Deceased
          totalactive: totalconfirmed - totalrecovered - totaldeceased,
          dailyactive: dailyconfirmed - dailyrecovered - dailydeceased,
        });
      });
    }
  }

  return statewiseSeries;
};

export const fetchStatesDailyData = async (stateName) => {
  const { data } = await axios.get(STATES_DAILY_DATA);
  const StateData = parseStateTimeseries(data)[STATE_CODES[stateName]];
  // console.log(parseStateTimeseries(data));
  const confirmedData = [];
  const activeData = [];
  const deceasedData = [];
  const recoveredData = [];
  const dates = [];

  StateData.map(
    ({ dailyconfirmed, dailyactive, dailydeceased, dailyrecovered, date }) => {
      confirmedData.push({ x: date, y: dailyconfirmed });
      activeData.push({ x: date, y: dailyactive });
      deceasedData.push({ x: date, y: dailydeceased });
      recoveredData.push({ x: date, y: dailyrecovered });
      dates.push(date);
      return null;
    }
  );

  const confirmed = [
    {
      id: 'Confirmed',
      color: 'hsl(101, 70%, 50%)',
      data: confirmedData,
    },
  ];

  const active = [
    {
      id: 'Confirmed',
      color: 'hsl(101, 70%, 50%)',
      data: confirmedData,
    },
  ];

  const deceased = [
    {
      id: 'Confirmed',
      color: 'hsl(101, 70%, 50%)',
      data: confirmedData,
    },
  ];

  const recovered = [
    {
      id: 'Confirmed',
      color: 'hsl(101, 70%, 50%)',
      data: confirmedData,
    },
  ];

  return {
    confirmed,
    active,
    deceased,
    recovered,
    dates,
    areaName: stateName,
  };
};