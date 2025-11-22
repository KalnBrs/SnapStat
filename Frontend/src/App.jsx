import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { refreshToken } from './Scripts/login';

import NavBar from './Components/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Teams from './pages/Teams';
import TeamView from './pages/TeamView';
import GameSelect from './pages/GameSelect';
import Tracker from './pages/Tracker';
import Stats from './pages/Stats';

function App() {
  const [ready, setReady] = useState(false);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        await refreshToken();
        setReady(true);
      } catch (e) {
        console.log(e);
        setRedirect(true);
      }
    }
    init();
  }, []);

  if (redirect) return <Navigate to="/login" replace />;
  if (!ready) return null;

  return (
    <Router>
      <div className='w-[99.1vw]'>
        <NavBar />
        <div className='mt-10'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/teams' element={<Teams />} />
            <Route path='/teams/:teamID' element={<TeamView />} />
            <Route path='/tracker' element={<GameSelect />} />
            <Route path='/tracker/:gameID' element={<Tracker />} />
            <Route path='/stats/:gameID' element={<Stats />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
