import '../index.css'
import { useEffect, useState } from 'react';
import { getGames } from '../Scripts/login';

import GameNotch from '../Components/GameSelectComponents/GameNotch';
import CreateGameModal from '../Components/CreateGameModal';

function GameSelect() {
  const [games, setGames] = useState([])
  const [ready, setReady] = useState(false)

  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => {
    async function init() {
      const retGames = await getGames()
      setGames(retGames)
      setReady(true)
    }
    init();
  }, [])

  function handleClose() {
    setShowCreate(false)
  }

  if (!ready) return <p>Loading...</p>

  return (
    <>
      <CreateGameModal
        show={showCreate}
        onConfirm={handleClose}
        onCancel={handleClose}
      />
      <div className='flex justify-center mt-15 flex-col'>
        <div className='flex flex-row my-10'>
          <p className='mr-auto ml-auto text-4xl'>My Games: </p>
          <button onClick={() => setShowCreate(true)} style={{backgroundColor: "#457B9D"}} className='ml-auto mr-85 px-10'>Create Game</button>
        </div>
        <div className='flex justify-center flex-col mr-auto ml-auto'>
          {games.map((item) => (
            <GameNotch key={item.game_id} item={item} />
          ))}
        </div>
      </div>
    </>
  )
}

export default GameSelect