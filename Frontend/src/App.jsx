
import './App.css'

import Tracker from './pages/Tracker';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import GameSelect from './pages/gameSelect';
import { useEffect, useState } from 'react';
import { refreshToken } from './Scripts/login';
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

function App() {
  const [ready, setReady] = useState(false)


  useEffect(() => {
    async function init() {
      try {
        await refreshToken();
        setReady(true)
        throw new Error()
      } catch (e) {
        console.log(e)
        return <Navigate to="/login/" replace />;
      }
    }
    init()
  }, [])
  
  if (!ready) return null;

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login/' element={<Login />} />
        <Route path='/tracker/' element={<GameSelect />} />
        <Route path='/tracker/:gameID' element={<Tracker />} />
      </Routes>
    </Router>
  )
}

export default App
