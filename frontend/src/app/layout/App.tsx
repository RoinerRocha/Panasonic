import logo from './logo.svg';
import React, { useEffect, useState } from 'react';
import api from '../api/api';
import Header from './header';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useAppDispatch } from '../../store/configureStore';
import LoadingComponent from './LoadingComponent';
import 'react-toastify/dist/ReactToastify.css';
import { fetchCurrentUser } from '../../features/account/accountSlice';

function App(){
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  useEffect(() =>{
    dispatch(fetchCurrentUser());
    setLoading(false);
  }, [dispatch])


  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark' : 'light';
  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === 'light' ? '#eaeaea' : '#121212'
      }
    }
  })

  function handleThemeChange() {
    setDarkMode(!darkMode);
  }

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position='bottom-right' hideProgressBar theme="colored"/>
      <CssBaseline />
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange}/>
      <Container>
        <Outlet />
      </Container>
    </ThemeProvider>
  );
};

export default App;

