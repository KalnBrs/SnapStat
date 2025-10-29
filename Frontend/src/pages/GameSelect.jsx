import '../index.css';
import { useEffect, useState } from 'react';
import { getGames } from '../Scripts/login';

import GameNotch from '../Components/GameSelectComponents/GameNotch';
import CreateGameModal from '../Components/CreateGameModal';
import { useSelector } from 'react-redux';

function GameSelect() {
  const [games, setGames] = useState([]);
  const [ready, setReady] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const user = useSelector(state => state.user.user)

  
useEffect(() => {
  if (!user?.accessToken) return; // wait until token exists

  const init = async () => {
    const retGames = await getGames(user.accessToken);
    const sortedGames = retGames.sort((a, b) => new Date(b.date) - new Date(a.date));
    setGames(sortedGames);
    setReady(true);
  };

  init();
}, [user?.accessToken]); 

  function handleClose() {
    setShowCreate(false);
  }
  
  if (user.username && !ready) return <p className='mt-15'>please reload</p>;
  if (!ready) return <p className='mt-15'>Loading...</p>;

  return (
    <>
      <CreateGameModal
        show={showCreate}
        onConfirm={handleClose}
        onCancel={handleClose}
      />
      <div className="flex justify-center mt-15 flex-col">
        <div className="flex flex-row my-10">
          <p className="mr-auto ml-auto text-4xl">My Games:</p>
          <button
            onClick={() => setShowCreate(true)}
            style={{ backgroundColor: '#457B9D' }}
            className="ml-auto mr-85 px-10"
          >
            Create Game
          </button>
        </div>
        <div className="flex justify-center flex-col mr-auto ml-auto">
          {games.map((item) => (
            <GameNotch key={item.game_id} item={item} />
          ))}
        </div>
      </div>
    </>
  );
}

export default GameSelect;
