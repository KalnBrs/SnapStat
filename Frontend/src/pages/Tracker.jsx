import Field from '../Components/Tracker Components/Field'
import Scoreboard from '../Components/Tracker Components/Scoreboard';
import SidePannel from '../Components/Tracker Components/SidePannel';
import Error from '../Components/Error';
import PlaySelect from '../Components/Tracker Components/PlaySelect';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

function Tracker() {
  const { gameID } = useParams()

  return (
    <div className='w-9/12 flex justify-self-center flex-col mt-15'>
      <Error />
      <div className='flex flex-row'>
        <div className='pr-10 '>
          <Scoreboard />
          <Field game_id={gameID} />
        </div>
        <div className='w-35'>
          <SidePannel />
        </div>
      </div>
      <PlaySelect  />
    </div>
  )
}

export default Tracker