
import './App.css'

import Tracker from './pages/Tracker';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import GameSelect from './pages/gameSelect';

function App() {
  
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
