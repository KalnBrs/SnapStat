import '../index.css';
import PlayerStats from '../Components/Stats Components/PlayerStats';
import TeamStats from '../Components/Stats Components/TeamStats';
import GameContext from '../Components/Stats Components/GameContext';
import PlaySummary from '../Components/Stats Components/PlaySummary';
import MomentumChart from '../Components/Stats Components/MomentumChart';
import QuickViewDashboard from '../Components/Stats Components/QuickViewDashboard';
import AnnouncerNotes from '../Components/Stats Components/AnnouncerNotes';
import { useEffect, useState } from 'react';
import { getGameOnID, getPlays, getTeam } from '../Scripts/gameSelectUtilities';
import { getRoster } from '../Scripts/teamViewApi';
import { useParams } from 'react-router-dom';
import TeamComparison from '../Components/Stats Components/TeamComparison';

function StatsPage() {
  const { gameID } = useParams()

  const [homeRoster, setHomeRoster] = useState([]);
  const [awayRoster, setAwayRoster] = useState([]);
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);
  const [game, setGame] = useState(null);
  const [plays, setPlays] = useState([])
  const [gamePlays, setGamePlays] = useState([])

  const [homeShow, setHomeShow] = useState(true)
  const [awayShow, setAwayShow] = useState(true)

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval;
  
    async function fetchData() {
      const gameData = await getGameOnID(gameID);
      setGame(gameData);
  
      try {
        setHomeTeam(await getTeam(gameData.home_team_id));
      } catch {
        setHomeTeam([]);
      }
  
      try {
        setAwayTeam(await getTeam(gameData.away_team_id));
      } catch {
        setAwayTeam([]);
      }
  
      try {
        setHomeRoster(await getRoster(gameData.home_team_id));
      } catch {
        setHomeRoster([]);
      }
  
      try {
        setAwayRoster(await getRoster(gameData.away_team_id));
      } catch {
        setAwayRoster([]);
      }
  
      try {
        const plays = await getPlays(gameData.game_id);
        plays.sort((a, b) => b.play_id - a.play_id);
        const shortPlays = plays.slice(0, 5);
        setGamePlays(plays);
        setPlays(shortPlays);
      } catch (err) {
        console.log(err.message);
        setPlays([]);
      }
  
      setLoading(false);
    }
  
    fetchData(); // run immediately once
  
    interval = setInterval(fetchData, 4000); // run again every 4 seconds
  
    // cleanup when component unmounts or gameID changes
    return () => clearInterval(interval);
  }, [gameID]);
  

  if (loading) return <p className="text-white">Loading...</p>;

  return (
    <div className="bg-[#242424] text-white min-h-screen p-6 flex flex-row space-x-6 w-full">
      {/* Left/Main Section */}
      <div className="flex-1 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Game Statistics</h1>
        </div>

        {/* Main Player Tables */}
        <div className="bg-[#2e2e2e] rounded-2xl p-4 shadow-lg">
          <div className='flex flex-row border-b border-gray-600 pb-2 mb-2 items-center'>
            <h2 className="text-xl font-semibold mb-4 ml-10 mr-auto">Home Team Statistics</h2>
            <button className='ml-auto mr-10 px-2' onClick={() => setHomeShow(!homeShow)}>{homeShow ? "Close" : "Open"}</button>
          </div>
          <PlayerStats players={homeRoster} gameId={gameID} show={homeShow} />
        </div>
        <div className="bg-[#2e2e2e] rounded-2xl p-4 shadow-lg">
          <div className='flex flex-row border-b border-gray-600 pb-2 mb-2 items-center'>
            <h2 className="text-xl font-semibold mb-4 ml-10 mr-auto">Away Team Statistics</h2>
            <button className='ml-auto mr-10 px-2' onClick={() => setAwayShow(!awayShow)}>{awayShow ? "Close" : "Open"}</button>
          </div>

          <PlayerStats players={awayRoster} gameId={gameID} show={awayShow} />
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-[300px] flex flex-col space-y-6 mt-20">
        <div className='flex justify-center'>
          <QuickViewDashboard homeTeam={homeTeam} awayTeam={awayTeam} game={game} />
        </div>
        <GameContext context={{
          quarter: game.quarter,
          down: game.down,
          distance: game.distance,
          yardLine: game.ball_on_yard,
          possession: game.possession_team_id,
          homeTeam: homeTeam,
          awayTeam: awayTeam
        }} />
        <MomentumChart plays={gamePlays} homeTeam={homeTeam} awayTeam={awayTeam} />
        <PlaySummary plays={plays} homeTeam={homeTeam} awayTeam={awayTeam} />
        <TeamComparison homeTeam={homeTeam} awayTeam={awayTeam} gameID={gameID} />
        <AnnouncerNotes />
      </div>
    </div>
  );
}

export default StatsPage