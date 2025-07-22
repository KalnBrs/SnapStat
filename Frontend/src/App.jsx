import { useState } from 'react'

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import './App.css'

import Field from './Components/Field'
import Scoreboard from './Components/Scoreboard';

function App() {
  const [count, setCount] = useState(0)
  const [gameState, setGameState] = useState({
    game_id: 2,
    home_team_id: 1,
    away_team_id: 2,
    home_score: 0,
    away_score: 8,
    home_timeouts: 3,
    away_timeouts: 3,
    quarter: 1,
    down: 1,
    distance: 10,
    ball_on_yard: 25,
    possession_team_id: 1,
    current_drive_id: 6
  })

  const [teams, setTeams] = useState({
    home_team: {
      "team_id": "1",
      "team_name": "Monona Grove",
      "abbreviation": "MG",
      "color": "#78ADD5",
      "logo_url": "https://sportshub2-uploads.vnn-prod.zone/files/sites/3605/2023/02/17230909/MGSD_MGHS_Mascot-Icon_Full-Color_SPOT-1-1.png"
    },
    away_team: {
      "team_id": "2",
      "team_name": "Sun Praire East",
      "abbreviation": "SPE",
      "color": "#D12026",
      "logo_url": null
    }
  })

  return (
    <div className='flex flex-row'>
      <div>
        <Scoreboard data={{game_state: gameState, teams: teams}} />
        <Field home_color={'#78ADD5'} away_color={'#D12026'} game_state={gameState} teams={teams} />
      </div>
      <div className='h-10000000'></div>
    </div>
  )
}

export default App
