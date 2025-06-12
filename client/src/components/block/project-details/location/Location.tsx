import React from 'react';

// styles import
import styles from './location.module.css';

import MapContainer from '../../home/contact-location/MapContainer';

type Props = {
  place: string[];
};

const PlaceLocation: React.FC<Props> = ({ place }) => {
  return (
    <div className={styles.contianer}>
      <div className={styles.location}>
        <h1>Location</h1>
        <p>
          country:{' '}
          {place.map((item, index) => (
            <span key={index}>{item}</span>
          ))}
        </p>
      </div>

      <div>
        <MapContainer />
      </div>
    </div>
  );
};

export default PlaceLocation;
