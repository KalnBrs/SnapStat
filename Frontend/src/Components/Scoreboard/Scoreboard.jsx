import './Scoreboard.css'

const prefix = {
  1: 'st',
  2: 'nd',
  3: 'rd',
  4: 'th'
}

function Scoreboard({ data }) {
  const homeTeam = data.teams.home_team
  const awayTeam = data.teams.away_team
  const gameState = data.game_state

  const quarter = gameState.quarter === 5 ? 'OT' : gameState.quarter + prefix[gameState.quarter]

  return (
    <div className='flex flex-row mb-10 justify-center sticky'>
      <div className='w-100 relative' style={{background: homeTeam.color}}>
        {gameState.possession_team_id == homeTeam.team_id ? <div className='possessionHome'/> : '' }
        <p>{homeTeam.team_name}</p>
        <p>Timeouts: {gameState.home_timeouts}</p>
      </div>
      <div className='flex flex-row items-center'>
        <p className='text-xl font-bold px-5'>{gameState.home_score}</p>
        <p>{quarter}</p>
        <p className='text-xl font-bold px-5'>{gameState.away_score}</p>
      </div>
      <div className='w-100 relative' style={{background: awayTeam.color}}>
        {gameState.possession_team_id == awayTeam.team_id ? <div className='possessionAway'/> : '' }
        <p>{awayTeam.team_name}</p>
        <p>Timeouts: {gameState.away_timeouts}</p>
      </div>
    </div>
  )
}

export default Scoreboard