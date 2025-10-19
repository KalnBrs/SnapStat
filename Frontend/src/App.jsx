
import './App.css'

import Tracker from './pages/Tracker';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';


function App() {
  
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/tracker/' element={<p>No Game ID Specified</p>} />
        <Route path='/tracker/:gameID' element={<Tracker />} />
      </Routes>
    </Router>
  )
}

export default App
