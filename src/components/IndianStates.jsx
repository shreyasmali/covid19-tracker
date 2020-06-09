import React, { useState } from 'react';

import IndiaUpdate from './indianStatesComponents/IndiaUpdate';
import StatesList from './indianStatesComponents/StatesList';
import GraphsList from './indianStatesComponents/GraphsList';
import DistrictsList from './indianStatesComponents/DistrictsList';

import styles from '../css/IndianStates.module.css';

const IndianStates = () => {
  const [clickedState, setClickedState] = useState('Maharashtra');

  const handleStateSelected = (state) => {
    setClickedState(state);
  };

  return (
    <div className={styles.container}>
      <div className={styles.indiaMap}>
        <IndiaUpdate />
        <StatesList handleStateSelected={handleStateSelected} />
      </div>

      <div className={styles.indiaInfo}>
        <GraphsList clicked={clickedState} />
      </div>

      <div className={styles.stateMap}>
        <DistrictsList />
      </div>

      <div className={styles.stateInfo}>
        <h1>Helllllo</h1>
      </div>
    </div>
  );
};

export default IndianStates;
