import { useState } from 'react'

import './App.css'

import Field from './Components/Field'
import Scoreboard from './Components/Scoreboard';
import SidePannel from './Components/SidePannel';
import Error from './Components/Error';
import PlaySelect from './Components/PlaySelect';

function App() {
  const [errObj, setErrObj] = useState({show: false, message: ''})

  return (
    <>
      <Error />
      <div className='flex flex-row'>
        <div className='pr-10'>
          <Scoreboard />
          <Field />
        </div>
        <div className='w-200'>
          <SidePannel />
        </div>
      </div>
      <PlaySelect />
    </>
  )
}

export default App
