import React, { Fragment, useState } from 'react';
import { ActiveIcon, InactiveIcon } from '../../../icons';

// styles import
import styles from './filterdropdown.module.css';

const filterOptions = ['Active', 'Completed'];

const FilterDropdown = () => {
  const [isActive, setIsActive] = useState(0);

  return (
    <div className={styles.container}>
      {filterOptions.map((option, index) => (
        <Fragment key={option}>
          <div onClick={() => setIsActive(index)} className={styles.toggler}>
            {isActive === index ? (
              <span>
                {' '}
                <ActiveIcon />
              </span>
            ) : (
              <span>
                <InactiveIcon />
              </span>
            )}
            <p>{option}</p>
          </div>
        </Fragment>
      ))}
    </div>
  );
};

export default FilterDropdown;
