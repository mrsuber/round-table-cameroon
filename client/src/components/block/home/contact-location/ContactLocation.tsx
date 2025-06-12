import React, { useEffect } from 'react';

import { LargeMailIcon, LocationIcon, PhoneIcon } from '../../../../icons';
import SectionTitle from '../../../shared/section-title/SectionTitle';
import ContactForm from '../contact-form/ContactForm';

// styles import
import MapContainer from './MapContainer';
import styles from './contactlocation.module.css';
import Button from '../../../admin/button/Button.component';
import { ArrowRightIcon } from '../../../../assets/svg';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../../../routers/paths';

const ContactLocation = () => {
  const navigate = useNavigate()
  return (
    <div>
      <SectionTitle title='Contact/Location' height='80px' />
      <div className={styles.contact__location__wrapper}>
        <div className={styles.contact__location}>
          <div>
            <ContactForm />
          </div>
          <div>
            <MapContainer />
          </div>
        </div>
        <div className={styles.icons}>
          <div className={styles.icon__detailes}>
            <div>
              <LocationIcon />
            </div>
            <div>
              <h2>Location</h2>
              <p>775 Rolling Green Rd.</p>
            </div>
          </div>
          <div className={styles.icon__detailes}>
            <div>
              <LargeMailIcon />
            </div>
            <div>
              <h2>Email:</h2>
              <p>trungkienspktnd@gamail.com</p>
            </div>
          </div>
          <div className={styles.icon__detailes}>
            <div>
              <PhoneIcon />
            </div>
            <div>
              <h2>Phone</h2>
              <p>079 8761 9681 </p>
            </div>
          </div>
        </div>
        <Button
          text='Donate Now!'
          width='16%'
          margin='3rem 0 0'
          bgColor='#003136'
          color='#fff'
          iconAfter
          renderIcon={() => <ArrowRightIcon color='#fff' style={{ marginLeft: '4px' }} />}
          onClick={() => navigate(paths.DONATIONS)}
          padding='13px'
          borderRadius='60px'
        />
      </div>
    </div>
  );
};

export default ContactLocation;
