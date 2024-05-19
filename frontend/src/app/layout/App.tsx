import logo from './logo.svg';
import React, { useEffect, useState } from 'react';
import api from '../api/api';
import Header from './header';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';

function App(){
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
      <CssBaseline />
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange}/>
      <Container>
        <p>Hola Mundo</p>
      </Container>
    </ThemeProvider>
  );
};

export default App;

