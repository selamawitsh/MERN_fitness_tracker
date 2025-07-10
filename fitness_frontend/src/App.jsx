import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { lightTheme } from './assets/Theme.js';
import Authentication from './Pages/Authentication.jsx';
import { Container } from '@mui/material';
import { useState } from 'react';
import NavBar from './components/NavBar.jsx';
import Dashboard from './Pages/Dashboard.jsx';
import Workout from './Pages/Workout.jsx';
import Tutorial from './Pages/Tutorial.jsx';
import Contact from './Pages/Contact.jsx';
import Blog from './pages/Blog.jsx'


function App() {
  const [user, setUser] = useState(true);
  return (
    <ThemeProvider theme={lightTheme}>
    <BrowserRouter>

    {user ? 
    (<Container>
      <NavBar/>
      <Routes>
        <Route path='/' exact element={<Dashboard/>} />
        <Route path='/workouts' exact element={<Workout/>} />
        <Route path='/tutorials' exact element={<Tutorial/>} />
        <Route path='/blogs' exact element={<Blog/>} />
        <Route path='/contact' exact element={<Contact/>} />

      </Routes>

    </Container>)
    : 
    (<Container><Authentication /></Container>)}
      
    </BrowserRouter>
    </ThemeProvider>
  )
}

export default App;
