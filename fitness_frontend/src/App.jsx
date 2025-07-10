import React from 'react'
import {BrowserRouter} from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { lightTheme } from './assets/Theme.js';
import Authentication from './Pages/Authentication.jsx';



function App() {
  return (
    <ThemeProvider theme={lightTheme}>
    <BrowserRouter>
      <Authentication />
    </BrowserRouter>
    </ThemeProvider>
  )
}

export default App;
