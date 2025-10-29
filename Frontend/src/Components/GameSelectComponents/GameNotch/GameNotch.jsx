import { useEffect, useState } from 'react'
import '../../../index.css'
import { getTeam } from '../../../Scripts/gameSelectUtilities'
import { useNavigate } from 'react-router-dom'

const prefix = {
  1: 'st',
  2: 'nd',
  3: 'rd',
  4: 'th'
}

const GameNotch = ({item}) => {
  const [homeTeam, setHomeTeam] = useState(null)
  const [awayTeam, setAwayTeam] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    async function init() {
      setHomeTeam(await getTeam(item.home_team_id))
      setAwayTeam(await getTeam(item.away_team_id))
    }
    init()
  }, [])

  const openGame = () => {
    navigate(`/tracker/${item.game_id}`)
  }

  const openStat = () => {
    navigate(`/stats/${item.game_id}`)
  }

  return (
    <div style={{"backgroundColor": "#F2E9E4"}} className='flex flex-right bg-gray-900 w-250 h-30 p-10 my-2 rounded-lg shadow-lg text-black items-center'>
      <div className='flex flex-right mr-auto items-center'>
        <div className='w-5 h-5 rounded-xl' style={{backgroundColor: awayTeam?.color}} />
          <div>
            {awayTeam && (awayTeam.logo_url ? (<img src={awayTeam.logo_url} alt=""className='w-15 mx-2'/>) : <div className="w-15 h-15 rounded-full text-5xl font-extrabold flex items-center justify-center">?</div>)}
            <p>{awayTeam?.abbreviation}</p>
          </div>
        <p>{item.away_score}</p>
        <p className='mx-2'>vs</p>
        <p>{item.home_score}</p>
        <div>
        {homeTeam && (homeTeam.logo_url != null ? (<img src={homeTeam.logo_url} alt=""className='w-15 mx-2'/>) : <div className="w-15 h-15 rounded-full text-5xl font-extrabold flex items-center justify-center">?</div>)}
          <p>{homeTeam?.abbreviation}</p>
        </div>
        <div className='w-5 h-5 rounded-xl' style={{backgroundColor: homeTeam?.color}} />
      </div>
      <div className='flex flex-right ml-auto mr-10 items-center'>
        {item.finished ? <p style={{color: "#417B5A"}} className='mr-6 italic'>Finished</p> : <> 
          <p className='mr-6'>Quarter {item.quarter}</p>
        <p className='mr-6'>{`${item.down + prefix[item.down]} & ${item.distance}`}</p>
        </>}
        
        <p>{item.date 
          ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
          : "N/A"}</p>

      </div>
      <button style={{"backgroundColor": "gray"}} className='text-white p-2' onClick={openGame}>Open Game</button>
      <button style={{"backgroundColor": "#457B9D"}} className='text-white p-2 mx-2' onClick={openStat}>Open Stats</button>
    </div>
  )
}

export default GameNotch