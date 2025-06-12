import React, { useState } from 'react';
import CustomInputField from '../auth/input/CustomInput';
import Button from '../button/Button';

// styles import
import { subscribeToNewsletterAction } from '../../../store/features/slices/contacts/contacts.action';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../../store';
import { emailRegex } from '../../../lib/utils/regex';
import styles from './news-letter.module.css';

const NewsLetter = () => {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.loader);

  const handleSubscription = () => {
    const validateEmail = emailRegex.test(email.trim());
    if (validateEmail) {
      dispatch(subscribeToNewsletterAction(email))
        .then((res) => toast.success(res?.payload.message))
        .catch((err: any) => toast.error(err?.message));
      setEmail('');
      return;
    } else {
      setError('Invalid Email Address');
      return;
    }
  };
  return (
    <div className={styles.container}>
      <h1>Subscribe to our Newsletter</h1>
      <CustomInputField
        placeholder='Enter your Email'
        containsBorder={true}
        border='2px solid #00262A'
        height='36px'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
      />
      <Button
        btnText='Submit'
        className={styles.btn}
        onClick={handleSubscription}
        loading={loading}
      />
    </div>
  );
};

export default NewsLetter;
