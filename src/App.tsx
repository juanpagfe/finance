import { Box, CssBaseline, Theme, ThemeProvider, createTheme } from '@mui/material';
import React from 'react'
import './App.css';
import Dashboard from './containers/Dashboard';

function App()
{
  let theme: Theme = createTheme({
    palette: {
      mode: 'dark',
    }
  });

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box>
          <Dashboard></Dashboard>
          <Box className='footer'><h4>Developed by: Juan Pablo Garcia</h4></Box>
        </Box>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
