import { useState } from 'react';
import CustomInputField from '../../../shared/auth/input/CustomInput';

// styles import
import styles from './contactform.module.css';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { createContactFormAction } from '../../../../store/features/slices/contacts/contacts.action';
import { toast } from 'react-toastify';
import { emailRegex } from '../../../../lib/utils/regex';
import Button from '../../../admin/button/Button.component';

const ContactForm = () => {
  const [fullNames, setFullNames] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.loader);

  const clearForm = () => {
    setEmail('');
    setFullNames('');
    setMessage('');
  };

  const handleContact = () => {
    const data = { fullNames, email: email.trim(), message };
    const validateEmail = emailRegex.test(email);
    if (validateEmail) {
      dispatch(createContactFormAction(data))
        .then((res) => toast.success(res?.payload.message))
        .catch((err: any) => toast.error(err?.message));
      clearForm();
      setError('');
      return;
    } else {
      setError('Invalid Email Address');
      return;
    }
  };

  return (
    <div className={styles.contact__form}>
      <h1>Contact Us</h1>
      <p>Reach out to us for any enquiries</p>
      <div className={styles.form}>
        <CustomInputField
          placeholder='Full Names'
          containsBorder={true}
          border='1px solid #B7B7A4'
          value={fullNames}
          onChange={(e) => setFullNames(e.target.value)}
        />
        <CustomInputField
          placeholder='Email'
          containsBorder={true}
          border='1px solid #B7B7A4'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
        />
        <textarea
          name=''
          placeholder='Your Message'
          cols={30}
          rows={5}
          className={styles.textarea}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
          text='Submit'
          onClick={handleContact}
          loading={loading}
          margin='20px 0 0'
          padding='14px'
        />
      </div>
    </div>
  );
};

export default ContactForm;
