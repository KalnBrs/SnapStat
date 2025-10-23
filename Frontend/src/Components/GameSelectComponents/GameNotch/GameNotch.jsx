import { useEffect, useState } from 'react'
import './GameNotch.css'
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
      console.log(await getTeam(item.home_team_id))
      console.log(await getTeam(item.away_team_id))
      setHomeTeam(await getTeam(item.home_team_id))
      setAwayTeam(await getTeam(item.away_team_id))
    }
    init()
  }, [])

  const openGame = () => {
    navigate(`/tracker/${item.game_id}`)
  }

  return (
    <div style={{"backgroundColor": "#F2E9E4"}} className='flex flex-right bg-gray-900 w-200 h-30 p-10 my-2 rounded-lg shadow-lg text-black items-center'>
      <div className='flex flex-right mr-auto items-center'>
        <div className='w-5 h-5' style={{backgroundColor: awayTeam?.color}} />
          <div>
            {awayTeam && (awayTeam.logo_url != null ? (<img src={awayTeam.logo_url} alt=""className='w-15 mx-2'/>) : <img src='/question-sign.png' className='w-15 mx-2'></img>)}
            <p>{awayTeam?.abbreviation}</p>
          </div>
        <p>{item.away_score}</p>
        <p className='mx-2'>vs</p>
        <p>{item.home_score}</p>
        <div>
          {homeTeam && <img src={homeTeam.logo_url} alt="" className='w-15 mx-2' />}
          <p>{homeTeam?.abbreviation}</p>
        </div>
        <div className='w-5 h-5' style={{backgroundColor: homeTeam?.color}} />
      </div>
      <div className='flex flex-right ml-auto mr-10 items-center'>
        <p className='mr-6'>Quarter {item.quarter}</p>
        <p className='mr-6'>{`${item.down + prefix[item.down]} & ${item.distance}`}</p>
        <p>{item.ball_on_yard} yard line</p>

      </div>
      <button style={{"backgroundColor": "gray"}} className='text-white p-2' onClick={openGame}>Open Game</button>
    </div>
  )
}

export default GameNotch