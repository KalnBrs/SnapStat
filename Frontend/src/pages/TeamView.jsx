import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { getGames } from '../Scripts/login'; 
import { getRoster, getTeam } from '../Scripts/teamViewApi'; 
import EditTeamModal from '../Components/EditTeamModal'
import '../index.css';

const GameCard = ({ game, teamID }) => {
  const prefix = { 1: 'st', 2: 'nd', 3: 'rd', 4: 'th' };

  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);

  useEffect(() => {
    async function init() {
      setHomeTeam(await getTeam(game.home_team_id));
      setAwayTeam(await getTeam(game.away_team_id));
    }
    init();
  }, [game.home_team_id, game.away_team_id]);

  // Only compute result if game is finished
  let result = "";
  if (game.finished) {
    if ((game.home_team_id == Number(teamID) && game.home_score > game.away_score) ||
        (game.away_team_id == Number(teamID) && game.away_score > game.home_score)) {
      result = "Win";
    } else if ((game.home_team_id == Number(teamID) && game.home_score < game.away_score) ||
               (game.away_team_id == Number(teamID) && game.away_score < game.home_score)) {
      result = "Loss";
    } else {
      result = "Tie";
    }
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-center bg-gray-800 p-4 rounded-md shadow-md hover:scale-102 transition-transform duration-200 text-white">
      
      <div className="flex items-center gap-4 md:gap-6">
        {/* Away Team */}
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: awayTeam?.color || '#555' }}
          />
          {awayTeam?.logo_url ? (
            <img
              src={awayTeam.logo_url}
              alt=""
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">?</div>
          )}
          <span className="font-bold">{awayTeam?.abbreviation || 'UNK'}</span>
        </div>

        <span className="font-semibold">{game.away_score ?? '-'}</span>
        <span className="mx-1">vs</span>
        <span className="font-semibold">{game.home_score ?? '-'}</span>

        {/* Home Team */}
        <div className="flex items-center gap-2">
          {homeTeam?.logo_url ? (
            <img
              src={homeTeam.logo_url}
              alt=""
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">?</div>
          )}
          <span className="font-bold">{homeTeam?.abbreviation || 'UNK'}</span>
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: homeTeam?.color || '#555' }}
          />
        </div>
      </div>

      {/* Game Info */}
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mt-2 md:mt-0 text-gray-300">
        {game.finished ? (
          <span className={`font-bold ${result === "Win" ? "text-green-400" : result === "Loss" ? "text-red-500" : "text-yellow-300"}`}>
            {result}
          </span>
        ) : (
          <>
            {game.quarter ? <span>Quarter {game.quarter}</span> : null}
            {game.down > 0 && (
              <span>{`${game.down}${prefix[game.down] || 'th'} & ${game.distance}`}</span>
            )}
            
          </>
        )}
        <span>{game.date ? new Date(game.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }) : "N/A"}</span>
      </div>
    </div>
  );
};



function TeamView() {
  const [team, setTeam] = useState(null);
  const [roster, setRoster] = useState([]);
  const [recGame, setRecGame] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  const { teamID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function init() {
      try {
        const allGames = await getGames();
        const teamGames = allGames
          .filter((game) => game.home_team_id == teamID || game.away_team_id == teamID)
          .sort((a, b) => new Date(b.date) - new Date(a.date)); 
  
        setRecGame(teamGames);
  
        setTeam(await getTeam(teamID));
        setRoster(await getRoster(teamID));
      } catch (err) {
        console.error('Error loading team data:', err);
      } finally {
        setLoading(false);
      }
    }
  
    init();
  }, [teamID]);
  

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white bg-[#242424]">
        <p className="text-xl animate-pulse">Loading team data...</p>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white bg-[#242424]">
        <p className="text-xl text-gray-400">Team not found.</p>
      </div>
    );
  }

  return (
    <>
      <EditTeamModal
        show={showEdit}
        onConfirm={() => setShowEdit(false)}
        onCancel={() => setShowEdit(false)}
        team={team}
      />
      <div className="w-11/12 md:w-10/12 mx-auto mt-10 p-6 bg-[#242424] text-white min-h-screen rounded-lg shadow-lg">
        <div className="flex flex-row items-center mb-10">
          {team.logo_url ? (
            <img
              src={team.logo_url}
              alt="Team Logo"
              className="w-20 h-20 rounded-full mr-5"
            />
          ) : (
            <img
              src="/question-sign.png"
              alt="No Logo"
              className="w-20 h-20 rounded-full mr-5"
            />
          )}
          <p className="mr-4 text-4xl font-bold text-white">
            {team.team_name || 'Unnamed Team'}
          </p>
          <p className="mr-auto text-4xl font-bold text-white">
            ({team.abbreviation || 'N/A'})
          </p>
          <button
            style={{ backgroundColor: '#457B9D' }}
            className="ml-auto px-6 py-2 rounded text-white shadow-md hover:scale-105 transition-transform duration-200"
            onClick={() => setShowEdit(true)}
          >
            Edit Team
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 bg-gray-800 rounded-md shadow-md p-4">
            <p className="text-2xl font-semibold mb-3 text-white">Roster</p>
            {roster.length === 0 ? (
              <p className="text-gray-400">No players on this roster yet.</p>
            ) : (
              <div className="overflow-x-auto max-h-[75vh]">
                <table className="w-full text-left border-collapse text-gray-200">
                  <thead className="sticky top-0 bg-gray-800">
                    <tr className="border-b border-gray-600 text-gray-300">
                      <th className="py-2">#</th>
                      <th className="py-2">Name</th>
                      <th className="py-2">Position</th>
                      <th className="py-2">Height</th>
                      <th className="py-2">Weight</th>
                      <th className="py-2">Year</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {roster.map((player) => (
                      <tr key={player.player_id || player.number}>
                        <td className="py-2">{player.number || 'N/A'}</td>
                        <td className="py-2">{player.name || 'N/A'}</td>
                        <td className="py-2">{player.position || 'N/A'}</td>
                        <td className="py-2">{player.height || 'N/A'}</td>
                        <td className="py-2">{player.weight || 'N/A'}</td>
                        <td className="py-2">{player.year || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="flex-[1.4] flex flex-col bg-gray-800 rounded-md shadow-md p-4">
            <p className="text-2xl font-semibold mb-3 text-white">
              Recent / Upcoming Games
            </p>
            {recGame.length === 0 ? (
              <p className="text-gray-400">No games found for this team.</p>
            ) : (
              <div className="flex flex-col gap-4 overflow-hidden overflow-y-auto max-h-[75vh] pr-2">
                {recGame.map((game) => (
                  <GameCard
                    key={game.game_id}
                    game={game}
                    teamID={team.team_id} // pass the current team ID
                    onOpenGame={(g) => navigate(`/games/${g.game_id}`)}
                    onOpenStats={(g) => navigate(`/stats/${g.game_id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default TeamView;
