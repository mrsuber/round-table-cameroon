import React from 'react';
import AppRouter from './routers/AppRouter';
import Toast from './components/shared/toaster/Toaster';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const App = () => {
  return (
    <>
      <Toast />
      <AppRouter />
    </>
  );
};

export default App;
