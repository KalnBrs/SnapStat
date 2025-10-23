
import './App.css'

import Tracker from './pages/Tracker';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import GameSelect from './pages/GameSelect';
import { useEffect, useState } from 'react';
import { refreshToken } from './Scripts/login';
import { Navigate } from 'react-router-dom';

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
        return <Navigate to="/login/" replace />;
      }
    }
    init()
  }, [])
  
  if (!ready) return null;

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login/' element={<Login />} />
          <Route path='/tracker/' element={<GameSelect />} />
          <Route path='/tracker/:gameID' element={<Tracker />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
