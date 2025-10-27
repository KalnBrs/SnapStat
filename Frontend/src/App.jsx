
import './App.css'

import Tracker from './pages/Tracker';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import { useEffect, useState } from 'react';
import { refreshToken } from './Scripts/login';
import { Navigate } from 'react-router-dom';
import NavBar from './Components/NavBar';
import GameSelect from '../src/pages/GameSelect';
import Teams from './pages/Teams';
import TeamView from './pages/TeamView';
import Stats from './pages/Stats';


function App() {
  const [ready, setReady] = useState(false)


  useEffect(() => {
    async function init() {
      try {
        await refreshToken();
        setReady(true)
      } catch (e) {
        console.log(e)
        setReady(true)
        return <Navigate to="/login/" replace />; // Change to a route page
      }
    }
    init()
  }, [])
  
  if (!ready) return null;

  return (
    <>
      <NavBar />
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login/' element={<Login />} />
          <Route path='/teams/' element={<Teams />} />
          <Route path='/teams/:teamID' element={<TeamView />} />
          <Route path='/tracker/' element={<GameSelect />} />
          <Route path='/tracker/:gameID' element={<Tracker />} />
          <Route path='/stats/:gameID' element={<Stats />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
