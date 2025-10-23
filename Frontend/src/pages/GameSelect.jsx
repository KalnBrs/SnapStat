import { useNavigate } from 'react-router-dom';
import '../index.css'
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getGames } from '../Scripts/login';

import GameNotch from '../Components/GameSelectComponents/GameNotch';

function GameSelect() {
  const navigate = useNavigate();
  const user = useSelector(state => state.user.user)
  
  const [games, setGames] = useState([])

  const [ready, setReady] = useState(false)

  useEffect(() => {
    async function init() {
      const retGames = await getGames()
      console.log(retGames)
      setGames(retGames)
      setReady(true)
    }
    init();
  }, [])

  const handleClick = () => {
    navigate('/tracker/2')
  }

  if (!ready) return <p>Loading...</p>

  return (
    <div>
      {games.map((item) => (
        <GameNotch key={item.game_id} item={item} />
      ))}
    </div>
  )
}

export default GameSelect