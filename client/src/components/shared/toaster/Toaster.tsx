import React, { memo } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toast = () => <ToastContainer style={{ marginTop: '10vh', padding: '8px' }} />;

export default memo(Toast);
