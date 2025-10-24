import '../index.css'
import { useEffect, useState } from 'react';
import { getGames } from '../Scripts/login';

import GameNotch from '../Components/GameSelectComponents/GameNotch';

function GameSelect() {
  const [games, setGames] = useState([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    async function init() {
      const retGames = await getGames()
      setGames(retGames)
      setReady(true)
    }
    init();
  }, [])

  if (!ready) return <p>Loading...</p>

  return (
    <div className='flex justify-center mt-15'>
      <div className='flex-col'>
        {games.map((item) => (
          <GameNotch key={item.game_id} item={item} />
        ))}
      </div>
    </div>
  )
}

export default GameSelect