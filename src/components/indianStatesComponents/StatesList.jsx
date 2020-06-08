import React, { useState, useEffect } from 'react';

import { fetchStatesData } from '../../api/indianStatesApi';
import MoonLoading from '../utils/MoonLoader';
import styles from '../../css/IndianStates.module.css';

const StatesList = ({ handleStateSelected }) => {
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');

  useEffect(() => {
    const fetchStatesApi = async () => {
      const data = await fetchStatesData();
      setStates(data.statewise);
    };

    fetchStatesApi();
  }, []);

  const handleStateClick = (state) => {
    handleStateSelected(state);
    setSelectedState(state);
  };

  const renderTableContent = () => {
    return states.map(({ state, confirmed, active, deaths, recovered }) => {
      return (
        <tr
          className={
            selectedState === state ? styles.selectedStateRow : styles.stateRow
          }
          onClick={() => handleStateClick(`${state}`)}
          key={state}
        >
          <td>{state}</td>
          <td>{confirmed}</td>
          <td>{active}</td>
          <td>{deaths}</td>
          <td>{recovered}</td>
        </tr>
      );
    });
  };

  const loadingFunction = (
    <div className={styles.loadingDiv}>
      <MoonLoading size={50} />
    </div>
  );

  if (states.length === 0) {
    return loadingFunction;
  }

  return (
    <div className={styles.stateList}>
      <div className={styles.tableHeader}>
        <table>
          <thead>
            <tr>
              <th>State/UT</th>
              <th>Confirmed</th>
              <th>Active</th>
              <th>Deceased</th>
              <th>Recovered</th>
            </tr>
          </thead>
        </table>
      </div>
      <div className={styles.tableBody}>
        <table>
          <tbody>{renderTableContent()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default StatesList;
